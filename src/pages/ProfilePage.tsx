import { useState, useEffect, useCallback } from 'react';
// Removed PageLayout import as it's handled by routing now
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardFooter
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Removed Button import
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
// Removed Loader2 import

// Removed local ProfileData interface - type comes from AuthContext

const ProfilePage = () => {
  // Get user, profile, and loading states from AuthContext
  const { user, profile, isLoading: isAuthLoading, isExtendedDataLoading } = useAuth();
  // Removed local profile state, isLoading state, and fetchProfile function/useEffect

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    // Use profile state directly
    return (profile?.full_name || '').split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    // Removed PageLayout wrapper
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            {/* Updated CardDescription */}
            <CardDescription>View your profile information. To edit, please go to the Settings page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Use combined loading state from context */}
            {(isAuthLoading || isExtendedDataLoading) ? (
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
                    {/* Use profile state for avatar */}
                    <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                    {/* Use profile state for fallback */}
                    <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name</Label>
                     {/* Use profile state, remove onChange, add disabled */}
                     <Input id="fullName" value={profile?.full_name || ''} disabled />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="username">Username</Label>
                     {/* Use profile state, remove onChange, add disabled */}
                     <Input id="username" value={profile?.username || ''} placeholder="N/A" disabled />
                   </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ''} disabled /> {/* Email usually not editable */}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {/* Use profile state, remove onChange, add disabled */}
                  <Input id="phoneNumber" type="tel" value={profile?.phone_number || ''} placeholder="N/A" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {/* Use profile state, remove onChange, add disabled */}
                  <Textarea id="bio" value={profile?.bio || ''} placeholder="N/A" disabled />
                </div>

                 <div className="space-y-2">
                   <Label htmlFor="location">Location</Label>
                   {/* Use profile state, remove onChange, add disabled */}
                   <Input id="location" value={profile?.location || ''} placeholder="N/A" disabled />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="websiteUrl">Website URL</Label>
                   {/* Use profile state, remove onChange, add disabled */}
                   <Input id="websiteUrl" type="url" value={profile?.website_url || ''} placeholder="N/A" disabled />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="learningGoals">Learning Goals</Label>
                   {/* Use profile state, remove onChange, add disabled */}
                   <Textarea id="learningGoals" value={profile?.learning_goals || ''} placeholder="N/A" disabled />
                 </div>
              </>
            ) : (
              <p>Please log in to view your profile.</p>
            )}
          </CardContent>
          {/* Removed CardFooter with Save button */}
        </Card>
    </div>
    // Removed closing PageLayout tag
  );
};

export default ProfilePage;
