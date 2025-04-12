
import { useState, useEffect, useCallback, useRef } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PostCard, { Post } from "@/components/community/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Clock, Star, Bookmark } from "lucide-react"; // Import Bookmark
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CommunityPage = () => {
  try {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("trending");
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [loadingStage, setLoadingStage] = useState<string>('');
    const { user } = useAuth();

    // Use refs to track timeouts and prevent duplicate fetches
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFetchingRef = useRef<boolean>(false);

    // Extract the fetch posts function so it can be called directly
    // Use useCallback to prevent recreation on every render
    const fetchPosts = useCallback(async () => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        console.log('Already fetching posts, ignoring duplicate request');
        return;
      }

      isFetchingRef.current = true;
      console.log('Starting to fetch posts...');
      setLoadingStage('Initializing');

      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Set a new timeout
      loadingTimeoutRef.current = setTimeout(() => {
        // Only show the timeout error if we're still loading, still fetching, and don't have posts
        if (isLoading && isFetchingRef.current && posts.length === 0) {
          console.log('Loading timeout reached, forcing loading state to false');
          setIsLoading(false);
          setHasError(true);
          isFetchingRef.current = false; // Reset the fetching flag
          toast({
            variant: "destructive",
            title: "Loading timeout",
            description: "Failed to load posts in a reasonable time. Please try again.",
          });
        } else {
          console.log('Loading timeout reached but posts are already loaded or not fetching anymore, ignoring');
        }
      }, 20000); // 20 seconds timeout (increased from 15)

      setIsLoading(true);
      setHasError(false);
      setPosts([]); // Clear previous posts when tab changes

    try {
      // Determine sort order based on active tab
      console.log('Active tab:', activeTab);

      let postData: any[] | null = null;
      let postError: any = null;

      if (activeTab === "saved") {
        if (!user) {
          console.log('User not logged in, cannot fetch saved posts');
          setPosts([]); // Show empty list if not logged in
          setIsLoading(false);
          isFetchingRef.current = false;
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          return; // Exit early
        }

        console.log('Fetching saved posts for user:', user.id);
        setLoadingStage('Fetching saved post IDs');

        // 1. Get saved post IDs for the user
        const { data: savedPostsData, error: savedPostsError } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', user.id);

        if (savedPostsError) {
          console.error('Error fetching saved post IDs:', savedPostsError);
          throw savedPostsError;
        }

        if (!savedPostsData || savedPostsData.length === 0) {
          console.log('No saved posts found for this user.');
          setPosts([]); // Set empty array if no saved posts
          postData = []; // Ensure postData is an empty array
        } else {
          const savedPostIds = savedPostsData.map(sp => sp.post_id);
          console.log('Saved post IDs:', savedPostIds);
          setLoadingStage('Fetching saved post details');

          // 2. Fetch the actual posts using the IDs
          const { data: fetchedPosts, error: fetchedPostsError } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              content,
              created_at,
              tags,
              upvotes,
              downvotes,
              comments_count,
              user_id
            `)
            .in('id', savedPostIds)
            .order('created_at', { ascending: false }); // Order saved posts by creation date

          postData = fetchedPosts;
          postError = fetchedPostsError;
        }

      } else {
        // Existing logic for other tabs
        let query = supabase
          .from('posts')
          .select(`
          id,
          title,
          content,
          created_at,
          tags,
          upvotes,
          downvotes,
          comments_count,
            id,
            title,
            content,
            created_at,
            tags,
            upvotes,
            downvotes,
            comments_count,
            user_id
          `);

        if (activeTab === "trending") {
          query = query.order('upvotes', { ascending: false });
        } else if (activeTab === "recent") {
          query = query.order('created_at', { ascending: false });
        } else if (activeTab === "most-commented") {
          query = query.order('comments_count', { ascending: false });
        }

        console.log('Executing query for tab:', activeTab);
        setLoadingStage('Checking database access');

      // First, try a simple count query to check if the table is accessible
      const { count, error: countError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error counting posts:', countError);
        throw countError;
      }

      console.log(`Found ${count} posts in database`);
      setLoadingStage(`Found ${count} posts in database`);

      // Also check if profiles table is accessible
      const { count: profileCount, error: profileCountError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (profileCountError) {
        console.error('Error counting profiles:', profileCountError);
        // Don't throw here, just log the error
      } else {
        console.log(`Found ${profileCount} profiles in database`);
      }

        // Now execute the main query
        setLoadingStage('Fetching posts');
        const { data: fetchedPosts, error: fetchedPostsError } = await query;
        postData = fetchedPosts;
        postError = fetchedPostsError;
        console.log('Query completed for tab:', activeTab);
        setLoadingStage('Posts query completed');
      }


      if (postError) {
        console.error('Supabase query error:', postError);
        throw postError;
      }

      console.log('Fetched posts count:', postData?.length || 0);
      if (postData && postData.length > 0) {
        console.log('Fetched posts:', postData);

        // --- Common processing logic for all tabs ---
        setLoadingStage('Processing post data');

        // Get user votes if logged in
        let userVotes: Record<string, 'upvote' | 'downvote'> = {}; // Explicitly type userVotes
        if (user) {
          console.log('Fetching user votes for user:', user.id);
          // Fetch votes for the posts currently being displayed
          const postIdsToFetchVotes = postData.map(p => p.id);
          if (postIdsToFetchVotes.length > 0) {
            const { data: votesData, error: votesError } = await supabase
              .from('post_votes')
              .select('post_id, vote_type')
              .eq('user_id', user.id)
              .in('post_id', postIdsToFetchVotes); // Only fetch votes for relevant posts

            if (votesError) {
              console.error('Error fetching user votes:', votesError);
            }

            if (!votesError && votesData) {
              console.log('User votes:', votesData);
              // Explicitly type the accumulator in reduce
              userVotes = votesData.reduce((acc: Record<string, 'upvote' | 'downvote'>, vote) => {
                // Assuming vote.vote_type from Supabase is 'upvote' or 'downvote'
                acc[vote.post_id] = vote.vote_type as 'upvote' | 'downvote';
                return acc;
              }, {});
            }
          } else {
            console.log('No posts to fetch votes for.');
          }
        }

        console.log('Formatting posts...');
        setLoadingStage('Formatting posts');

        // Fetch profiles for all posts
        const userIds = postData.map(post => post.user_id);
        const uniqueUserIds = [...new Set(userIds)];
        let profilesMap: Record<string, any> = {};

        if (uniqueUserIds.length > 0) {
          console.log('Fetching profiles for user IDs:', uniqueUserIds);
          setLoadingStage('Fetching user profiles');

          // Get profiles in a separate query
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', uniqueUserIds);

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            // Continue without profile data if there's an error
          } else if (profilesData) {
            // Create a map of user_id to profile data
            profilesData.forEach(profile => {
              profilesMap[profile.id] = profile;
            });
          }
          console.log('Profiles map:', profilesMap);
        } else {
           console.log('No user IDs to fetch profiles for.');
        }


        const formattedPosts = postData.map(post => {
          // Get profile from the map
          const profile = profilesMap[post.user_id];

          if (!profile) {
            console.warn('Missing profile data for post:', post.id, 'user_id:', post.user_id);
          }

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: {
              name: profile?.full_name || profile?.username || "Anonymous User",
              avatar: profile?.avatar_url || "",
              initials: (profile?.full_name || profile?.username || "AU").split(" ").map(n => n[0]).join("").toUpperCase(),
            },
            createdAt: post.created_at, // Pass the raw timestamp string
            tags: post.tags || [],
            upvotes: post.upvotes || 0,
            downvotes: post.downvotes || 0,
            comments: post.comments_count || 0,
            userVote: userVotes[post.id] || null,
          };
        });

        console.log('Setting posts state with formatted posts');
        setLoadingStage('Finalizing');
        setPosts(formattedPosts);
      } else {
        console.log('No posts data returned');
        setPosts([]);
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setHasError(true);
      toast({
        variant: "destructive",
        title: "Error loading posts",
        description: error.message,
      });
      // Set empty posts array to avoid infinite loading state
      setPosts([]);
    } finally {
      console.log('Finished fetching posts, setting isLoading to false');
      setIsLoading(false);
      setLoadingStage(''); // Clear the loading stage

      // Clear the timeout since we've finished loading (either success or error)
      if (loadingTimeoutRef.current) {
        console.log('Clearing loading timeout after fetch completion');
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Reset the fetching flag after a small delay to prevent rapid consecutive fetches
      setTimeout(() => {
        isFetchingRef.current = false;
        console.log('Reset isFetchingRef, ready for next fetch');
      }, 500);
    }
  }, [activeTab, user, toast]);

    const resetAndFetchPosts = () => {
      // Clear any existing state
      setHasError(false);
      setIsLoading(true);
      setPosts([]);

      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Reset the fetching flag
      isFetchingRef.current = false;

      // Fetch posts after a small delay to ensure state is reset
      setTimeout(() => {
        fetchPosts();
      }, 100);
    };

    // Effect to fetch posts when component mounts or dependencies change
    useEffect(() => {
      console.log('CommunityPage mounted or dependencies changed, fetching posts...');
      fetchPosts();

      // Clean up function to clear any remaining timeout when component unmounts
      return () => {
        if (loadingTimeoutRef.current) {
          console.log('Component unmounting, clearing loading timeout');
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      };
    }, [fetchPosts]); // fetchPosts already depends on activeTab and user

    // Additional effect to handle component unmounting and cleanup
    useEffect(() => {
      // This effect only runs on mount and unmount
      return () => {
        console.log('CommunityPage unmounting, performing final cleanup');
        // Clear any timeouts that might be lingering
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        // Reset the fetching flag
        isFetchingRef.current = false;
      };
    }, []);

    // Filter posts based on search
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <PageLayout requireAuth={true}>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community</h1>
              <p className="text-gray-600">
                Connect with fellow learners, ask questions, and share your knowledge.
              </p>
            </div>
            <Button className="mt-4 md:mt-0" asChild>
              <Link to="/community/create-post">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger
                value="trending"
                className="flex items-center"
              >
                <TrendingUp className="mr-1 h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="flex items-center"
              >
                <Clock className="mr-1 h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger
                value="most-commented"
                className="flex items-center"
              >
                <Star className="mr-1 h-4 w-4" />
                Most Discussed
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex items-center"
              >
                <Bookmark className="mr-1 h-4 w-4" />
                Saved
              </TabsTrigger>
            </TabsList>
            <TabsContent value="trending">
              {/* Content will be rendered in the shared space below */}
            </TabsContent>
            <TabsContent value="recent">
              {/* Content will be rendered in the shared space below */}
            </TabsContent>
            <TabsContent value="most-commented">
              {/* Content will be rendered in the shared space below */}
            </TabsContent>
            <TabsContent value="saved">
              {/* Content will be rendered in the shared space below */}
            </TabsContent>
          </Tabs>

          <div className="space-y-6">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-t-aiml-primary border-r-aiml-primary border-b-gray-200 border-l-gray-200 animate-spin mb-4"></div>
                  <p className="text-gray-500 mb-2">Loading posts...</p>
                  {loadingStage && (
                    <p className="text-xs text-gray-400">{loadingStage}</p>
                  )}
                </div>
              </div>
            ) : hasError ? (
              <div className="py-12 text-center">
                <p className="text-red-500 mb-2">Error loading posts</p>
                <p className="text-gray-500 mb-4">There was a problem loading the community posts.</p>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={resetAndFetchPosts}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/community/create-post">Create a New Post</Link>
                </Button>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                try {
                  return <PostCard key={post.id} post={post} />;
                } catch (error) {
                  console.error('Error rendering post card:', error, post);
                  return (
                    <Card key={post.id} className="border p-4">
                      <p className="text-red-500">Error displaying this post</p>
                    </Card>
                  );
                }
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  {activeTab === 'saved'
                    ? (user ? 'You have no saved posts.' : 'Log in to see your saved posts.')
                    : 'No posts found matching your search.'}
                </p>
                {activeTab !== 'saved' && (
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/community/create-post">Create a New Post</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    );
  } catch (error) {
    console.error('Error rendering CommunityPage:', error);
    return (
      <PageLayout requireAuth={true}>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-6">We encountered an error while loading the community page.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
};

export default CommunityPage;
