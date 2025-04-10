import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import CommentForm from './CommentForm';
import CommentItem, { CommentWithProfile } from './CommentItem';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSectionProps {
  postId: string;
}

// Helper function to structure comments into a hierarchy
const structureComments = (comments: CommentWithProfile[]): CommentWithProfile[] => {
  const commentMap: { [key: string]: CommentWithProfile } = {};
  const rootComments: CommentWithProfile[] = [];

  // First pass: create a map of all comments by ID
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] }; // Initialize replies array
  });

  // Second pass: build the hierarchy
  comments.forEach(comment => {
    if (comment.parent_comment_id && commentMap[comment.parent_comment_id]) {
      // This is a reply, add it to the parent's replies array
      commentMap[comment.parent_comment_id].replies?.push(commentMap[comment.id]);
    } else {
      // This is a root comment
      rootComments.push(commentMap[comment.id]);
    }
  });

  // Sort root comments and replies by creation date (oldest first)
  const sortByDate = (a: CommentWithProfile, b: CommentWithProfile) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    
  rootComments.sort(sortByDate);
  Object.values(commentMap).forEach(comment => {
    comment.replies?.sort(sortByDate);
  });

  return rootComments;
};


const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles ( username, full_name, avatar_url )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true }); // Fetch flat list ordered by date

      if (error) throw error;

      const structured = structureComments(data || []);
      setComments(structured);

    } catch (error: any) {
      console.error("Error fetching comments:", error);
      toast({
        variant: "destructive",
        title: "Error loading comments",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {/* Form for new top-level comments */}
      <CommentForm postId={postId} onCommentAdded={fetchComments} />

      {/* Display Comments */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3 py-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId} 
              onCommentAdded={fetchComments} 
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
