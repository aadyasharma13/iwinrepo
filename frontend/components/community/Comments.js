"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/lib/postsService";
import UserDisplay from "./UserDisplay";

export default function Comments({ postId, onCommentAdd, onCommentDelete }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const result = await postsService.getComments(postId);
    if (result.success) {
      setComments(result.comments);
    }
    setIsLoading(false);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    const commentData = {
      content: newComment.trim(),
      authorId: user.uid,
    };

    const result = await postsService.addComment(postId, commentData);

    if (result.success) {
      setNewComment("");
      loadComments(); // Reload to get the new comment with ID
      onCommentAdd?.();
    } else {
      console.error("Error adding comment:", result.error);
      alert("Failed to add comment");
    }

    setIsSubmitting(false);
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    const result = await postsService.updateComment(commentId, {
      content: editContent.trim(),
    });

    if (result.success) {
      setEditingComment(null);
      setEditContent("");
      loadComments();
    } else {
      console.error("Error updating comment:", result.error);
      alert("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const result = await postsService.deleteComment(commentId, postId);

    if (result.success) {
      loadComments();
      onCommentDelete?.();
    } else {
      console.error("Error deleting comment:", result.error);
      alert("Failed to delete comment");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-center py-4">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-500">
            Loading comments...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex space-x-3">
            <UserDisplay
              userId={user.uid}
              size="sm"
              showRole={false}
              showVerified={false}
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <UserDisplay
              userId={comment.authorId}
              size="sm"
              showRole={true}
              showVerified={true}
              textSize="xs"
            />

            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 text-xs">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                    {comment.updatedAt !== comment.createdAt && (
                      <span className="text-gray-400 text-xs">(edited)</span>
                    )}
                  </div>

                  {/* Comment Options */}
                  {user?.uid === comment.authorId && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        title="Edit comment"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete comment"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                      rows="2"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        disabled={!editContent.trim()}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent("");
                        }}
                        className="px-2 py-1 border border-gray-200 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
}
