'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';

export default function Community() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const handleInteraction = () => {
    setShowInstallPrompt(true);
  };

  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "sarahc_warrior",
        role: "Patient",
        avatar: "SC",
        verified: false
      },
      content: "Day 180 post-chemo. Finally feeling like myself again! The fatigue is lifting and I'm back to my morning walks. To anyone going through treatment - there IS light at the end of the tunnel. 💪✨",
      media: {
        type: "image",
        url: "/api/placeholder/400/300"
      },
      timestamp: "2h",
      likes: 847,
      comments: 92,
      shares: 156,
      tags: ["ChemoRecovery", "CancerWarrior", "Hope"]
    },
    {
      id: 2,
      user: {
        name: "Dr. Michael Rodriguez",
        username: "dr_mrodriguez",
        role: "Medical Professional",
        avatar: "MR",
        verified: true
      },
      content: "New research shows that peer support can reduce recovery time by up to 30%. This is why communities like I-Win are so crucial for patient outcomes. Knowledge + Connection = Healing 🩺",
      media: {
        type: "video",
        url: "/api/placeholder/400/300",
        duration: "2:34"
      },
      timestamp: "4h",
      likes: 1243,
      comments: 187,
      shares: 234,
      tags: ["MedicalResearch", "PeerSupport", "Healthcare"]
    },
    {
      id: 3,
      user: {
        name: "Maria Santos",
        username: "maria_caregiver",
        role: "Caregiver",
        avatar: "MS",
        verified: false
      },
      content: "Caring for my mom with Alzheimer's taught me that small moments matter most. Today she remembered my name and smiled. These victories keep us going. 💙",
      timestamp: "6h",
      likes: 623,
      comments: 78,
      shares: 91,
      tags: ["Alzheimers", "CaregiverLife", "SmallVictories"]
    },
    {
      id: 4,
      user: {
        name: "James Park",
        username: "jpark_survivor",
        role: "Patient",
        avatar: "JP",
        verified: false
      },
      content: "Started my podcast 'Healing Conversations' to share real stories from our community. Episode 1 drops tomorrow! Who wants to be a guest? 🎙️",
      media: {
        type: "audio",
        url: "/api/placeholder/400/200",
        duration: "Preview - 0:45"
      },
      timestamp: "8h",
      likes: 421,
      comments: 156,
      shares: 89,
      tags: ["Podcast", "HealingStories", "Community"]
    },
    {
      id: 5,
      user: {
        name: "Nurse Emma Thompson",
        username: "nurse_emma",
        role: "Medical Professional",
        avatar: "ET",
        verified: true
      },
      content: "Self-care Sunday reminder: You can't pour from an empty cup. Taking care of yourself isn't selfish - it's necessary. What's your favorite way to recharge? 🧘‍♀️",
      timestamp: "12h",
      likes: 892,
      comments: 234,
      shares: 167,
      tags: ["SelfCare", "MentalHealth", "Nursing"]
    },
    {
      id: 6,
      user: {
        name: "David Kim",
        username: "david_heartstrong",
        role: "Patient",
        avatar: "DK",
        verified: false
      },
      content: "6 months post-heart surgery and I just completed my first 5K! Never thought I'd be here. Thank you to everyone who supported me through this journey. Next goal: 10K! 🏃‍♂️❤️",
      media: {
        type: "video",
        url: "/api/placeholder/400/300",
        duration: "1:23"
      },
      timestamp: "1d",
      likes: 1456,
      comments: 298,
      shares: 445,
      tags: ["HeartSurgery", "Recovery", "Fitness", "Milestone"]
    }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'Patient': return 'text-green-600';
      case 'Caregiver': return 'text-blue-600';
      case 'Medical Professional': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

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
              <button 
                onClick={handleInteraction}
                className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-sm font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Share
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pb-3">
            <div className="flex space-x-6 overflow-x-auto">
              {['For you', 'Patients', 'Caregivers', 'Medical', 'Trending'].map((filter, index) => (
                <button
                  key={filter}
                  onClick={handleInteraction}
                  className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 ${
                    index === 0 
                      ? 'text-gray-900 border-green-500' 
                      : 'text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div>
          {posts.map((post, index) => (
            <div key={post.id} className={`px-4 py-3 border-b border-gray-200 hover:bg-gray-50/50 transition-colors cursor-pointer`} onClick={handleInteraction}>
              <div className="flex space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {post.user.avatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="font-semibold text-gray-900 text-sm hover:underline">
                      {post.user.name}
                    </span>
                    {post.user.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                    <span className={`text-xs font-medium ${getRoleColor(post.user.role)}`}>
                      {post.user.role === 'Medical Professional' ? 'Medical' : post.user.role}
                    </span>
                    <span className="text-gray-500 text-sm">@{post.user.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm hover:underline">{post.timestamp}</span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-3">
                    <p className="text-gray-900 text-sm leading-relaxed break-words">
                      {post.content}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-green-600 text-sm hover:underline"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media */}
                  {post.media && (
                    <div className="mb-3 rounded-2xl overflow-hidden border border-gray-200">
                      {post.media.type === 'image' && (
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium">Image</p>
                          </div>
                        </div>
                      )}
                      
                      {post.media.type === 'video' && (
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {post.media.duration}
                          </div>
                          <div className="text-center text-blue-700">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-sm font-medium">Video</p>
                          </div>
                        </div>
                      )}
                      
                      {post.media.type === 'audio' && (
                        <div className="aspect-[3/1] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                          <div className="text-center text-purple-700">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <p className="text-xs font-medium">{post.media.duration}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between max-w-md">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group p-2 -m-2 rounded-full hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{formatNumber(post.likes)}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group p-2 -m-2 rounded-full hover:bg-blue-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{formatNumber(post.comments)}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group p-2 -m-2 rounded-full hover:bg-green-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-sm">{formatNumber(post.shares)}</span>
                    </button>
                    
                    <button className="text-gray-500 hover:text-gray-700 transition-colors p-2 -m-2 rounded-full hover:bg-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <button 
            onClick={handleInteraction}
            className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline"
          >
            Show more posts
          </button>
        </div>
      </div>

      {/* Install Prompt Modal */}
      {showInstallPrompt && (
        <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
      )}
    </div>
  );
}