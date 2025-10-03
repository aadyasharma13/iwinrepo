'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MedicalInsightsChannels() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  const medicalSpecialties = [
    'Neurology', 'Cardiology', 'Oncology', 'Pediatrics', 'Dermatology', 
    'Orthopedics', 'Psychiatry', 'Gastroenterology', 'Endocrinology', 
    'Pulmonology', 'Radiology', 'Anesthesiology', 'Emergency Medicine',
    'Internal Medicine', 'Surgery', 'Obstetrics & Gynecology', 'Ophthalmology',
    'ENT', 'Urology', 'Pathology', 'Other'
  ];

  // Mock data for medical professional channels
  useEffect(() => {
    const mockChannels = [
      {
        id: '1',
        name: 'Neurological Insights with Dr. Sarah Chen',
        description: 'Sharing complex neurological cases, debunking myths about brain health, and discussing latest treatments for neurological disorders.',
        specialty: 'Neurology',
        type: 'neurology',
        memberCount: 1250,
        isLive: false,
        lastMessage: '2 hours ago',
        createdBy: 'Dr. Sarah Chen, MD',
        createdByTitle: 'Board-Certified Neurologist',
        verified: true,
        color: 'bg-purple-500',
        recentInsights: [
          'Debunked: "Brain games prevent Alzheimer\'s" - Evidence shows social engagement is more effective',
          'Case Study: Rare migraine variant responding to new CGRP therapy',
          'Myth: "You only use 10% of your brain" - Every part has a function!'
        ]
      },
      {
        id: '2',
        name: 'Cardiac Care Chronicles',
        description: 'Real-world cardiology cases, heart health education, and breaking down complex cardiac procedures for patients.',
        specialty: 'Cardiology',
        type: 'cardiology',
        memberCount: 890,
        isLive: true,
        lastMessage: '5 minutes ago',
        createdBy: 'Dr. Michael Rodriguez, MD',
        createdByTitle: 'Interventional Cardiologist',
        verified: true,
        color: 'bg-red-500',
        recentInsights: [
          'Live: Discussing new guidelines for hypertension management',
          'Case: 35-year-old with chest pain - when to worry?',
          'Myth: "Heart attacks only happen to older people" - debunked with data'
        ]
      },
      {
        id: '3',
        name: 'Pediatric Pearls',
        description: 'Child health insights, developmental milestones, and common pediatric concerns explained by a seasoned pediatrician.',
        specialty: 'Pediatrics',
        type: 'pediatrics',
        memberCount: 2100,
        isLive: false,
        lastMessage: '1 day ago',
        createdBy: 'Dr. Emily Watson, MD',
        createdByTitle: 'Pediatrician & Child Development Specialist',
        verified: true,
        color: 'bg-pink-500',
        recentInsights: [
          'When to worry about your child\'s fever - evidence-based guidelines',
          'Screen time and development: What the research really shows',
          'Vaccine myths: Addressing common concerns with scientific facts'
        ]
      },
      {
        id: '4',
        name: 'Mental Health Matters',
        description: 'Psychiatric insights, mental health education, and destigmatizing mental health conditions through evidence-based information.',
        specialty: 'Psychiatry',
        type: 'psychiatry',
        memberCount: 1450,
        isLive: false,
        lastMessage: '3 hours ago',
        createdBy: 'Dr. James Thompson, MD',
        createdByTitle: 'Psychiatrist & Addiction Medicine Specialist',
        verified: true,
        color: 'bg-indigo-500',
        recentInsights: [
          'Understanding anxiety vs. normal worry - when to seek help',
          'Medication myths: Why "natural" doesn\'t always mean safer',
          'The science behind therapy: How it changes your brain'
        ]
      },
      {
        id: '5',
        name: 'Dermatology Deep Dives',
        description: 'Skin health education, common dermatological conditions, and evidence-based skincare advice from a board-certified dermatologist.',
        specialty: 'Dermatology',
        type: 'dermatology',
        memberCount: 980,
        isLive: false,
        lastMessage: '6 hours ago',
        createdBy: 'Dr. Lisa Park, MD',
        createdByTitle: 'Board-Certified Dermatologist',
        verified: true,
        color: 'bg-orange-500',
        recentInsights: [
          'Sunscreen myths: SPF 100 isn\'t twice as good as SPF 50',
          'Acne treatment: Why over-washing makes it worse',
          'Skin cancer: What moles to watch and when to see a doctor'
        ]
      }
    ];
    
    setTimeout(() => {
      setChannels(mockChannels);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateChannel = () => {
    if (newChannelName.trim() && newChannelDescription.trim() && selectedSpecialty) {
      const newChannel = {
        id: Date.now().toString(),
        name: newChannelName,
        description: newChannelDescription,
        specialty: selectedSpecialty,
        type: selectedSpecialty.toLowerCase().replace(/\s+/g, '_'),
        memberCount: 1,
        isLive: false,
        lastMessage: 'Just now',
        createdBy: user?.displayName || 'You',
        createdByTitle: user?.medicalVerification?.title || 'Medical Professional',
        verified: true,
        color: getSpecialtyColor(selectedSpecialty),
        recentInsights: []
      };
      setChannels([newChannel, ...channels]);
      setNewChannelName('');
      setNewChannelDescription('');
      setSelectedSpecialty('');
      setIsCreatingChannel(false);
    }
  };

  const getSpecialtyColor = (specialty) => {
    const colorMap = {
      'Neurology': 'bg-purple-500',
      'Cardiology': 'bg-red-500',
      'Pediatrics': 'bg-pink-500',
      'Psychiatry': 'bg-indigo-500',
      'Dermatology': 'bg-orange-500',
      'Oncology': 'bg-yellow-500',
      'Orthopedics': 'bg-blue-500',
      'Gastroenterology': 'bg-green-500',
      'Endocrinology': 'bg-teal-500',
      'Pulmonology': 'bg-cyan-500',
      'Radiology': 'bg-gray-500',
      'Anesthesiology': 'bg-slate-500',
      'Emergency Medicine': 'bg-rose-500',
      'Internal Medicine': 'bg-emerald-500',
      'Surgery': 'bg-violet-500',
      'Obstetrics & Gynecology': 'bg-fuchsia-500',
      'Ophthalmology': 'bg-sky-500',
      'ENT': 'bg-lime-500',
      'Urology': 'bg-amber-500',
      'Pathology': 'bg-stone-500',
      'Other': 'bg-gray-500'
    };
    return colorMap[specialty] || 'bg-gray-500';
  };

  const filteredChannels = channels.filter(channel => 
    filterSpecialty === 'all' || channel.specialty === filterSpecialty
  );

  const isMedicalProfessional = user?.role === 'medical_professional' && user?.medicalVerification?.status === 'verified';

  const getChannelIcon = (specialty) => {
    switch (specialty) {
      case 'Neurology':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'Cardiology':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'Pediatrics':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'Psychiatry':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'Dermatology':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getChannelTypeLabel = (type) => {
    switch (type) {
      case 'announcement': return 'Announcement';
      case 'health': return 'Health';
      case 'emergency': return 'Emergency';
      case 'support': return 'Support';
      case 'professional': return 'Professional';
      default: return 'Custom';
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Insights Channels</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Access exclusive medical insights from verified healthcare professionals. Learn from real cases, debunk medical myths, and stay updated with evidence-based health information.
            </p>
            <div className="space-y-4">
              <a
                href="/auth"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Sign In to Access Medical Channels
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Insights Channels</h1>
              <p className="text-gray-600">Learn from verified medical professionals sharing real cases, debunking myths, and providing evidence-based insights</p>
            </div>
            {isMedicalProfessional ? (
              <button
                onClick={() => setIsCreatingChannel(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Channel</span>
              </button>
            ) : (
              <div className="text-center lg:text-right">
                
                <div className="flex items-center justify-center lg:justify-end space-x-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-emerald-600 font-medium">Verified Medical Professional Required</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specialty Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterSpecialty('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterSpecialty === 'all'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Specialties
            </button>
            {medicalSpecialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setFilterSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterSpecialty === specialty
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Create Channel Modal */}
        {isCreatingChannel && isMedicalProfessional && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Medical Insights Channel</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name</label>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="e.g., Neurological Insights with Dr. [Your Name]"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select your medical specialty</option>
                    {medicalSpecialties.map((specialty) => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel Description</label>
                  <textarea
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    placeholder="Describe what medical insights you'll share (cases, myths to debunk, treatments, etc.)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Medical Professional Guidelines:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Share evidence-based medical information only</li>
                        <li>• Maintain patient confidentiality</li>
                        <li>• Include disclaimers for educational purposes</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setIsCreatingChannel(false);
                      setNewChannelName('');
                      setNewChannelDescription('');
                      setSelectedSpecialty('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateChannel}
                    disabled={!newChannelName.trim() || !newChannelDescription.trim() || !selectedSpecialty}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Channels Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 ${channel.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {getChannelIcon(channel.specialty)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{channel.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {channel.specialty}
                      </span>
                      {channel.verified && (
                        <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Verified</span>
                        </span>
                      )}
                      {channel.isLive && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{channel.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">Recent insights:</div>
                  {channel.recentInsights && channel.recentInsights.length > 0 && (
                    <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                      "{channel.recentInsights[0]}"
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{channel.memberCount.toLocaleString()}</span>
                    </span>
                    <span>•</span>
                    <span>{channel.lastMessage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Channel Detail Modal */}
        {selectedChannel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${selectedChannel.color} rounded-full flex items-center justify-center text-white`}>
                    {getChannelIcon(selectedChannel.specialty)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedChannel.name}</h2>
                    <p className="text-gray-600">{selectedChannel.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Members</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedChannel.memberCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Specialty</div>
                    <div className="text-lg font-semibold text-gray-900">{selectedChannel.specialty}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Medical Professional</div>
                  <div className="font-medium text-gray-900">{selectedChannel.createdBy}</div>
                  <div className="text-sm text-gray-600">{selectedChannel.createdByTitle}</div>
                  {selectedChannel.verified && (
                    <div className="flex items-center space-x-1 mt-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-emerald-600 font-medium">Verified Medical Professional</span>
                    </div>
                  )}
                </div>

                {selectedChannel.recentInsights && selectedChannel.recentInsights.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Recent Medical Insights</h3>
                    <div className="space-y-2">
                      {selectedChannel.recentInsights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">{insight}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Medical Disclaimer</p>
                      <p className="mt-1">This channel provides educational information only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedChannel(null)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all">
                    Join Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
