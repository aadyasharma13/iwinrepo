// AI Service for dynamic responses using a simple pattern-based approach
// This simulates AI-like responses without requiring external APIs

class AIService {
  constructor() {
    this.context = {
      userRole: null,
      conversationHistory: [],
      lastTopics: []
    };
    
    // Enhanced response patterns with more intelligent matching
    this.responsePatterns = [
      {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
        responses: [
          "Hello! I'm your AI Health Assistant. I'm here to support you on your health journey. How can I help you today?",
          "Hi there! Welcome to I-Win. I'm ready to assist you with health-related questions and connect you with our community.",
          "Hey! Great to see you. I'm here to provide guidance and help you navigate your health and wellness needs."
        ],
        followUp: "What specific health topic would you like to explore today?"
      },
      {
        keywords: ['help', 'what can you do', 'features', 'capabilities', 'assist'],
        responses: [
          "I can help you with:\n• Health information and guidance\n• Connecting with verified medical professionals\n• Finding community support\n• Mental health resources\n• Wellness tips and advice\n• Navigating our platform features",
          "I'm your comprehensive health companion! I can provide guidance, connect you with our community, help you find medical professionals, and offer wellness support.",
          "I'm here to support your health journey by providing information, connecting you with experts, and helping you access our community resources."
        ],
        followUp: "Is there a specific area where you'd like more detailed help?"
      },
      {
        keywords: ['pain', 'headache', 'hurt', 'ache', 'symptoms', 'discomfort', 'sore'],
        responses: [
          "I understand you're experiencing discomfort. While I can't provide medical diagnosis, I can suggest:\n• Rest and proper hydration\n• Gentle movement if appropriate\n• Consulting with our verified medical professionals\n• Connecting with others who may have similar experiences",
          "Health symptoms should be properly evaluated. I recommend reaching out to our verified medical professionals in the community for proper guidance and assessment.",
          "Your health concerns are important. Consider consulting with healthcare providers and connecting with our supportive community for additional insights."
        ],
        followUp: "Would you like me to help you connect with our verified medical professionals?"
      },
      {
        keywords: ['depression', 'anxiety', 'sad', 'stressed', 'mental health', 'overwhelmed', 'worried'],
        responses: [
          "Mental health is just as important as physical health. I'm here to listen and support you. Consider:\n• Speaking with mental health professionals\n• Connecting with our supportive community\n• Exploring our mental health resources\n• Practicing self-care techniques",
          "Thank you for sharing your feelings. Your mental wellbeing matters deeply. Our community has supportive members and verified professionals who understand what you're going through.",
          "I appreciate you opening up about your mental health. Remember, seeking help is a sign of strength. Our I-Win community is here to support you."
        ],
        followUp: "Would you like me to connect you with mental health resources or our supportive community?"
      },
      {
        keywords: ['doctor', 'appointment', 'healthcare provider', 'medical professional', 'physician', 'specialist'],
        responses: [
          "Finding the right healthcare provider is crucial for your health. Through I-Win, you can:\n• Connect with verified medical professionals\n• View their specializations and expertise\n• Get guidance from experienced providers\n• Read reviews from other patients",
          "Our platform has verified medical professionals who are part of our community. You can explore their profiles, specializations, and connect with them for guidance.",
          "I can help you find the right medical professional for your needs. Our verified professionals are here to support your health journey."
        ],
        followUp: "What type of medical professional are you looking for? I can help you find specialists in our community."
      },
      {
        keywords: ['community', 'support', 'connect', 'people', 'others', 'share', 'experience'],
        responses: [
          "Our I-Win community is amazing and supportive! You can:\n• Connect with others who understand your journey\n• Share experiences and get support\n• Learn from patients, caregivers, and medical professionals\n• Join discussions and find encouragement",
          "The I-Win community is here to support you through your health journey. Connect with people who truly understand your experience and can offer valuable insights.",
          "Our community is full of caring individuals who are ready to support you. Whether you're a patient, caregiver, or medical professional, you'll find understanding and encouragement."
        ],
        followUp: "Would you like me to take you to our community section to explore and connect?"
      },
      {
        keywords: ['profile', 'account', 'verification', 'settings', 'update', 'information'],
        responses: [
          "Your I-Win profile is important for getting the most from our platform! You can:\n• Complete your health profile\n• Get verified if you're a medical professional\n• Update your information and preferences\n• Manage your community presence",
          "Keep your I-Win profile updated to maximize your experience. Medical professionals can get verified to build trust and credibility with other community members.",
          "Your profile helps others understand your background and needs. Keeping it current ensures you get the most relevant support and connections."
        ],
        followUp: "Would you like me to take you to your profile section to update your information?"
      },
      {
        keywords: ['medication', 'medicine', 'drug', 'prescription', 'treatment', 'therapy'],
        responses: [
          "Medication and treatment questions are important. While I can provide general information, I strongly recommend:\n• Consulting with your healthcare provider\n• Speaking with our verified medical professionals\n• Discussing with your pharmacist\n• Following prescribed treatment plans",
          "For medication and treatment guidance, it's best to consult with qualified healthcare professionals. Our verified medical professionals can provide appropriate guidance.",
          "Medication questions should be addressed with healthcare providers who know your specific situation and medical history."
        ],
        followUp: "Would you like me to connect you with our verified medical professionals for medication guidance?"
      },
      {
        keywords: ['emergency', 'urgent', 'severe', 'critical', 'immediate', 'help now'],
        responses: [
          "If you're experiencing a medical emergency, please:\n• Call emergency services (911) immediately\n• Go to your nearest emergency room\n• Contact your healthcare provider\n• Don't wait for online responses",
          "For medical emergencies, please seek immediate professional medical attention. Call 911 or go to the nearest emergency room right away.",
          "Medical emergencies require immediate professional care. Please contact emergency services or go to the nearest hospital immediately."
        ],
        followUp: "Are you currently experiencing a medical emergency? If so, please call 911 immediately."
      },
      {
        keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
        responses: [
          "You're very welcome! I'm here whenever you need support or guidance. Take care and remember that our I-Win community is always here for you! 💚",
          "Happy to help! Remember, our I-Win community is always here to support you on your health journey. Wishing you wellness! 🌟",
          "It's my pleasure to assist you! Don't hesitate to reach out anytime. Our community is here to support you every step of the way! 💙"
        ],
        followUp: "Is there anything else I can help you with today?"
      },
      {
        keywords: ['bye', 'goodbye', 'see you', 'take care', 'farewell', 'later'],
        responses: [
          "Take care and stay healthy! I'm here whenever you need me. Remember, our I-Win community is always ready to support you! 💚",
          "Goodbye! Wishing you good health and wellness. Don't hesitate to reach out anytime you need support! 🌟",
          "Take care! Our I-Win community is here for you whenever you need us. See you soon! 💙"
        ],
        followUp: "Feel free to come back anytime you need support or guidance!"
      }
    ];

    // Contextual responses based on conversation flow
    this.contextualResponses = {
      followUp: [
        "That's a great follow-up question! Based on our conversation, I'd recommend exploring our community resources or connecting with verified professionals.",
        "I appreciate you asking for more details. Let me help you find the most relevant resources for your situation.",
        "That's an important point to consider. Our community has many resources that might be helpful for your specific needs."
      ],
      clarification: [
        "Could you tell me more about what specific aspect you'd like to know about?",
        "I want to make sure I give you the most helpful information. Can you provide a bit more detail?",
        "That's a broad topic. What specific area would you like me to focus on?"
      ],
      encouragement: [
        "You're taking great steps by seeking information and support. That shows real strength!",
        "It's wonderful that you're being proactive about your health. That's the best approach!",
        "Your commitment to your health and wellbeing is inspiring. Keep up the great work!"
      ]
    };
  }

