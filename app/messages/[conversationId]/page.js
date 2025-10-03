"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { messagingService } from "@/lib/messagingService";
import { userService } from "@/lib/userService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserDisplay from "@/components/community/UserDisplay";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [groupMembers, setGroupMembers] = useState({});
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const conversationId = params.conversationId;
  const otherUserId = searchParams.get("with");
  const conversationType = searchParams.get("type");
  const isGroup = conversationType === "group";

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (conversationId && (otherUserId || isGroup)) {
      loadConversationData();
      loadMessages();
      
      // Set up real-time listener for messages
      const unsubscribe = messagingService.subscribeToMessages(
        conversationId,
        (updatedMessages) => {
          setMessages(updatedMessages);
          scrollToBottom();
        }
      );

      // Mark messages as read when entering conversation
      messagingService.markMessagesAsRead(conversationId, user.uid);

      return () => unsubscribe();
    }
  }, [conversationId, otherUserId, user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationData = async () => {
    try {
      // Get conversation data
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        const conversationData = { id: conversationDoc.id, ...conversationDoc.data() };
        setConversation(conversationData);

        if (isGroup) {
          // Load all group member data
          const memberIds = conversationData.participants.filter(id => id !== user.uid);
          if (memberIds.length > 0) {
            const membersData = await userService.getUsersData(memberIds);
            setGroupMembers(membersData);
          }
        } else if (otherUserId) {
          // Load other user data for direct message
          const userData = await userService.getUserData(otherUserId);
          setOtherUser(userData);
        }
      }
    } catch (error) {
      console.error("Error loading conversation data:", error);
    }
  };

  const loadMessages = async () => {
    const result = await messagingService.getMessages(conversationId);
    if (result.success) {
      setMessages(result.messages);
    }
    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    const result = await messagingService.sendMessage(
      conversationId,
      user.uid,
      messageContent
    );

    if (!result.success) {
      console.error("Failed to send message:", result.error);
      setNewMessage(messageContent); // Restore message on error
    }

    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = currentMessage.createdAt?.toDate?.() || new Date(currentMessage.createdAt);
    const previousDate = previousMessage.createdAt?.toDate?.() || new Date(previousMessage.createdAt);
    
    return currentDate.toDateString() !== previousDate.toDateString();
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
            <span className="ml-3 text-gray-600">Loading conversation...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Chat Header */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {isGroup && conversation ? (
                <>
                  {/* Group Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {conversation.name}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {conversation.memberCount || conversation.participants?.length || 0} members
                    </p>
                  </div>
                </>
              ) : otherUser ? (
                <>
                  <UserDisplay 
                    userId={otherUserId} 
                    size="lg" 
                    showRole={false} 
                    showVerified={false}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {otherUser.firstName} {otherUser.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {otherUser.role?.replace('_', ' ') || 'Community Member'}
                    </p>
                  </div>
                </>
              ) : null}
            </div>

            {isGroup ? (
              <button
                onClick={() => setShowGroupSettings(true)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Group Info
              </button>
            ) : (
              <button
                onClick={() => router.push(`/profile/${otherUserId}`)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                View Profile
              </button>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white border-x border-gray-200 flex-1 flex flex-col" style={{ height: '60vh' }}>
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  {isGroup 
                    ? `Welcome to ${conversation?.name || 'the group'}! Start the conversation.`
                    : `Start your conversation with ${otherUser?.firstName || 'this user'}`
                  }
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.senderId === user.uid;
                const previousMessage = index > 0 ? messages[index - 1] : null;
                const showDateSeparator = shouldShowDateSeparator(message, previousMessage);

                return (
                  <div key={message.id}>
                    {/* Date Separator */}
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {formatMessageDate(message.createdAt)}
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-gradient-to-br from-green-500 to-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0 p-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isGroup 
                  ? `Message ${conversation?.name || 'group'}...`
                  : `Message ${otherUser?.firstName || 'user'}...`
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={sending}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
