"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postsService } from "@/lib/postsService";
import { userService } from "@/lib/userService";
import UserDisplay from "./UserDisplay";

export default function SearchBar({ onSearchResults, onSearchStateChange }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    posts: [],
    comments: [],
    profiles: [],
  });
  const [activeCategory, setActiveCategory] = useState("all");
  
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceRef = useRef(null);

  // Handle search input with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchQuery.trim());
      }, 300);
    } else {
      setSearchResults({ posts: [], comments: [], profiles: [] });
      setShowResults(false);
      onSearchResults?.(null);
      onSearchStateChange?.(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setIsSearching(true);
    onSearchStateChange?.(true);

    try {
      // Search posts
      const postsResult = await postsService.searchPosts(query);
      
      // Search comments
      const commentsResult = await postsService.searchComments(query);
      
      // Search user profiles
      const profilesResult = await userService.searchProfiles(query);

      const results = {
        posts: postsResult.success ? postsResult.posts : [],
        comments: commentsResult.success ? commentsResult.comments : [],
        profiles: profilesResult.success ? profilesResult.profiles : [],
      };

      setSearchResults(results);
      setShowResults(true);
      onSearchResults?.(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ posts: [], comments: [], profiles: [] });
    } finally {
      setIsSearching(false);
      onSearchStateChange?.(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ posts: [], comments: [], profiles: [] });
    setShowResults(false);
    onSearchResults?.(null);
    onSearchStateChange?.(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return "today";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getTotalResults = () => {
    return searchResults.posts.length + searchResults.comments.length + searchResults.profiles.length;
  };

  const getFilteredResults = () => {
    if (activeCategory === "all") {
      return searchResults;
    }
    
    return {
      posts: activeCategory === "posts" ? searchResults.posts : [],
      comments: activeCategory === "comments" ? searchResults.comments : [],
      profiles: activeCategory === "profiles" ? searchResults.profiles : [],
    };
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search posts, comments, profiles..."
            className="w-full pl-10 pr-10 py-2 text-sm text-gray-900 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          />
          
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery.trim().length >= 2 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden"
        >
          {/* Results Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900">
                {getTotalResults()} results for "{searchQuery}"
              </div>
              
              {/* Category Filter */}
              <div className="flex space-x-1">
                {["all", "posts", "comments", "profiles"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors capitalize ${
                      activeCategory === category
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="max-h-80 overflow-y-auto">
            {getTotalResults() === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Posts Results */}
                {filteredResults.posts.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                      Posts ({filteredResults.posts.length})
                    </div>
                    {filteredResults.posts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          // Handle post click - could scroll to post or navigate
                          setShowResults(false);
                        }}
                      >
                        <div className="flex items-start space-x-2">
                          <UserDisplay userId={post.authorId} size="xs" showRole={false} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {highlightText(post.content, searchQuery)}
                            </p>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatTimestamp(post.createdAt)} • {post.likesCount || 0} likes
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comments Results */}
                {filteredResults.comments.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                      Comments ({filteredResults.comments.length})
                    </div>
                    {filteredResults.comments.slice(0, 3).map((comment) => (
                      <div
                        key={comment.id}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          // Handle comment click - could navigate to parent post
                          setShowResults(false);
                        }}
                      >
                        <div className="flex items-start space-x-2">
                          <UserDisplay userId={comment.authorId} size="xs" showRole={false} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {highlightText(comment.content, searchQuery)}
                            </p>
                            <div className="text-xs text-gray-500 mt-1">
                              Comment • {formatTimestamp(comment.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Profiles Results */}
                {filteredResults.profiles.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                      Profiles ({filteredResults.profiles.length})
                    </div>
                    {filteredResults.profiles.slice(0, 3).map((profile) => (
                      <div
                        key={profile.uid}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setShowResults(false);
                          router.push(`/profile/${profile.uid}`);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <UserDisplay userId={profile.uid} size="sm" showRole={true} />
                          <div className="flex-1 min-w-0">
                            {profile.bio && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {highlightText(profile.bio, searchQuery)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
