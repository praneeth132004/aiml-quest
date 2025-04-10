
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Share, BookmarkPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  createdAt: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: number;
  userVote?: 'upvote' | 'downvote' | null;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [votes, setVotes] = useState<{
    upvotes: number;
    downvotes: number;
    userVote: 'upvote' | 'downvote' | null;
  }>({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    userVote: post.userVote || null,
  });

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
      // Convert 'up'/'down' to 'upvote'/'downvote' for database
      const voteType = type === 'up' ? 'upvote' : 'downvote';
      let newUserVote = voteType;

      // If user is clicking the same vote button again, remove their vote
      if ((votes.userVote === 'upvote' && type === 'up') ||
          (votes.userVote === 'downvote' && type === 'down')) {
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

      console.log('Saving vote:', {
        post_id: post.id,
        user_id: user.id,
        vote_type: newUserVote
      });

      // Record the user's vote in post_votes (triggers will update posts table)
      if (newUserVote) {
        const { data, error } = await supabase.from('post_votes').upsert({
          post_id: post.id,
          user_id: user.id,
          vote_type: newUserVote
        }, {
          onConflict: 'post_id,user_id'
        });

        if (error) throw error;
        console.log('Vote saved successfully', data);
      } else {
        // Remove the vote record if they're un-voting
        const { error } = await supabase
          .from('post_votes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) throw error;
        console.log('Vote removed successfully');
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

  const [isSaved, setIsSaved] = useState(false);

  // Check if post is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('saved_posts')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', post.id)
          .maybeSingle();

        if (!error && data) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };

    checkIfSaved();
  }, [user, post.id]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to save posts.",
      });
      return;
    }

    try {
      if (isSaved) {
        // If already saved, remove from saved posts
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);

        if (error) throw error;

        setIsSaved(false);
        toast({
          title: "Post removed",
          description: "This post has been removed from your saved items."
        });
      } else {
        // If not saved, add to saved posts
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: user.id,
            post_id: post.id
          });

        if (error) {
          // If error is not a duplicate key error, throw it
          if (!error.message.includes('duplicate key value')) {
            throw error;
          } else {
            // If it's a duplicate key error, just update the UI state
            console.log('Post was already saved');
          }
        }

        setIsSaved(true);
        toast({
          title: "Post saved",
          description: "This post has been added to your saved items."
        });
      }
    } catch (error: any) {
      console.error("Error saving/unsaving post:", error);
      toast({
        variant: "destructive",
        title: "Error with saved post",
        description: error.message,
      });
    }
  };

  return (
    <Card className="border card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              {post.author.avatar && <AvatarImage src={post.author.avatar} alt={post.author.name} />}
              <AvatarFallback>{post.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            {isSaved ? (
              <BookmarkPlus className="h-4 w-4 fill-current" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Link to={`/community/posts/${post.id}`}>
          <CardTitle className="text-lg font-semibold hover:text-aiml-primary transition-colors cursor-pointer">
            {post.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.content}</p>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-aiml-accent text-aiml-primary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${votes.userVote === 'upvote' ? 'text-green-600' : ''}`}
            onClick={() => handleVote('up')}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{votes.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${votes.userVote === 'downvote' ? 'text-red-600' : ''}`}
            onClick={() => handleVote('down')}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span>{votes.downvotes}</span>
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="flex items-center" asChild>
            <Link to={`/community/posts/${post.id}`}>
              <MessageSquare className="h-4 w-4 mr-1" />
              {/* Use post.comments which comes from the initial data */}
              <span>{post.comments}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