  // Set user context
  setUserContext(user) {
    this.context.userRole = user?.role;
    this.context.userName = user?.displayName || user?.email;
  }

  // Add message to conversation history
  addToHistory(message, sender) {
    this.context.conversationHistory.push({
      text: message,
      sender: sender,
      timestamp: new Date()
    });
    
    // Keep only last 10 messages for context
    if (this.context.conversationHistory.length > 10) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-10);
    }
  }

  // Analyze conversation context
  analyzeContext() {
    const recentMessages = this.context.conversationHistory.slice(-3);
    const topics = [];
    
    recentMessages.forEach(msg => {
      if (msg.sender === 'user') {
        this.responsePatterns.forEach(pattern => {
          if (pattern.keywords.some(keyword => 
            msg.text.toLowerCase().includes(keyword)
          )) {
            topics.push(pattern.keywords[0]);
          }
        });
      }
    });
    
    this.context.lastTopics = [...new Set(topics)];
  }

  // Generate intelligent response
  generateResponse(userMessage) {
    this.addToHistory(userMessage, 'user');
    this.analyzeContext();
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for emergency keywords first
    if (this.hasEmergencyKeywords(lowerMessage)) {
      return this.getEmergencyResponse();
    }
    
    // Find best matching pattern
    let bestMatch = null;
    let highestScore = 0;
    
    this.responsePatterns.forEach(pattern => {
      const score = this.calculateMatchScore(lowerMessage, pattern.keywords);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = pattern;
      }
    });
    
    // Generate response based on match
    if (bestMatch && highestScore > 0) {
      const response = this.getRandomResponse(bestMatch.responses);
      const followUp = this.shouldAddFollowUp() ? bestMatch.followUp : null;
      
      const fullResponse = followUp ? `${response}\n\n${followUp}` : response;
      this.addToHistory(fullResponse, 'bot');
      
      return fullResponse;
    }
    
    // Generate contextual response for unmatched queries
    return this.generateContextualResponse(lowerMessage);
  }

  // Calculate match score for keywords
  calculateMatchScore(message, keywords) {
    let score = 0;
    keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        score += 1;
        // Boost score for exact matches
        if (message.includes(` ${keyword} `) || message.startsWith(keyword) || message.endsWith(keyword)) {
          score += 0.5;
        }
      }
    });
    return score;
  }

  // Check for emergency keywords
  hasEmergencyKeywords(message) {
    const emergencyKeywords = ['emergency', 'urgent', 'severe', 'critical', 'immediate', 'help now', 'dying', 'can\'t breathe'];
    return emergencyKeywords.some(keyword => message.includes(keyword));
  }

  // Get emergency response
  getEmergencyResponse() {
    const emergencyResponse = "🚨 MEDICAL EMERGENCY ALERT 🚨\n\nIf you're experiencing a medical emergency, please:\n• Call 911 immediately\n• Go to your nearest emergency room\n• Contact your healthcare provider\n\nThis AI cannot provide emergency medical care. Please seek immediate professional medical attention.";
    this.addToHistory(emergencyResponse, 'bot');
    return emergencyResponse;
  }

  // Get random response from array
  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check if should add follow-up question
  shouldAddFollowUp() {
    return Math.random() > 0.3; // 70% chance of follow-up
  }

  // Generate contextual response for unmatched queries
  generateContextualResponse(message) {
    // Check if it's a question
    const isQuestion = message.includes('?') || message.startsWith('what') || message.startsWith('how') || message.startsWith('why') || message.startsWith('when') || message.startsWith('where');
    
    // Check if it's asking for clarification
    const needsClarification = message.length < 10 || message.includes('what do you mean') || message.includes('explain');
    
    let response;
    
    if (isQuestion) {
      response = this.getRandomResponse([
        "That's an excellent question! While I can provide general health information, I recommend consulting with our verified medical professionals for personalized advice. Would you like me to help you connect with them?",
        "I understand your question. For the most accurate and personalized information, our I-Win community has verified healthcare providers who can help. Would you like me to take you to our community?",
        "Thank you for asking! For specific health questions, it's best to connect with the verified medical professionals in our I-Win community. How else can I support your health journey?"
      ]);
    } else if (needsClarification) {
      response = this.getRandomResponse(this.contextualResponses.clarification);
    } else {
      response = this.getRandomResponse([
        "I appreciate you sharing that with me. While I can offer general guidance, our community of verified professionals and supportive members can provide more personalized help. Would you like to explore our community?",
        "Thank you for telling me about that. Our I-Win community has many resources and experienced members who might be able to provide more specific guidance. Would you like me to help you connect with them?",
        "I understand what you're saying. For more detailed support, consider reaching out to our verified medical professionals or connecting with our supportive community members."
      ]);
    }
    
    this.addToHistory(response, 'bot');
    return response;
  }

  // Get conversation summary
  getConversationSummary() {
    return {
      messageCount: this.context.conversationHistory.length,
      lastTopics: this.context.lastTopics,
      userRole: this.context.userRole
    };
  }

  // Reset conversation
  resetConversation() {
    this.context.conversationHistory = [];
    this.context.lastTopics = [];
  }
}

// Export singleton instance
export default new AIService();
