import React, { useState } from 'react'; // Added useState for potential form handling later
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const SettingsPage = () => {
  // Use AuthContext to get user data and loading states
  const { user, profile, isLoading: isAuthLoading, isExtendedDataLoading } = useAuth();
  const isLoading = isAuthLoading || isExtendedDataLoading; // Combined loading state

  // TODO: Add state and handlers for form inputs (e.g., useState for newEmail, newPassword etc.)

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  // Placeholder notification settings - fetch/update these via context or API later
  const notifications = {
      courseUpdates: true,
      communityActivity: false,
      platformAnnouncements: true,
  };
  // Placeholder preferences - fetch/update these via context or API later
  const preferences = {
      topics: ['Machine Learning', 'Data Science'],
      goals: 'Become proficient in Python for AI.',
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account details and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                // Skeleton Loader for Account Tab
                <div className="space-y-6">
                  <div className="space-y-2 border-b pb-4">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                    <Skeleton className="h-4 w-1/5 mt-4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-1/6 mt-2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-9 w-24 mt-2" />
                  </div>
                  <div className="space-y-2 border-b pb-4">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/5 mt-4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-1/5 mt-2" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-9 w-28 mt-2" />
                  </div>
                  <div className="space-y-2 border-b pb-4">
                     <Skeleton className="h-6 w-1/4 mb-2" />
                     <Skeleton className="h-4 w-1/5 mt-4" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-4 w-1/5 mt-2" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-4 w-1/5 mt-2" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-9 w-32 mt-2" />
                  </div>
                   <div className="space-y-2">
                     <Skeleton className="h-6 w-1/4 mb-2 text-destructive" />
                     <Skeleton className="h-4 w-full mb-2" />
                     <Skeleton className="h-9 w-36" />
                   </div>
                </div>
              ) : user ? (
                // Actual Account Content
                <>
                  {/* Profile Section */}
                  <div className="space-y-2 border-b pb-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                        <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">Change Avatar</Button> {/* TODO: Implement avatar change logic */}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue={profile?.full_name || ''} /> {/* TODO: Add state/handler */}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={profile?.bio || ''} placeholder="Tell us a little about yourself" /> {/* TODO: Add state/handler */}
                    </div>
                    <Button size="sm">Save Profile</Button> {/* TODO: Implement save logic */}
                  </div>

                  {/* Email Section */}
                  <div className="space-y-2 border-b pb-4">
                    <h3 className="text-lg font-medium">Email Address</h3>
                    <p className="text-sm text-muted-foreground">Current email: {user.email}</p>
                    <div className="space-y-1">
                      <Label htmlFor="newEmail">New Email Address</Label>
                      <Input id="newEmail" type="email" placeholder="new.email@example.com" /> {/* TODO: Add state/handler */}
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="confirmEmail">Confirm New Email</Label>
                  <Input id="confirmEmail" type="email" placeholder="Confirm new email" /> {/* TODO: Add state/handler */}
                </div>
                <Button size="sm">Change Email</Button> {/* TODO: Implement change email logic */}
              </div>

              {/* Password Section */}
              <div className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" /> {/* TODO: Add state/handler */}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" /> {/* TODO: Add state/handler */}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" /> {/* TODO: Add state/handler */}
                </div>
                <Button size="sm">Change Password</Button> {/* TODO: Implement change password logic */}
              </div>

              {/* Delete Account Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <Button variant="destructive" size="sm">Delete My Account</Button> {/* TODO: Implement delete account logic */}
              </div>
            </>
            ) : (
               <p>Please log in to view settings.</p> // Message if not logged in
            )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified. All notifications are sent via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Fetch actual notification settings and add state/handlers */}
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
                <Label htmlFor="courseUpdates" className="flex flex-col space-y-1">
                  <span>Course Updates</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive emails about new courses, lessons, or updates to enrolled content.
                  </span>
                </Label>
                <Switch
                  id="courseUpdates"
                  defaultChecked={notifications.courseUpdates}
                  aria-label="Toggle course update emails"
                  // onCheckedChange={...}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
                <Label htmlFor="communityActivity" className="flex flex-col space-y-1">
                  <span>Community Activity</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get notified about replies to your posts or comments, and new posts in followed topics.
                  </span>
                </Label>
                <Switch
                  id="communityActivity"
                  defaultChecked={notifications.communityActivity}
                  aria-label="Toggle community activity emails"
                   // onCheckedChange={...}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
                <Label htmlFor="platformAnnouncements" className="flex flex-col space-y-1">
                  <span>Platform Announcements</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive important news, updates, and occasional newsletters from AIML Odyssey.
                  </span>
                </Label>
                <Switch
                  id="platformAnnouncements"
                  defaultChecked={notifications.platformAnnouncements}
                  aria-label="Toggle platform announcement emails"
                   // onCheckedChange={...}
                />
              </div>
            </CardContent>
             <CardFooter>
                <Button>Save Notification Settings</Button> {/* TODO: Implement save logic */}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
              <CardDescription>Help us tailor your learning experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Fetch actual preferences and add state/handlers */}
               <div className="space-y-1">
                  <Label htmlFor="topics">Preferred Topics</Label>
                  {/* Replace with a multi-select or tag input component later */}
                  <Input id="topics" placeholder="e.g., Natural Language Processing, Computer Vision" defaultValue={preferences.topics.join(', ')} />
                  <p className="text-sm text-muted-foreground">Separate topics with commas.</p>
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="goals">Learning Goals</Label>
                  <Textarea id="goals" placeholder="What do you hope to achieve?" defaultValue={preferences.goals} />
                </div>
            </CardContent>
             <CardFooter>
                <Button>Save Preferences</Button> {/* TODO: Implement save logic */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
