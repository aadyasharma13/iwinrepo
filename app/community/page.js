"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/lib/postsService";
import { userService } from "@/lib/userService";
import Navbar from "@/components/Navbar";
import CreatePost from "@/components/community/CreatePost";
import Post from "@/components/community/Post";

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadPosts(true);
  }, [activeFilter]);

  const loadPosts = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setPosts([]);
      setLastDoc(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    const result = await postsService.getPosts(
      isInitial ? null : lastDoc,
      20 // Load more posts since we might filter some out
    );

    if (result.success) {
      let filteredPosts = result.posts;

      // If filtering by role, we need to fetch user data and filter
      if (activeFilter !== "all") {
        const authorIds = [
          ...new Set(result.posts.map((post) => post.authorId)),
        ];
        const usersData = await userService.getUsersData(authorIds);

        filteredPosts = result.posts.filter((post) => {
          const userData = usersData[post.authorId];
          return userData?.role === activeFilter;
        });
      }

      if (isInitial) {
        setPosts(filteredPosts);
      } else {
        setPosts((prev) => [...prev, ...filteredPosts]);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.posts.length === 20);
    } else {
      console.error("Error loading posts:", result.error);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const handlePostCreated = () => {
    loadPosts(true);
  };

  const handlePostUpdate = () => {
    loadPosts(true);
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const filters = [
    { key: "all", label: "For you" },
    { key: "patient", label: "Patients" },
    { key: "caregiver", label: "Caregivers" },
    { key: "medical_professional", label: "Medical" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto border-x border-gray-200 min-h-screen">
          {/* Header */}
          <div className="sticky top-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Community</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Sign-in Prompt */}
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Join Our Community
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Connect with patients, caregivers, and medical professionals.
                Share experiences, get support, and help others on their health
                journey.
              </p>

              <div className="space-y-3">
                <a
                  href="/auth"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </a>

                <div className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a
                    href="/auth"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign in
                  </a>
                </div>
              </div>

              {/* Features */}
              <div className="mt-12 grid grid-cols-1 gap-4 text-left">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Share & Connect
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Post updates, ask questions, and engage with others
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.012-3a7.5 7.5 0 11-9.018 9.632M13 12h8m-8 0V4m0 8l4-4-4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Expert Guidance
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get insights from verified medical professionals
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
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
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Support Network
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Find emotional support and practical advice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto border-x border-gray-200 min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Community</h1>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pb-3">
            <div className="flex space-x-6 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 ${
                    activeFilter === filter.key
                      ? "text-gray-900 border-green-500"
                      : "text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-500">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Be the first to share something with the community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && posts.length > 0 && (
          <div className="text-center py-6">
            <button
              onClick={() => loadPosts(false)}
              disabled={loadingMore}
              className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Show more posts"}
            </button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            You&apos;ve reached the end!
          </div>
        )}
      </div>
    </div>
  );
}
