import { useState, useEffect, useCallback } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

// Interface matching the profiles table structure (including new fields)
interface ProfileData {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  learning_goals: string | null;
}

const ProfilePage = () => {
  const { user } = useAuth(); // Removed refreshUser
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for editable fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  // Avatar URL editing might require file upload, handle later
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [learningGoals, setLearningGoals] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, phone_number, bio, location, website_url, learning_goals') // Select all profile fields
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore 'No rows found' error
        throw error;
      }

      if (data) {
        setProfile(data as ProfileData | null); // Allow null type
        // Initialize state with fetched data or defaults
        setUsername(data.username || '');
        setFullName(data.full_name || user.user_metadata?.full_name || ''); // Prioritize profiles table, fallback to metadata
        // Initialize all profile fields
        setPhoneNumber(data.phone_number || '');
        setBio(data.bio || '');
        setLocation(data.location || '');
        setWebsiteUrl(data.website_url || '');
        setLearningGoals(data.learning_goals || '');
      } else {
        // Initialize with metadata if no profile row exists yet
         setFullName(user.user_metadata?.full_name || '');
      }

    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Depend on the memoized fetchProfile

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // 1. Update the 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: username || null, // Ensure null if empty
          full_name: fullName || null,
          phone_number: phoneNumber || null,
          bio: bio || null,
          location: location || null,
          website_url: websiteUrl || null,
          learning_goals: learningGoals || null,
          updated_at: new Date().toISOString(), // Update timestamp
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Update user metadata (only fields stored there, like full_name)
      // Note: Supabase might automatically sync full_name if using triggers,
      // but explicit update ensures consistency. Avatar update needs separate logic.
      const metadataUpdates: { full_name?: string } = {};
      if (fullName !== user.user_metadata?.full_name) {
        metadataUpdates.full_name = fullName;
      }

      if (Object.keys(metadataUpdates).length > 0) {
         const { error: userError } = await supabase.auth.updateUser({
           data: metadataUpdates
         });
         if (userError) throw userError;
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      await fetchProfile(); // Re-fetch profile data after successful save

    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };


  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    // Use the state variable for consistency during editing
    return fullName.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <PageLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>View and manage your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-20 w-full" />
              </div>
            ) : user ? (
              <>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {/* Display avatar from metadata, editing needs separate flow */}
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={fullName || 'User'} />
                    <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                  </Avatar>
                  {/* Add Avatar Upload Button Here (Future) */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name</Label>
                     <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="username">Username</Label>
                     <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., codingwizard" />
                   </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled /> {/* Email usually not editable */}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Your phone number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about yourself" />
                </div>

                 <div className="space-y-2">
                   <Label htmlFor="location">Location</Label>
                   <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., San Francisco, CA" />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="websiteUrl">Website URL</Label>
                   <Input id="websiteUrl" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com" />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="learningGoals">Learning Goals</Label>
                   <Textarea id="learningGoals" value={learningGoals} onChange={(e) => setLearningGoals(e.target.value)} placeholder="What are you hoping to learn?" />
                 </div>
              </>
            ) : (
              <p>Please log in to view your profile.</p>
            )}
          </CardContent>
          {!isLoading && user && (
            <CardFooter className="border-t pt-6">
               <Button onClick={handleSave} disabled={isSaving}>
                 {isSaving ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   "Save Profile"
                 )}
               </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
