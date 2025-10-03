'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import aiService from '@/lib/aiService';

// AI Service is now imported and handles all response generation

const quickActions = [
  { text: "Find verified doctors", icon: "👨‍⚕️" },
  { text: "Join community", icon: "🤝" },
  { text: "Mental health support", icon: "🧠" },
  { text: "Update my profile", icon: "👤" }
];

export default function ChatbotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Initialize AI service with user context
    aiService.setUserContext(user);
    
    // Generate personalized welcome message using AI
    const welcomeMessage = aiService.generateResponse(
      `Hello, I'm ${user.displayName || user.email}. I'm new here and would like to know what you can help me with.`
    );

    // Welcome message
    setMessages([
      {
        id: 1,
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // AI service now handles all response generation

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setAiThinking(true);

    // Generate AI response
    try {
      const aiResponse = aiService.generateResponse(input.trim());
      
      // Simulate realistic thinking and typing delay
      const thinkingDelay = 500 + Math.random() * 1000;
      const typingDelay = Math.min(1000 + (aiResponse.length * 20), 3000);
      
      setTimeout(() => {
        setAiThinking(false);
        setIsTyping(true);
        
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: aiResponse,
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setConversationCount(prev => prev + 1);
        }, typingDelay);
      }, thinkingDelay);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.",
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleQuickAction = (action) => {
    if (action === "Join community") {
      router.push('/community');
    } else if (action === "Update my profile") {
      router.push('/profile');
    } else {
      // Generate AI response for quick actions
      const userMessage = {
        id: Date.now(),
        text: action,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Generate AI response
      try {
        const aiResponse = aiService.generateResponse(action);
        
        // Simulate realistic typing delay
        const typingDelay = Math.min(1000 + (aiResponse.length * 20), 3000);
        
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: aiResponse,
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setConversationCount(prev => prev + 1);
        }, typingDelay);
      } catch (error) {
        console.error('Error generating AI response:', error);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-500 rounded-full shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3">
              AI Health Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-2">Your personal health companion, available 24/7</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Online and ready to help</span>
              {conversationCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                  {conversationCount} exchanges
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Chat Container */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            
            {/* Quick Actions - Only show when no messages */}
            {messages.length <= 1 && (
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-blue-50">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I help you today?</h3>
                  <p className="text-sm text-gray-600">Choose a quick action or type your question below</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className="group flex items-center space-x-3 p-4 bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-xl transition-all duration-300 text-sm font-medium text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300 hover:shadow-md transform hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-300">
                        <span className="text-xl">{action.icon}</span>
                      </div>
                      <span className="text-left">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`flex items-start space-x-3 max-w-sm lg:max-w-lg xl:max-w-xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Enhanced Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white ring-2 ring-emerald-200' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-200'
                    }`}>
                      {message.sender === 'user' ? (
                        <span className="text-sm font-bold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>

                    {/* Enhanced Message Bubble */}
                    <div className="relative">
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      </div>
                      {/* Message tail */}
                      <div className={`absolute top-0 w-0 h-0 ${
                        message.sender === 'user' 
                          ? 'right-0 border-l-8 border-l-emerald-500 border-t-8 border-t-transparent border-b-8 border-b-transparent' 
                          : 'left-0 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* AI Thinking indicator */}
              {aiThinking && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-start space-x-3 max-w-sm lg:max-w-lg xl:max-w-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-purple-200">
                      <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-5 py-3 rounded-2xl rounded-bl-md border border-purple-200 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-xs text-purple-600 font-medium">AI thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Typing indicator */}
              {isTyping && !aiThinking && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-start space-x-3 max-w-sm lg:max-w-lg xl:max-w-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-blue-200">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our community, verified doctors, or health guidance..."
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 text-gray-900 placeholder-gray-500 bg-white shadow-sm transition-all duration-300"
                    disabled={isTyping}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                >
                  {isTyping ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Enhanced Disclaimer */}
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-700">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm font-medium">
                    This AI provides general health information only. For medical emergencies, contact emergency services immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push('/community')}
              className="group flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:border-purple-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 group-hover:scale-110">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">Join Community</h3>
                <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">Connect with patients, caregivers, and medical professionals</p>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="group flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:border-emerald-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300 group-hover:scale-110">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Your Profile</h3>
                <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">Manage your account and health information</p>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}