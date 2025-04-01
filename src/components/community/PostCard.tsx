
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Share, BookmarkPlus } from "lucide-react";
import { Link } from "react-router-dom";

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
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [votes, setVotes] = useState({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    userVote: null as 'up' | 'down' | null,
  });

  const handleVote = (type: 'up' | 'down') => {
    setVotes(prev => {
      // If user is clicking the same vote button again, remove their vote
      if (prev.userVote === type) {
        return {
          upvotes: type === 'up' ? prev.upvotes - 1 : prev.upvotes,
          downvotes: type === 'down' ? prev.downvotes - 1 : prev.downvotes,
          userVote: null,
        };
      }
      // If user is changing their vote
      else if (prev.userVote !== null) {
        return {
          upvotes: type === 'up' ? prev.upvotes + 1 : prev.upvotes - 1,
          downvotes: type === 'down' ? prev.downvotes + 1 : prev.downvotes - 1,
          userVote: type,
        };
      }
      // If user is voting for the first time
      else {
        return {
          upvotes: type === 'up' ? prev.upvotes + 1 : prev.upvotes,
          downvotes: type === 'down' ? prev.downvotes + 1 : prev.downvotes,
          userVote: type,
        };
      }
    });
  };

  return (
    <Card className="border card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{post.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <BookmarkPlus className="h-4 w-4" />
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
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="flex items-center" asChild>
            <Link to={`/community/posts/${post.id}`}>
              <MessageSquare className="h-4 w-4 mr-1" />
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
