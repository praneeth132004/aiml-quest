import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentFormProps {
  postId: string;
  parentId?: string | null; // For replies
  onCommentAdded: () => void; // Callback to refresh comments list
  onCancelReply?: () => void; // Optional: Callback to cancel replying state
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, parentId = null, onCommentAdded, onCancelReply }) => {
  const { user, profile, isProfileLoading } = useAuth(); // Get profile loading state
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check for user, profile, and content before submitting
    if (!user || !profile || !content.trim()) {
       if (!user || !profile) {
         toast({
           variant: "destructive",
           title: "Authentication required",
           description: "You must be logged in and profile loaded to comment.",
         });
       }
       return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: profile.id, // Use profile.id instead of user.id
        parent_comment_id: parentId,
        content: content.trim(),
      });

      if (error) throw error;

      setContent("");
      toast({ title: parentId ? "Reply submitted" : "Comment submitted" });
      onCommentAdded(); // Trigger refresh in parent
      if (parentId && onCancelReply) {
        onCancelReply(); // Close reply form if applicable
      }
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      toast({
        variant: "destructive",
        title: "Error submitting comment",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-gray-500">Please log in to comment.</p>;
  }

  const userInitials = (profile?.full_name || profile?.username || "AU").split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3 mt-4 mb-6">
      <Avatar className="h-8 w-8 mt-1">
        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile?.full_name || profile?.username || "User"} />}
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder={parentId ? "Write your reply..." : "Add a comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={parentId ? 2 : 3}
          className="mb-2"
        />
        <div className="flex justify-end space-x-2">
          {parentId && onCancelReply && (
             <Button type="button" variant="ghost" size="sm" onClick={onCancelReply} disabled={isSubmitting}>
                Cancel
             </Button>
          )}
          <Button type="submit" size="sm" disabled={isSubmitting || !content.trim() || isProfileLoading}>
            {isSubmitting ? "Submitting..." : (isProfileLoading ? "Loading..." : (parentId ? "Reply" : "Comment"))}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
