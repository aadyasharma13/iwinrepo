"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/userService";
import { postsService } from "@/lib/postsService";
import { messagingService } from "@/lib/messagingService";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserDisplay from "@/components/community/UserDisplay";
import Post from "@/components/community/Post";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = params.userId;

  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadUserPosts();
      loadUserGroups();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const userData = await userService.getUserData(userId);
      if (userData) {
        setProfileUser(userData);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const result = await postsService.getUserPosts(userId);
      if (result.success) {
        setUserPosts(result.posts);
      }
    } catch (err) {
      console.error("Error loading user posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadUserGroups = async () => {
    try {
      const conversationsRef = collection(db, "conversations");
      
      // Get groups created by this user
      const createdQuery = query(
        conversationsRef,
        where("type", "==", "group"),
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      // Get groups where this user is a participant
      const joinedQuery = query(
        conversationsRef,
        where("type", "==", "group"),
        where("participants", "array-contains", userId),
        orderBy("createdAt", "desc")
      );

      const [createdSnapshot, joinedSnapshot] = await Promise.all([
        getDocs(createdQuery),
        getDocs(joinedQuery)
      ]);

      const created = [];
      const joined = [];

      createdSnapshot.forEach((doc) => {
        created.push({ id: doc.id, ...doc.data() });
      });

      joinedSnapshot.forEach((doc) => {
        const groupData = { id: doc.id, ...doc.data() };
        // Only add to joined if not created by this user
        if (groupData.createdBy !== userId) {
          joined.push(groupData);
        }
      });

      setCreatedGroups(created);
      setJoinedGroups(joined);
    } catch (err) {
      console.error("Error loading user groups:", err);
    } finally {
      setGroupsLoading(false);
    }
  };

  const handlePostUpdate = () => {
    loadUserPosts();
  };

  const handlePostDelete = (postId) => {
    setUserPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "patient":
        return "Patient";
      case "caregiver":
        return "Caregiver";
      case "medical_professional":
        return "Medical Professional";
      default:
        return "Community Member";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "patient":
        return "bg-blue-100 text-blue-800";
      case "caregiver":
        return "bg-green-100 text-green-800";
      case "medical_professional":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "User not found"}
            </h2>
            <p className="text-gray-600 mb-6">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect to own profile if viewing self
  if (currentUser && currentUser.uid === userId) {
    router.replace("/profile");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <UserDisplay 
                userId={profileUser.uid} 
                size="xl" 
                showRole={false} 
                showVerified={false}
                textSize="xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profileUser.role)}`}>
                    {getRoleDisplayName(profileUser.role)}
                  </span>
                  {profileUser.verified && (
                    <div className="flex items-center text-blue-500" title="Verified">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Message Button */}
                <button
                  onClick={async () => {
                    if (!currentUser) {
                      router.push('/auth');
                      return;
                    }

                    try {
                      const result = await messagingService.getOrCreateConversation(
                        currentUser.uid,
                        profileUser.uid
                      );

                      if (result.success) {
                        router.push(`/messages/${result.conversation.id}?with=${profileUser.uid}`);
                      } else {
                        console.error('Failed to create conversation:', result.error);
                        alert('Failed to start conversation. Please try again.');
                      }
                    } catch (error) {
                      console.error('Error starting conversation:', error);
                      alert('Failed to start conversation. Please try again.');
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Message</span>
                </button>
              </div>

              {profileUser.bio && (
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {profileUser.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {profileUser.location && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{profileUser.location}</span>
                  </div>
                )}
                
                {profileUser.createdAt && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Joined {formatDate(profileUser.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Groups
            </h2>
          </div>

          <div className="p-6">
            {groupsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-500">Loading groups...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Created Groups */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Created Groups ({createdGroups.length})
                  </h3>
                  
                  {createdGroups.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      {profileUser?.firstName} hasn't created any groups yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {createdGroups.map((group) => (
                        <div
                          key={group.id}
                          onClick={() => router.push(`/messages/${group.id}?type=group`)}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {group.name}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {group.memberCount || group.participants?.length || 0} members
                              </p>
                              {group.description && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  {group.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Admin
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Joined Groups */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Joined Groups ({joinedGroups.length})
                  </h3>
                  
                  {joinedGroups.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      {profileUser?.firstName} hasn't joined any groups yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {joinedGroups.map((group) => (
                        <div
                          key={group.id}
                          onClick={() => router.push(`/messages/${group.id}?type=group`)}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {group.name}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {group.memberCount || group.participants?.length || 0} members
                              </p>
                              {group.description && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  {group.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Member
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Posts by {profileUser.firstName}
            </h2>
          </div>

          <div>
            {postsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-500">Loading posts...</span>
              </div>
            ) : userPosts.length === 0 ? (
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
                  {profileUser.firstName} hasn't shared anything yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {userPosts.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
