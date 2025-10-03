"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/lib/postsService";
import Comments from "./Comments";
import UserDisplay from "./UserDisplay";

export default function Post({ post, onUpdate, onDelete }) {
  const { user, deleteFile } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?.uid) || false
  );
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [isUpdating, setIsUpdating] = useState(false);

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

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleLike = async () => {
    if (!user) return;

    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    const result = await postsService.toggleLike(post.id, user.uid);

    if (!result.success) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      console.error("Error toggling like:", result.error);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setIsUpdating(true);
    const result = await postsService.updatePost(post.id, {
      content: editContent.trim(),
    });

    if (result.success) {
      setIsEditing(false);
      onUpdate?.();
    } else {
      console.error("Error updating post:", result.error);
      alert("Failed to update post");
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const result = await postsService.deletePost(post.id);

    if (result.success) {
      // Clean up images from storage
      if (result.imagePaths && result.imagePaths.length > 0) {
        for (const imagePath of result.imagePaths) {
          try {
            await deleteFile(imagePath);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
      }
      
      onDelete?.(post.id);
    } else {
      console.error("Error deleting post:", result.error);
      alert("Failed to delete post");
    }
  };

  const handleCommentsUpdate = () => {
    setCommentsCount((prev) => prev + 1);
  };

  const handleCommentDelete = () => {
    setCommentsCount((prev) => Math.max(0, prev - 1));
  };

  const isOwner = user?.uid === post.authorId;

  return (
    <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
      <div className="flex space-x-3">
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1">
              <UserDisplay userId={post.authorId} />
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                {formatTimestamp(post.createdAt)}
              </span>
              {post.updatedAt !== post.createdAt && (
                <span className="text-gray-400 text-xs">(edited)</span>
              )}
            </div>

            {/* Options Menu */}
            {isOwner && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Edit post"
                >
                  <svg
                    className="w-4 h-4"
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
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete post"
                >
                  <svg
                    className="w-4 h-4"
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

          {/* Post Content */}
          <div className="mb-3">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                  rows="3"
                  placeholder="What's on your mind?"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEdit}
                    disabled={isUpdating || !editContent.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(post.content);
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 text-sm leading-relaxed break-words whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className={`mt-3 grid gap-2 ${
                post.images.length === 1 ? 'grid-cols-1' : 
                post.images.length === 2 ? 'grid-cols-2' : 
                post.images.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
              }`}>
                {post.images.map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className={`relative overflow-hidden rounded-lg ${
                      post.images.length === 3 && index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => {
                        // TODO: Implement image modal/lightbox
                        window.open(imageUrl, '_blank');
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-green-600 text-sm hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interaction Bar */}
          {!isEditing && (
            <div className="flex items-center justify-between max-w-md">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors group p-2 -m-2 rounded-full ${
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm">{formatNumber(likesCount)}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group p-2 -m-2 rounded-full hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm">{formatNumber(commentsCount)}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group p-2 -m-2 rounded-full hover:bg-green-50">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span className="text-sm">
                  {formatNumber(post.sharesCount || 0)}
                </span>
              </button>

              <button className="text-gray-500 hover:text-gray-700 transition-colors p-2 -m-2 rounded-full hover:bg-gray-50">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <Comments
              postId={post.id}
              onCommentAdd={handleCommentsUpdate}
              onCommentDelete={handleCommentDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
