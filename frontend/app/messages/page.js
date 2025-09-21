"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { messagingService } from "@/lib/messagingService";
import { userService } from "@/lib/userService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserDisplay from "@/components/community/UserDisplay";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [otherUsers, setOtherUsers] = useState({});

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    loadConversations();
    
    // Set up real-time listener
    const unsubscribe = messagingService.subscribeToConversations(
      user.uid,
      async (updatedConversations) => {
        setConversations(updatedConversations);
        
        // Load user data for any new conversations
        const userIds = new Set();
        updatedConversations.forEach((conversation) => {
          const otherUserId = conversation.participants.find((p) => p !== user.uid);
          if (otherUserId) userIds.add(otherUserId);
        });

        if (userIds.size > 0) {
          const usersData = await userService.getUsersData(Array.from(userIds));
          setOtherUsers(prevUsers => ({ ...prevUsers, ...usersData }));
        }
      }
    );

    return () => unsubscribe();
  }, [user, router]);

  const loadConversations = async () => {
    if (!user) return;

    const result = await messagingService.getUserConversations(user.uid);
    if (result.success) {
      setConversations(result.conversations);
      loadOtherUsers(result.conversations);
    }
    setLoading(false);
  };

  const loadOtherUsers = async (conversationsList) => {
    if (!user) return;

    const userIds = new Set();
    conversationsList.forEach((conversation) => {
      const otherUserId = conversation.participants.find((p) => p !== user.uid);
      if (otherUserId) userIds.add(otherUserId);
    });

    const usersData = await userService.getUsersData(Array.from(userIds));
    setOtherUsers(usersData);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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

  const handleConversationClick = (conversation) => {
    const otherUserId = conversation.participants.find((p) => p !== user.uid);
    router.push(`/messages/${conversation.id}?with=${otherUserId}`);
  };

  const startNewConversation = () => {
    // This could open a modal to select users or redirect to community to find users
    router.push("/community");
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading messages...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Connect with other community members
            </p>
          </div>
          <button
            onClick={startNewConversation}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Message</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {conversations.length === 0 ? (
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start connecting with other community members by sending your first message.
              </p>
              <button
                onClick={startNewConversation}
                className="px-6 py-3 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Browse Community
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => {
                const otherUserId = conversation.participants.find((p) => p !== user.uid);
                const otherUser = otherUsers[otherUserId];
                const unreadCount = conversation.unreadCount?.[user.uid] || 0;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <UserDisplay 
                          userId={otherUserId} 
                          size="lg" 
                          showRole={false} 
                          showVerified={false}
                        />
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {otherUser ? 
                              `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 
                              otherUser.displayName || 
                              'Unknown User' 
                              : 'Loading...'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(conversation.lastMessageTime)}
                            </span>
                          </div>
                        </div>
                        
                        {otherUser && (
                          <p className="text-xs text-gray-500 mb-1 capitalize">
                            {otherUser.role?.replace('_', ' ') || 'Community Member'}
                          </p>
                        )}

                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Tips for Messaging
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be respectful and supportive in all conversations</li>
                <li>• Share experiences and offer encouragement</li>
                <li>• Report any inappropriate behavior to moderators</li>
                <li>• Remember that everyone is on their own health journey</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
