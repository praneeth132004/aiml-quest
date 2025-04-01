
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PostCard, { Post } from "@/components/community/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Determine sort order based on active tab
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
            profiles(username, full_name, avatar_url)
          `);

        if (activeTab === "trending") {
          query = query.order('upvotes', { ascending: false });
        } else if (activeTab === "recent") {
          query = query.order('created_at', { ascending: false });
        } else if (activeTab === "most-commented") {
          query = query.order('comments_count', { ascending: false });
        }
          
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          const formattedPosts = data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            author: {
              name: post.profiles?.full_name || post.profiles?.username || "Anonymous User",
              avatar: post.profiles?.avatar_url || "",
              initials: (post.profiles?.full_name || post.profiles?.username || "AU").split(" ").map(n => n[0]).join("").toUpperCase(),
            },
            createdAt: new Date(post.created_at).toLocaleDateString(),
            tags: post.tags || [],
            upvotes: post.upvotes || 0,
            downvotes: post.downvotes || 0,
            comments: post.comments_count || 0,
          }));
          
          setPosts(formattedPosts);
        }
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        toast({
          variant: "destructive",
          title: "Error loading posts",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  // Filter posts based on search
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <PageLayout>
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

        <Tabs defaultValue="trending" className="mb-8">
          <TabsList>
            <TabsTrigger 
              value="trending" 
              onClick={() => setActiveTab("trending")}
              className="flex items-center"
            >
              <TrendingUp className="mr-1 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              onClick={() => setActiveTab("recent")}
              className="flex items-center"
            >
              <Clock className="mr-1 h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="most-commented" 
              onClick={() => setActiveTab("most-commented")}
              className="flex items-center"
            >
              <Star className="mr-1 h-4 w-4" />
              Most Discussed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No posts found matching your search.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/community/create-post">Create a New Post</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
