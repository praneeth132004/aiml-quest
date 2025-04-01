
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Share, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState({
    upvotes: 0,
    downvotes: 0,
    userVote: null as 'up' | 'down' | null,
  });

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
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
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setPost(data);
        setVotes({
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
          userVote: null,
        });
        
        // If user is logged in, check if they've voted on this post
        if (user) {
          const { data: voteData, error: voteError } = await supabase
            .from('post_votes')
            .select('vote_type')
            .eq('post_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!voteError && voteData) {
            setVotes(prev => ({
              ...prev,
              userVote: voteData.vote_type as 'up' | 'down',
            }));
          }
        }
      } catch (error: any) {
        console.error("Error fetching post:", error);
        toast({
          variant: "destructive",
          title: "Error loading post",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user]);

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote.",
      });
      return;
    }

    try {
      let newUpvotes = votes.upvotes;
      let newDownvotes = votes.downvotes;
      let newUserVote = type;

      // If user is clicking the same vote button again, remove their vote
      if (votes.userVote === type) {
        if (type === 'up') newUpvotes--;
        else newDownvotes--;
        newUserVote = null;
      }
      // If user is changing their vote
      else if (votes.userVote !== null) {
        if (type === 'up') {
          newUpvotes++;
          newDownvotes--;
        } else {
          newUpvotes--;
          newDownvotes++;
        }
      }
      // If user is voting for the first time
      else {
        if (type === 'up') newUpvotes++;
        else newDownvotes++;
      }

      // Optimistically update the UI
      setVotes({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote,
      });

      // Update the database
      const { error } = await supabase
        .from('posts')
        .update({
          upvotes: newUpvotes,
          downvotes: newDownvotes
        })
        .eq('id', post.id);

      if (error) throw error;

      // Record the user's vote
      if (newUserVote) {
        await supabase.from('post_votes').upsert({
          post_id: post.id,
          user_id: user.id,
          vote_type: newUserVote
        }, {
          onConflict: 'post_id,user_id'
        });
      } else {
        // Remove the vote record if they're un-voting
        await supabase
          .from('post_votes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      }
    } catch (error: any) {
      console.error("Error voting:", error);
      // Revert the optimistic update on error
      setVotes({
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        userVote: null,
      });
      toast({
        variant: "destructive",
        title: "Error recording vote",
        description: error.message,
      });
    }
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-6">
            <Button variant="ghost" asChild className="mr-2">
              <Link to="/community">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Community
              </Link>
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading post...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-6">
            <Button variant="ghost" asChild className="mr-2">
              <Link to="/community">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Community
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Post not found or has been deleted.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/community">Return to Community</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/community">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
          </Button>
        </div>
        
        <Card className="border">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  {post.profiles?.avatar_url && <AvatarImage src={post.profiles.avatar_url} alt={post.profiles?.full_name || post.profiles?.username || "Anonymous"} />}
                  <AvatarFallback>
                    {(post.profiles?.full_name || post.profiles?.username || "AU").split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.profiles?.full_name || post.profiles?.username || "Anonymous User"}</p>
                  <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold mt-2">
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-aiml-accent text-aiml-primary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="prose max-w-none my-6">
              {post.content.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            <div className="flex justify-between pt-4 border-t mt-6">
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center ${votes.userVote === 'up' ? 'text-green-600' : ''}`}
                  onClick={() => handleVote('up')}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{votes.upvotes}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center ${votes.userVote === 'down' ? 'text-red-600' : ''}`}
                  onClick={() => handleVote('down')}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span>{votes.downvotes}</span>
                </Button>
              </div>
              
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PostPage;
