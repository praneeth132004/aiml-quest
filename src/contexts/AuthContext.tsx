import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;
// Use the actual type for user_roadmaps row
type UserRoadmap = Tables<'user_roadmaps'>;

// Define a more specific type for the preferences JSON object
interface RoadmapPreferences {
  learningStyle?: string[];
  goals?: string[];
  interests?: string[];
  experienceLevel?: string;
  timeCommitment?: string;
  completedModules?: string[]; // Explicitly define completedModules
  // Add other potential preference fields if known
}

// Updated interface based on user_roadmaps table
interface RoadmapData {
  roadmapId: string;
  modules: string[]; // Assuming this holds all modules in the roadmap
  preferences: RoadmapPreferences | null; // Use the specific type, allow null
  // Add other relevant fields from user_roadmaps if necessary
}

// Removed CourseProgress interface

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roadmapData: RoadmapData | null; // Renamed from roadmapProgress
  // Removed courseProgress
  isLoading: boolean; // Initial auth check loading
  isExtendedDataLoading: boolean; // Loading for profile, roadmap, etc.
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null); // Renamed state
  // Removed courseProgress state
  const [isLoading, setIsLoading] = useState(true);
  const [isExtendedDataLoading, setIsExtendedDataLoading] = useState(false);
  const navigate = useNavigate();

  const createProfile = useCallback(async (user: User): Promise<Profile | null> => {
    if (!user || !user.id) {
        console.error("createProfile called with invalid user object");
        return null;
    }
    try {
      console.log('Checking/Creating profile for user:', user.id);
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingProfile) {
        console.log('Profile already exists.');
        return existingProfile;
      } else {
        console.log('Profile does not exist, creating...');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.user_metadata?.username || null,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        console.log('Profile created successfully.');
        return newProfile;
      }
    } catch (error: any) {
      console.error('Error creating/fetching profile:', error.message);
      toast({
        variant: "destructive",
        title: "Error initializing profile",
        description: error.message,
      });
      return null;
    }
  }, [toast]);

  const fetchExtendedUserData = useCallback(async (currentUser: User) => {
    if (!currentUser || !currentUser.id) {
        console.log("fetchExtendedUserData skipped: invalid user object provided.");
        return;
    }
    const userId = currentUser.id;
    setIsExtendedDataLoading(true);
    console.log('Fetching extended user data for:', userId);
    // Declare variables outside the try block using Supabase types
    let profileResult: PromiseSettledResult<Profile | null> | undefined;
    // Use PostgrestSingleResponse with the selected fields for roadmapResult type
    let roadmapResult: PromiseSettledResult<import('@supabase/supabase-js').PostgrestSingleResponse<{ id: string; modules: string[]; preferences: any; }>> | undefined;


    try {
      // Fetch profile and roadmap data concurrently
      [profileResult, roadmapResult] = await Promise.allSettled([ // Assign to variables
        // 1. Profile Fetch
        createProfile(currentUser),

        // 2. Roadmap Data Fetch (from user_roadmaps table)
        supabase
          .from('user_roadmaps') // Use the correct table name
          .select('id, modules, preferences') // Select relevant columns
          .eq('user_id', userId)
          .maybeSingle(), // Assuming one roadmap per user for now

        // 3. Removed Course Progress Fetch
      ]);

      // Process Profile Result
      if (profileResult.status === 'fulfilled' && profileResult.value) {
        setProfile(profileResult.value);
        console.log('Profile data loaded:', profileResult.value);
      } else if (profileResult.status === 'rejected') {
        console.error('Failed to fetch/create profile:', profileResult.reason);
        setProfile(null);
        toast({ variant: "destructive", title: "Error loading profile data" });
      }

      // Process Roadmap Result
      if (roadmapResult.status === 'fulfilled' && roadmapResult.value?.data) {
        const dbRoadmap = roadmapResult.value.data;
        // Ensure preferences are correctly typed when setting state
        const mappedRoadmapData: RoadmapData = {
          roadmapId: dbRoadmap.id,
          modules: dbRoadmap.modules || [], // Handle null case for modules array
          // Cast preferences to the specific type, handle potential null/undefined
          preferences: (dbRoadmap.preferences as RoadmapPreferences | null | undefined) ?? null,
        };
        setRoadmapData(mappedRoadmapData);
        console.log('Roadmap data loaded:', mappedRoadmapData);
      } else {
         if (roadmapResult.status === 'rejected') {
            console.error('Failed to fetch roadmap data:', roadmapResult.reason);
            // Check for RLS issues specifically
             if (roadmapResult.reason?.message?.includes('security policy')) {
                 toast({ variant: "destructive", title: "Roadmap Access Denied", description: "Check Row Level Security policies for user_roadmaps." });
             }
         } else {
             console.log('No roadmap data found for user.'); // Handle case where maybeSingle returns null
         }
        setRoadmapData(null); // Set to null or default state
      }

      // Removed Course Result Processing

    } catch (error: any) {
      console.error('Error fetching extended user data:', error.message);
      toast({
        variant: "destructive",
        title: "Error loading user data",
        description: error.message,
      });
      setProfile(null);
      setRoadmapData(null); // Reset roadmap data on error
      // Removed courseProgress reset
    } finally {
      setIsExtendedDataLoading(false);
      console.log('Finished fetching extended user data.');
      // Return the fetched data for the caller to use, handle potential undefined results
      return {
        profile: profileResult?.status === 'fulfilled' ? profileResult.value : null,
        // Access data correctly from PostgrestSingleResponse within the fulfilled result
        roadmap: roadmapResult?.status === 'fulfilled' ? roadmapResult.value.data : null
      };
    }
  }, [createProfile, toast]);

  useEffect(() => {
    let isMounted = true;

    const handleSession = async (session: Session | null, event?: string) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);

      let fetchedData: { profile: Profile | null; roadmap: any } | undefined; // Define type for fetched data

      if (currentUser) {
        console.log('User detected, fetching extended data...');
        fetchedData = await fetchExtendedUserData(currentUser); // Capture the returned data
      } else {
        console.log('No user detected, clearing extended data...');
        setProfile(null);
        setRoadmapData(null); // Clear roadmap data
        // Removed courseProgress clear
        setIsExtendedDataLoading(false);
      }
      setIsLoading(false); // Set loading false after initial check or data fetch attempt

      // --- Post-Login Navigation Logic ---
      if (event === 'SIGNED_IN' && currentUser && fetchedData) {
        console.log('Handling SIGNED_IN navigation. Roadmap data:', fetchedData.roadmap);
        if (!fetchedData.roadmap) { // Check if roadmap data is missing (implies onboarding needed)
          console.log('No roadmap data found, navigating to /onboarding');
          navigate('/onboarding');
        } else {
          console.log('Roadmap data found, navigating to /dashboard');
          navigate('/dashboard'); // Navigate to dashboard if onboarding seems complete
        }
      }
      // --- End Post-Login Navigation Logic ---
    };


    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check completed.');
      handleSession(session); // Pass undefined for event initially
    }).catch(error => {
       console.error("Error getting initial session:", error);
       if (isMounted) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        handleSession(session, event); // Pass the event type

        // Keep toasts separate from navigation logic
        if (event === 'SIGNED_IN') {
          toast({ title: "Welcome back!", description: "You have successfully signed in." });
        } else if (event === 'SIGNED_OUT') {
          toast({ title: "Signed out", description: "You have been signed out." });
          if (isMounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setRoadmapData(null); // Clear roadmap data
            // Removed courseProgress clear
          }
          // Navigate to auth page on explicit sign out
          navigate('/auth');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      console.log('Auth subscription unsubscribed.');
    };
  }, [fetchExtendedUserData, toast]);

  const refreshUserData = useCallback(async () => {
    if (user) {
      await fetchExtendedUserData(user);
    } else {
      console.log("Cannot refresh user data: No user logged in.");
    }
  }, [user, fetchExtendedUserData]);

  const signUp = async (email: string, password: string, fullName: string, username: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
          },
        },
      });
      if (error) throw error;
      toast({ title: "Account created", description: "Please check your email to confirm your account." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error signing up", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error signing in", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      setRoadmapData(null); // Clear roadmap data
      // Removed courseProgress clear

      console.log('User signed out successfully');
      // Navigation is now handled in onAuthStateChange for SIGNED_OUT
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({ variant: "destructive", title: "Error signing out", description: error.message });
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });
      if (error) throw error;
      toast({ title: "Password reset email sent", description: "Check your email for a password reset link." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error resetting password", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roadmapData, // Use renamed value
        // Removed courseProgress
        isLoading,
        isExtendedDataLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
