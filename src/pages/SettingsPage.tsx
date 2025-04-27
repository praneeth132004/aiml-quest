import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettingsPage = () => {
  // Placeholder data/functions - replace with actual state and handlers
  const user = {
    fullName: 'Current User Name',
    email: 'user@example.com',
    avatarUrl: '', // Add a placeholder image URL if desired
    bio: 'This is the current user bio.',
    preferences: {
      topics: ['Machine Learning', 'Data Science'],
      goals: 'Become proficient in Python for AI.',
    },
    notifications: {
      courseUpdates: true,
      communityActivity: false,
      platformAnnouncements: true,
    }
  };
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

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
              {/* Profile Section */}
              <div className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-medium">Profile</h3>
                 <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                 </div>
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.fullName} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue={user.bio} placeholder="Tell us a little about yourself" />
                </div>
                 <Button size="sm">Save Profile</Button>
              </div>

              {/* Email Section */}
              <div className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-medium">Email Address</h3>
                <p className="text-sm text-muted-foreground">Current email: {user.email}</p>
                <div className="space-y-1">
                  <Label htmlFor="newEmail">New Email Address</Label>
                  <Input id="newEmail" type="email" placeholder="new.email@example.com" />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="confirmEmail">Confirm New Email</Label>
                  <Input id="confirmEmail" type="email" placeholder="Confirm new email" />
                </div>
                <Button size="sm">Change Email</Button>
              </div>

              {/* Password Section */}
              <div className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button size="sm">Change Password</Button>
              </div>

              {/* Delete Account Section */}
              <div className="space-y-2">
                 <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                 <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 <Button variant="destructive" size="sm">Delete My Account</Button>
              </div>
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
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
                <Label htmlFor="courseUpdates" className="flex flex-col space-y-1">
                  <span>Course Updates</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive emails about new courses, lessons, or updates to enrolled content.
                  </span>
                </Label>
                <Switch
                  id="courseUpdates"
                  defaultChecked={user.notifications.courseUpdates}
                  aria-label="Toggle course update emails"
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
                  defaultChecked={user.notifications.communityActivity}
                  aria-label="Toggle community activity emails"
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
                  defaultChecked={user.notifications.platformAnnouncements}
                  aria-label="Toggle platform announcement emails"
                />
              </div>
            </CardContent>
             <CardFooter>
                <Button>Save Notification Settings</Button>
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
               <div className="space-y-1">
                  <Label htmlFor="topics">Preferred Topics</Label>
                  {/* Replace with a multi-select or tag input component later */}
                  <Input id="topics" placeholder="e.g., Natural Language Processing, Computer Vision" defaultValue={user.preferences.topics.join(', ')} />
                  <p className="text-sm text-muted-foreground">Separate topics with commas.</p>
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="goals">Learning Goals</Label>
                  <Textarea id="goals" placeholder="What do you hope to achieve?" defaultValue={user.preferences.goals} />
                </div>
            </CardContent>
             <CardFooter>
                <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
