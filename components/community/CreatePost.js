"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/lib/postsService";
import UserDisplay from "./UserDisplay";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);

    const postData = {
      content: content.trim(),
      authorId: user.uid,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    const result = await postsService.createPost(postData);

    if (result.success) {
      setContent("");
      setTags("");
      setShowForm(false);
      onPostCreated?.();
    } else {
      console.error("Error creating post:", result.error);
      alert("Failed to create post");
    }

    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-center text-gray-500 text-sm">
          Please log in to share your thoughts
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <UserDisplay
            userId={user.uid}
            showRole={false}
            showVerified={false}
          />
          <span className="text-gray-500 flex-1">
            What&apos;s on your mind?
          </span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <UserDisplay
              userId={user.uid}
              showRole={false}
              showVerified={false}
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                rows="3"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {content.length}/500
              </div>
            </div>
          </div>

          <div className="ml-13">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags (comma separated, e.g. recovery, support, tips)"
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="flex items-center justify-between ml-13">
            <div className="flex items-center space-x-4 text-gray-400">
              <button
                type="button"
                className="hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setContent("");
                  setTags("");
                }}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSubmitting ? "Sharing..." : "Share"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
