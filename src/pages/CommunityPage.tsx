import { useState, useEffect, useCallback, useRef } from "react";
// Removed PageLayout import as it's handled by routing now
import PostCard, { Post } from "@/components/community/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Clock, Star, Bookmark, Loader2 } from "lucide-react"; // Import Bookmark & Loader2
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CommunityPage = () => {
  try {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("trending");
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true); // For initial load
    const [isLoadingMore, setIsLoadingMore] = useState(false); // For loading more posts
    const [hasError, setHasError] = useState(false);
    const [loadingStage, setLoadingStage] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const { user } = useAuth();
    const POSTS_PER_PAGE = 10; // Define page size

    // Use refs to track timeouts and prevent duplicate fetches
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFetchingRef = useRef<boolean>(false);

    // fetchPosts function now handles pagination
    const fetchPosts = useCallback(async (page = 1) => {
      // Prevent multiple simultaneous fetches for the same page type
      if (isFetchingRef.current && ((page === 1 && isLoading) || (page > 1 && isLoadingMore))) {
        console.log(`Already fetching page ${page}, ignoring duplicate request`);
        return;
      }

      isFetchingRef.current = true; // Mark as fetching
      console.log(`Starting to fetch posts for page ${page}...`);

      if (page === 1) {
        setIsLoading(true); // Full page load indicator
        setLoadingStage('Initializing');
        // setPosts([]); // Clear posts only on initial load (handled by useEffect now)
        setHasMorePosts(true); // Assume more posts initially
      } else {
        setIsLoadingMore(true); // Indicator for loading more
        setLoadingStage('Loading more posts...');
      }
      setHasError(false);


      // Clear any existing timeout (might need adjustment for load more)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Set a new timeout
      loadingTimeoutRef.current = setTimeout(() => {
        // Only show the timeout error if we're still loading (initial or more) and haven't fetched anything for this page yet
        if ((isLoading || isLoadingMore) && isFetchingRef.current) {
           console.log('Loading timeout reached, forcing loading state to false');
           if (page === 1) setIsLoading(false);
           else setIsLoadingMore(false);
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
      }, 20000); // 20 seconds timeout

      // Calculate range for Supabase query
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE - 1;

    try {
      // Determine sort order based on active tab
      console.log('Active tab:', activeTab);

      let postData: any[] | null = null;
      let postError: any = null;
      let query: any = null; // Define query variable outside if/else

      if (activeTab === "saved") {
        if (!user) {
          console.log('User not logged in, cannot fetch saved posts');
          setPosts([]); // Show empty list if not logged in
          setIsLoading(false);
          setIsLoadingMore(false);
          setHasMorePosts(false);
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
          query = supabase
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
              user_id,
              profiles ( username, full_name, avatar_url ),
              post_votes ( vote_type, user_id )
            `) // Join profiles and all votes
            .in('id', savedPostIds)
            .order('created_at', { ascending: false }) // Order saved posts by creation date
            .range(startIndex, endIndex); // Add range for pagination
        }

      } else {
        // Existing logic for other tabs
        query = supabase
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
            user_id,
            profiles ( username, full_name, avatar_url ),
            post_votes ( vote_type, user_id )
          `); // Join profiles and all votes

        if (activeTab === "trending") {
          query = query.order('upvotes', { ascending: false });
        } else if (activeTab === "recent") {
          query = query.order('created_at', { ascending: false });
        } else if (activeTab === "most-commented") {
          query = query.order('comments_count', { ascending: false });
        }
        // Add range for pagination to the main query
        query = query.range(startIndex, endIndex);
      }

      // Execute the query only if it was constructed (i.e., not empty saved posts)
      if (query) {
        console.log(`Executing query for tab: ${activeTab}, page: ${page}, range: ${startIndex}-${endIndex}`);
        setLoadingStage('Fetching posts');
        const { data: fetchedPostsData, error: fetchedPostsErrorData } = await query;
        postData = fetchedPostsData;
        postError = fetchedPostsErrorData;
        console.log('Query completed for tab:', activeTab);
        setLoadingStage('Posts query completed');
      }


      if (postError) {
        console.error('Supabase query error:', postError);
        throw postError;
      }

      console.log('Fetched posts count:', postData?.length || 0);
      if (postData && postData.length >= 0) { // Allow processing even if 0 posts returned for the page
        console.log('Fetched posts:', postData);

        // --- Common processing logic for all tabs ---
        setLoadingStage('Processing post data');

        console.log('Formatting posts...');
        setLoadingStage('Formatting posts');

        const formattedPosts = postData.map(post => {
          const profile = post.profiles;
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
            createdAt: post.created_at,
            tags: post.tags || [],
            upvotes: post.upvotes || 0,
            downvotes: post.downvotes || 0,
            comments: post.comments_count || 0,
            userVote: post.post_votes?.find((v: any) => v.user_id === user?.id)?.vote_type || null,
          };
        });

        console.log('Setting posts state with formatted posts');
        setLoadingStage('Finalizing');
        // Append posts if loading more, otherwise set
        setPosts(prevPosts => page === 1 ? formattedPosts : [...prevPosts, ...formattedPosts]);
        // Check if fewer posts were returned than requested, indicating no more posts
        setHasMorePosts(formattedPosts.length === POSTS_PER_PAGE);
        setCurrentPage(page); // Update current page state
      } else {
        console.log('No posts data returned for this page');
        if (page === 1) {
          setPosts([]); // Clear posts if first page has no data
        }
        setHasMorePosts(false); // No more posts available
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
      setHasMorePosts(false); // Ensure no load more button shows on error
    } finally {
      console.log(`Finished fetching posts for page ${page}, setting loading states to false`);
      setIsLoading(false); // Turn off main loader
      setIsLoadingMore(false); // Turn off 'load more' loader
      setLoadingStage(''); // Clear the loading stage

      // Clear the timeout
      if (loadingTimeoutRef.current) {
        console.log('Clearing loading timeout after fetch completion');
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Reset the fetching flag
      isFetchingRef.current = false;
      console.log('Reset isFetchingRef, ready for next fetch');
    }
  }, [activeTab, user, toast]); // Keep dependencies for useCallback

    // Function to handle tab changes
    const handleTabChange = (tabValue: string) => {
      if (tabValue === activeTab) return; // Do nothing if clicking the same tab
      console.log('Tab changed to:', tabValue);
      setActiveTab(tabValue);
      // Reset state for the new tab - useEffect will trigger fetchPosts(1)
      setCurrentPage(1);
      setPosts([]);
      setHasMorePosts(true);
      setIsLoading(true); // Show loading spinner immediately
      setHasError(false);
      // Cancel any ongoing fetch
      isFetchingRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };

    // Function to handle clicking the load more button
    const handleLoadMore = () => {
      if (!isLoadingMore && hasMorePosts && !isFetchingRef.current) {
        console.log('Load more clicked');
        fetchPosts(currentPage + 1);
      }
    };

    // Effect to fetch posts when activeTab or user ID changes
    useEffect(() => {
      console.log('CommunityPage effect triggered: Fetching posts for tab:', activeTab, 'User ID:', user?.id);
      // Reset state and fetch page 1 whenever tab or user changes
      setCurrentPage(1);
      setPosts([]);
      setHasMorePosts(true);
      setIsLoading(true); // Ensure loading state is true for initial fetch
      setHasError(false);
      fetchPosts(1); // Fetch page 1

      // Cleanup function (optional, might not be needed here)
      return () => {
        console.log('Cleanup effect for tab/user change');
        // Cancel any ongoing fetch if component unmounts or deps change before fetch completes
        isFetchingRef.current = false;
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      };
    }, [activeTab, user?.id]); // Depend only on tab and user ID

    // Separate effect for component unmount cleanup (runs only once)
    useEffect(() => {
      return () => {
        console.log('CommunityPage unmounting, performing final cleanup');
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        isFetchingRef.current = false; // Ensure flag is reset on unmount
      };
    }, []);

    // Filter posts based on search term (applied after fetching)
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      // Removed PageLayout wrapper
      <div className="container mx-auto px-4 py-12">
        {/* Header and Search Bar */}
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList>
              <TabsTrigger value="trending" className="flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" /> Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" /> Recent
              </TabsTrigger>
              <TabsTrigger value="most-commented" className="flex items-center">
                <Star className="mr-1 h-4 w-4" /> Most Discussed
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center">
                <Bookmark className="mr-1 h-4 w-4" /> Saved
              </TabsTrigger>
            </TabsList>
            {/* TabsContent are not strictly needed if content is rendered below */}
          </Tabs>

          {/* Post List Area */}
          <div className="space-y-6">
            {/* Initial Loading Spinner */}
            {isLoading && posts.length === 0 && (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-aiml-primary mb-4" />
                  <p className="text-gray-500 mb-2">Loading posts...</p>
                  {loadingStage && <p className="text-xs text-gray-400">{loadingStage}</p>}
                </div>
              </div>
            )}

            {/* Error Message */}
            {hasError && !isLoading && (
              <div className="py-12 text-center">
                <p className="text-red-500 mb-2">Error loading posts</p>
                <p className="text-gray-500 mb-4">There was a problem loading the community posts.</p>
                <Button variant="outline" className="mr-2" onClick={() => fetchPosts(1)}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            )}

            {/* Post Cards */}
            {!isLoading && !hasError && filteredPosts.length > 0 && (
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
            )}

            {/* No Posts Message */}
            {!isLoading && !hasError && filteredPosts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  {activeTab === 'saved'
                    ? (user ? 'You have no saved posts.' : 'Log in to see your saved posts.')
                    : (searchTerm ? 'No posts found matching your search.' : 'No posts found in this category yet.')}
                </p>
                {activeTab !== 'saved' && !searchTerm && (
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/community/create-post">Create the First Post</Link>
                  </Button>
                )}
              </div>
            )}

            {/* Load More Button */}
            {!isLoading && !hasError && hasMorePosts && filteredPosts.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
      </div>
      // Removed closing PageLayout tag
    );
  } catch (error) {
    console.error('Error rendering CommunityPage:', error);
    return (
      // Removed PageLayout wrapper from catch block
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-6">We encountered an error while loading the community page.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
      </div>
      // Removed closing PageLayout tag from catch block
    );
  }
};

export default CommunityPage;
