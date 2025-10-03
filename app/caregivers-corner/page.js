'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CaregiversCorner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('burnout-check');
  const [burnoutScore, setBurnoutScore] = useState(0);
  const [burnoutLevel, setBurnoutLevel] = useState('');
  const [ventMessage, setVentMessage] = useState('');
  const [ventMessages, setVentMessages] = useState([]);
  const [selfCareReminders, setSelfCareReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  const [tips, setTips] = useState([]);

  // Burnout assessment questions
  const burnoutQuestions = [
    {
      id: 1,
      question: "How often do you feel emotionally drained by your caregiving responsibilities?",
      options: [
        { text: "Never", value: 0 },
        { text: "Rarely", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Always", value: 4 }
      ]
    },
    {
      id: 2,
      question: "How often do you feel like you have no control over your caregiving situation?",
      options: [
        { text: "Never", value: 0 },
        { text: "Rarely", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Always", value: 4 }
      ]
    },
    {
      id: 3,
      question: "How often do you feel isolated or alone in your caregiving role?",
      options: [
        { text: "Never", value: 0 },
        { text: "Rarely", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Always", value: 4 }
      ]
    },
    {
      id: 4,
      question: "How often do you feel guilty about taking time for yourself?",
      options: [
        { text: "Never", value: 0 },
        { text: "Rarely", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Always", value: 4 }
      ]
    },
    {
      id: 5,
      question: "How often do you feel overwhelmed by your caregiving duties?",
      options: [
        { text: "Never", value: 0 },
        { text: "Rarely", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 },
        { text: "Always", value: 4 }
      ]
    }
  ];

  const [questionAnswers, setQuestionAnswers] = useState({});

  // Mock data for tips and reminders
  useEffect(() => {
    const mockTips = [
      {
        id: 1,
        title: "Take Regular Breaks",
        content: "Even 15-minute breaks can help recharge your energy. Set a timer to remind yourself to step away from caregiving duties.",
        category: "Self-Care",
        author: "Sarah M., Caregiver for 5 years"
      },
      {
        id: 2,
        title: "Ask for Help",
        content: "Don't be afraid to ask family members, friends, or community resources for assistance. You don't have to do everything alone.",
        category: "Support",
        author: "Dr. Johnson, Family Therapist"
      },
      {
        id: 3,
        title: "Join a Support Group",
        content: "Connecting with other caregivers can provide emotional support and practical advice from people who understand your situation.",
        category: "Community",
        author: "Caregiver Support Network"
      },
      {
        id: 4,
        title: "Practice Mindfulness",
        content: "Simple breathing exercises or meditation can help reduce stress and improve your mental well-being.",
        category: "Mental Health",
        author: "Mindfulness Coach"
      },
      {
        id: 5,
        title: "Maintain Your Own Health",
        content: "Regular check-ups, exercise, and proper nutrition are essential. You can't care for others if you're not well yourself.",
        category: "Health",
        author: "Dr. Williams, Geriatrician"
      }
    ];

    const mockReminders = [
      {
        id: 1,
        text: "Take a 10-minute walk outside",
        completed: false,
        time: "2:00 PM"
      },
      {
        id: 2,
        text: "Call a friend or family member",
        completed: true,
        time: "4:00 PM"
      },
      {
        id: 3,
        text: "Practice deep breathing for 5 minutes",
        completed: false,
        time: "6:00 PM"
      }
    ];

    const mockVentMessages = [
      {
        id: 1,
        message: "Feeling overwhelmed today. Sometimes I wish I had more help but I don't want to burden anyone.",
        timestamp: "2 hours ago",
        likes: 12
      },
      {
        id: 2,
        message: "It's hard watching someone you love struggle. The guilt of wanting time for myself is real.",
        timestamp: "5 hours ago",
        likes: 8
      },
      {
        id: 3,
        message: "Today was a good day. My loved one smiled and that made everything worth it.",
        timestamp: "1 day ago",
        likes: 15
      }
    ];

    setTips(mockTips);
    setSelfCareReminders(mockReminders);
    setVentMessages(mockVentMessages);
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateBurnoutScore = () => {
    const totalScore = Object.values(questionAnswers).reduce((sum, score) => sum + (score || 0), 0);
    setBurnoutScore(totalScore);
    
    if (totalScore <= 5) {
      setBurnoutLevel('Low');
    } else if (totalScore <= 10) {
      setBurnoutLevel('Moderate');
    } else if (totalScore <= 15) {
      setBurnoutLevel('High');
    } else {
      setBurnoutLevel('Very High');
    }
  };

  const handleSubmitVent = () => {
    if (ventMessage.trim()) {
      const newVent = {
        id: Date.now(),
        message: ventMessage,
        timestamp: "Just now",
        likes: 0
      };
      setVentMessages(prev => [newVent, ...prev]);
      setVentMessage('');
    }
  };

  const handleAddReminder = () => {
    if (newReminder.trim()) {
      const reminder = {
        id: Date.now(),
        text: newReminder,
        completed: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSelfCareReminders(prev => [...prev, reminder]);
      setNewReminder('');
    }
  };

  const toggleReminder = (id) => {
    setSelfCareReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  const getBurnoutColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBurnoutAdvice = (level) => {
    switch (level) {
      case 'Low':
        return "Great job! You're managing your caregiving responsibilities well. Continue with your current self-care practices.";
      case 'Moderate':
        return "You're showing some signs of stress. Consider taking more breaks and reaching out for support.";
      case 'High':
        return "You're experiencing significant burnout. It's important to seek help and take immediate steps to care for yourself.";
      case 'Very High':
        return "You're at high risk for caregiver burnout. Please consider professional help and immediate support resources.";
      default:
        return "Complete the assessment to get personalized advice.";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Caregivers Corner</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              A safe space for caregivers to find support, share experiences, and take care of their own well-being.
            </p>
            <div className="space-y-4">
              <a
                href="/auth"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Sign In to Access Caregivers Corner
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role !== 'caregiver') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Caregivers Corner</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              This section is exclusively for caregivers. Please sign up as a caregiver to access these resources.
            </p>
            <div className="space-y-4">
              <a
                href="/auth"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Sign Up as Caregiver
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Caregivers Corner</h1>
            <p className="text-gray-600">Your safe space for support, self-care, and connection with fellow caregivers</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'burnout-check', label: 'Burnout Check-in', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'tips', label: 'Tips & Advice', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
              { id: 'venting', label: 'Anonymous Venting', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
              { id: 'self-care', label: 'Self-Care Reminders', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {/* Burnout Check-in Tab */}
          {activeTab === 'burnout-check' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Caregiver Burnout Assessment</h2>
                <p className="text-gray-600 mb-6">Take a moment to assess your current well-being. This assessment is completely private and will help you understand your stress levels.</p>
                
                <div className="space-y-6">
                  {burnoutQuestions.map((question) => (
                    <div key={question.id} className="border-b border-gray-100 pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.value}
                              checked={questionAnswers[question.id] === option.value}
                              onChange={() => handleAnswerChange(question.id, option.value)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-gray-700">{option.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={calculateBurnoutScore}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      Calculate My Burnout Score
                    </button>
                  </div>
                </div>
              </div>

              {burnoutScore > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold mb-4 ${getBurnoutColor(burnoutLevel)}`}>
                      Burnout Level: {burnoutLevel}
                    </div>
                    <p className="text-gray-700 text-lg mb-4">{getBurnoutAdvice(burnoutLevel)}</p>
                    <div className="text-sm text-gray-500">
                      Score: {burnoutScore}/20
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips & Advice Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips from Fellow Caregivers</h2>
                <p className="text-gray-600 mb-6">Practical advice and strategies shared by experienced caregivers and healthcare professionals.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tips.map((tip) => (
                    <div key={tip.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {tip.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{tip.content}</p>
                      <p className="text-xs text-gray-500">- {tip.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Anonymous Venting Tab */}
          {activeTab === 'venting' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Anonymous Venting Space</h2>
                <p className="text-gray-600 mb-6">Share your thoughts and feelings anonymously. This is a safe space where you can express yourself without judgment.</p>
                
                <div className="space-y-4">
                  <textarea
                    value={ventMessage}
                    onChange={(e) => setVentMessage(e.target.value)}
                    placeholder="Share what's on your mind... (This will be posted anonymously)"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSubmitVent}
                    disabled={!ventMessage.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Share Anonymously
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
                {ventMessages.map((vent) => (
                  <div key={vent.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-gray-700 mb-3">{vent.message}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{vent.timestamp}</span>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 hover:text-emerald-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{vent.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Self-Care Reminders Tab */}
          {activeTab === 'self-care' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Self-Care Reminders</h2>
                <p className="text-gray-600 mb-6">Set reminders to take care of yourself. Remember, you can't pour from an empty cup.</p>
                
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newReminder}
                      onChange={(e) => setNewReminder(e.target.value)}
                      placeholder="Add a self-care reminder..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddReminder}
                      disabled={!newReminder.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Self-Care Reminders</h3>
                {selfCareReminders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No reminders yet. Add your first self-care reminder above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selfCareReminders.map((reminder) => (
                      <div key={reminder.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              reminder.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 hover:border-emerald-500'
                            }`}
                          >
                            {reminder.completed && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {reminder.text}
                            </p>
                            <p className="text-sm text-gray-500">Reminder at {reminder.time}</p>
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

      <Footer />
    </div>
  );
}
