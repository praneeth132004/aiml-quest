
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Tag, X } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(20, "Content must be at least 20 characters").max(5000, "Content cannot exceed 5000 characters"),
});

type PostFormValues = z.infer<typeof postSchema>;

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user, profile, isProfileLoading } = useAuth(); // Get profile and loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [profileLoadingTimeout, setProfileLoadingTimeout] = useState(false);

  // Log profile loading state for debugging
  useEffect(() => {
    console.log('Profile loading state:', {
      isProfileLoading,
      profileExists: !!profile,
      userId: user?.id
    });
  }, [isProfileLoading, profile, user]);

  // Add a timeout to handle stuck profile loading state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isProfileLoading) {
      console.log('Profile loading started, setting timeout');
      // Set a timeout to force the loading state to complete after 5 seconds
      timeoutId = setTimeout(() => {
        console.log('Profile loading timeout reached');
        setProfileLoadingTimeout(true);
      }, 5000); // 5 seconds timeout
    } else {
      setProfileLoadingTimeout(false);
    }

    return () => {
      if (timeoutId) {
        console.log('Clearing profile loading timeout');
        clearTimeout(timeoutId);
      }
    };
  }, [isProfileLoading]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (values: PostFormValues) => {
    // Check for user authentication
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a post.",
      });
      navigate("/auth");
      return;
    }

    // Check for profile
    if (!profile) {
      // If profile loading timed out, try to fetch it directly
      if (profileLoadingTimeout) {
        try {
          console.log('Attempting to fetch profile directly');
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          if (!data) throw new Error('Profile not found');

          // Use the fetched profile directly
          console.log('Successfully fetched profile:', data);
          // Continue with the submission using the fetched profile
        } catch (error: any) {
          console.error('Error fetching profile directly:', error);
          toast({
            variant: "destructive",
            title: "Profile error",
            description: "Could not load your profile. Please try again later.",
          });
          return;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Profile required",
          description: "Your profile must be loaded to create a post.",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Declare a variable to hold the profile data
      let profileId = user.id;

      // If we have a profile from context, use that
      if (profile) {
        profileId = profile.id;
      } else if (profileLoadingTimeout) {
        // If profile loading timed out, try to fetch it directly again
        try {
          // First check if profile exists
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('id', user.id);

          if (count && count > 0) {
            // Profile exists, fetch it
            const { data, error } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', user.id)
              .single();

            if (!error && data) {
              profileId = data.id;
            }
          } else {
            // Profile doesn't exist, create one
            console.log('Creating profile for user:', user.id);
            const { error } = await supabase.from('profiles').insert({
              id: user.id,
              username: user.user_metadata?.username || null,
              full_name: user.user_metadata?.full_name || null,
              avatar_url: null,
            });

            if (error && !error.message.includes('duplicate key value')) {
              throw error;
            }

            // Use user.id as the profile ID
            profileId = user.id;
          }
        } catch (err) {
          console.error('Error handling profile:', err);
          // Continue with user.id as fallback
        }
      }

      console.log('Using profile ID for post:', profileId);

      const { error } = await supabase
        .from('posts')
        .insert({
          title: values.title,
          content: values.content,
          tags: tags,
          user_id: profileId,
        });

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been successfully published.",
      });

      navigate("/community");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        {isProfileLoading && !profileLoadingTimeout && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading your profile... This may take a moment.
            </p>
          </div>
        )}

        {profileLoadingTimeout && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-orange-700 text-sm">
              <strong>Note:</strong> Profile loading is taking longer than expected. You can still create a post, but if you encounter any issues, please try refreshing the page.
            </p>
          </div>
        )}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pencil className="mr-2 h-5 w-5" />
              Create a New Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a descriptive title for your post"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts, questions or insights..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Tags (optional, max 5)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add topic tags..."
                        className="pl-10"
                        disabled={tags.length >= 5}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      disabled={tags.length >= 5 || !tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-aiml-accent text-aiml-primary">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Press Enter to add each tag. Tags help others find your post.
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/community")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || (isProfileLoading && !profileLoadingTimeout)}
                    onClick={() => {
                      if (profileLoadingTimeout && !profile) {
                        // If profile loading timed out and we don't have a profile, show an error
                        toast({
                          variant: "destructive",
                          title: "Profile loading error",
                          description: "There was an issue loading your profile. Please try again.",
                        });
                        // Redirect to community page
                        navigate("/community");
                      }
                    }}
                  >
                    {isSubmitting ? "Posting..." :
                     (isProfileLoading && !profileLoadingTimeout) ? "Loading Profile..." :
                     "Publish Post"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CreatePostPage;
