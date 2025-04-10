import React, { createContext, useContext, useEffect, useState, useCallback } from "react"; // Added useCallback
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types"; // Import Tables type

type Profile = Tables<'profiles'>; // Define Profile type alias

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null; // Add profile state
  isLoading: boolean; // Overall auth loading state
  isProfileLoading: boolean; // Specific profile loading state
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // Add profile state
  const [isLoading, setIsLoading] = useState(true); // For initial session check
  const [isProfileLoading, setIsProfileLoading] = useState(false); // For profile fetch
  const navigate = useNavigate();

  // Function to create a profile
  const createProfile = useCallback(async (user: User) => {
    try {
      console.log('Creating profile for user:', user.id);

      // First check if profile already exists
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', user.id);

      if (count && count > 0) {
        console.log('Profile already exists, fetching it instead of creating');
      } else {
        // Create the profile if it doesn't exist
        const { error } = await supabase.from('profiles').insert({
          id: user.id,
          username: user.user_metadata?.username || null,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: null,
        });

        if (error) {
          // If error is not a duplicate key error, throw it
          if (!error.message.includes('duplicate key value')) {
            throw error;
          } else {
            console.log('Profile already exists (duplicate key), continuing to fetch');
          }
        }
      }

      // Fetch the profile (whether newly created or existing)
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        console.log('Successfully fetched profile:', data);
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error creating/fetching profile:', error.message);
      // Only show toast for non-duplicate key errors
      if (!error.message.includes('duplicate key value')) {
        toast({
          variant: "destructive",
          title: "Error with profile",
          description: error.message,
        });
      }
    }
  }, [toast]);

  // Function to fetch profile
  const fetchProfile = useCallback(async (userId: string) => {
    setIsProfileLoading(true); // Start loading profile
    try {
      console.log('Fetching profile for user ID:', userId);

      // First, check if the profile exists using a count query
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', userId);

      console.log('Profile count check:', { count, error: countError });

      // If profile exists, fetch it
      if (count && count > 0) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        console.log('Profile fetch response:', { data, error });

        if (error) throw error;
        if (data) {
          setProfile(data);
          return;
        }
      } else {
        // Profile doesn't exist, create one
        console.log('No profile found, creating one');
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await createProfile(userData.user);
          return;
        }
      }

      // If we get here, something went wrong
      setProfile(null);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      setProfile(null); // Reset profile on error
    } finally {
      setIsProfileLoading(false); // Stop loading profile
    }
  }, [createProfile]);


  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);

        if (currentUser) {
          try {
            // Try to fetch profile, with retry mechanism
            let retryCount = 0;
            const maxRetries = 3;
            let profileFetched = false;

            while (!profileFetched && retryCount < maxRetries) {
              try {
                await fetchProfile(currentUser.id);
                profileFetched = true;
              } catch (err) {
                console.error(`Profile fetch attempt ${retryCount + 1} failed:`, err);
                retryCount++;
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }

            if (!profileFetched) {
              console.error('Failed to fetch profile after multiple attempts');
            }
          } catch (error) {
            console.error('Error in auth state change handler:', error);
          }
        } else {
          setProfile(null); // Clear profile on sign out
        }

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('Auth state change: SIGNED_OUT event detected');
          // Clear user data on sign out
          setUser(null);
          setSession(null);
          setProfile(null);

          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetchProfile(currentUser.id); // Fetch profile on initial load
        } catch (error) {
          console.error('Error fetching profile on initial load:', error);
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchProfile, toast]); // Add fetchProfile and toast to dependency array

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

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // Manually clear the user state
      setUser(null);
      setSession(null);
      setProfile(null);

      // Clear any storage items that might be persisting the session
      const clearBrowserStorage = () => {
        // Clear specific Supabase items
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-bjlqyztfzvlhpumrpsgh-auth-token');

        // Clear session storage items
        sessionStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('sb-bjlqyztfzvlhpumrpsgh-auth-token');

        // Find and remove any other Supabase-related items
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            console.log('Removing localStorage item:', key);
            localStorage.removeItem(key);
          }
        });

        Object.keys(sessionStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            console.log('Removing sessionStorage item:', key);
            sessionStorage.removeItem(key);
          }
        });
      };

      clearBrowserStorage();

      console.log('User signed out successfully');

      // Navigate to auth page and force a page reload to clear any remaining state
      navigate("/auth");

      // Add a small delay before reloading to ensure navigation completes
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error resetting password",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile, // Add profile to context value
        isLoading,
        isProfileLoading, // Add isProfileLoading to context value
        signUp,
        signIn,
        signOut,
        resetPassword,
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
