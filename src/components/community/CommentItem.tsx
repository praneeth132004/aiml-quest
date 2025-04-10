import React, { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import CommentForm from './CommentForm'; // Import the form

// Define the structure for a comment, including potential profile data and replies
export type CommentWithProfile = Tables<'comments'> & {
  profiles: Pick<Tables<'profiles'>, 'username' | 'full_name' | 'avatar_url'> | null;
  replies?: CommentWithProfile[]; // Optional array for nested replies
};

interface CommentItemProps {
  comment: CommentWithProfile;
  postId: string;
  onCommentAdded: () => void; // To refresh list after reply
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, onCommentAdded }) => {
  const [isReplying, setIsReplying] = useState(false);

  const profile = comment.profiles;
  const authorName = profile?.full_name || profile?.username || 'Anonymous';
  const authorInitials = (authorName).split(' ').map(n => n[0]).join('').toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  const handleReplySuccess = () => {
    setIsReplying(false); // Close the reply form
    onCommentAdded(); // Trigger refresh
  };

  return (
    <div className="flex space-x-3 py-4 border-b last:border-b-0">
      <Avatar className="h-8 w-8">
        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={authorName} />}
        <AvatarFallback>{authorInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{authorName}</span>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
        <div className="mt-2">
          <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
            {isReplying ? 'Cancel' : 'Reply'}
          </Button>
          {/* Add Edit/Delete buttons later if needed */}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-3 ml-6"> {/* Indent reply form slightly */}
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onCommentAdded={handleReplySuccess}
              onCancelReply={() => setIsReplying(false)}
            />
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-6 border-l"> {/* Indent replies */}
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onCommentAdded={onCommentAdded} // Pass down the refresh handler
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
