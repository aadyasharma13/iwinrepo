'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const predefinedResponses = [
  {
    trigger: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hello! I'm I-Win's AI Health Assistant. How can I help you today?",
      "Hi there! I'm here to support you with health-related questions and guidance.",
      "Hey! Welcome to I-Win. What health concerns can I assist you with?"
    ]
  },
  {
    trigger: ['help', 'what can you do', 'features'],
    responses: [
      "I can help you with:\n• General health information and guidance\n• Connecting with our community\n• Finding verified medical professionals\n• Mental health support resources\n• General wellness tips",
      "I'm your personal health companion! I can provide health guidance, connect you with our community, and help you find medical professionals on our platform."
    ]
  },
  {
    trigger: ['pain', 'headache', 'hurt', 'ache', 'symptoms'],
    responses: [
      "I understand you're experiencing discomfort. While I can't diagnose, I recommend:\n• Rest and staying hydrated\n• Consulting with a healthcare provider for proper evaluation\n• Connecting with verified medical professionals in our community\n\nWould you like me to help you connect with our medical professionals?",
      "Health concerns should be properly evaluated. Consider reaching out to the verified medical professionals in our I-Win community for guidance."
    ]
  },
  {
    trigger: ['depression', 'anxiety', 'sad', 'stressed', 'mental health'],
    responses: [
      "Mental health is just as important as physical health. I'm here to listen and support you. Consider:\n• Speaking with a mental health professional\n• Connecting with our supportive community\n• Reaching out to verified professionals on our platform\n\nOur I-Win community is here for you. You're not alone in this journey.",
      "Thank you for sharing. Your mental wellbeing matters. Our community has supportive members and verified professionals who understand what you're going through."
    ]
  },
  {
    trigger: ['doctor', 'appointment', 'healthcare provider', 'medical professional'],
    responses: [
      "Finding the right healthcare provider is important. Through I-Win, you can:\n• Connect with verified medical professionals in our community\n• View their profiles and specializations\n• Get guidance from experienced healthcare providers\n\nWould you like me to help you explore our verified professionals?",
      "Our I-Win platform has verified medical professionals who are part of our community. You can view their profiles and connect with them for guidance."
    ]
  },
  {
    trigger: ['community', 'support', 'connect', 'people'],
    responses: [
      "Our I-Win community is amazing! You can:\n• Connect with others who understand your journey\n• Share experiences and get support\n• Learn from patients, caregivers, and medical professionals\n• Join discussions and find encouragement\n\nWould you like me to take you to our community section?",
      "The I-Win community is here to support you. Connect with patients, caregivers, and verified medical professionals who truly understand your experience."
    ]
  },
  {
    trigger: ['profile', 'account', 'verification'],
    responses: [
      "Your I-Win profile is important! You can:\n• Complete your health profile\n• Get verified if you're a medical professional\n• Update your information\n• Manage your community presence\n\nWould you like me to take you to your profile section?",
      "Keep your I-Win profile updated to get the most from our community. Medical professionals can also get verified to build trust with other members."
    ]
  },
  {
    trigger: ['thank', 'thanks', 'appreciate'],
    responses: [
      "You're very welcome! I'm here whenever you need support or guidance. Take care! 💚",
      "Happy to help! Remember, our I-Win community is always here for you. Wishing you wellness! 🌟"
    ]
  },
  {
    trigger: ['bye', 'goodbye', 'see you', 'take care'],
    responses: [
      "Take care and stay healthy! I'm here whenever you need me. 💚",
      "Goodbye! Remember, our I-Win community is here to support you. See you soon! 🌟",
      "Wishing you good health! Don't hesitate to reach out anytime. Take care! 💙"
    ]
  }
];

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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Welcome message
    setMessages([
      {
        id: 1,
        text: `Hello ${user.displayName || 'there'}! I'm your AI Health Assistant. I can help you connect with our community, find verified medical professionals, and provide general health guidance. How can I assist you today?`,
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

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const responseSet of predefinedResponses) {
      if (responseSet.trigger.some(trigger => lowerMessage.includes(trigger))) {
        return getRandomResponse(responseSet.responses);
      }
    }

    // Default responses for unmatched queries
    const defaultResponses = [
      "That's a great question! While I can provide general health information, I recommend consulting with our verified medical professionals for personalized advice. Would you like me to help you connect with them?",
      "I understand your concern. For the most accurate information, our I-Win community has verified healthcare providers who can help. Would you like me to take you to our community?",
      "Thank you for asking! For specific health questions, it's best to connect with the verified medical professionals in our I-Win community. How else can I support your health journey?",
      "I appreciate you sharing that with me. While I can offer general guidance, our community of verified professionals and supportive members can provide more personalized help. Would you like to explore our community?"
    ];

    return getRandomResponse(defaultResponses);
  };

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

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(input.trim()),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleQuickAction = (action) => {
    if (action === "Join community") {
      router.push('/community');
    } else if (action === "Update my profile") {
      router.push('/profile');
    } else {
      setInput(action);
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
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Simple Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h1>
            <p className="text-gray-600">Your personal health companion, available 24/7</p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Quick Actions - Only show when no messages */}
            {messages.length <= 1 && (
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick start:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className="flex items-center space-x-2 p-3 bg-white hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200"
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <span className="text-xs font-semibold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-emerald-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-xs">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4 bg-white">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our community, verified doctors, or health guidance..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {/* Simple Disclaimer */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                ⚠️ This AI provides general health information only. For medical emergencies, contact emergency services immediately.
              </p>
            </div>
          </div>

          {/* Simple Action Cards - Only actual features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/community')}
              className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-purple-200 group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Join Community</h3>
                <p className="text-sm text-gray-600">Connect with others</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-emerald-200 group"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Your Profile</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}