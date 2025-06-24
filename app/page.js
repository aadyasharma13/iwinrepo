'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Simplified */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50/30 flex items-center">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200/50 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 font-medium text-sm">Trusted Healthcare Community</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              Heal Through
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mt-2">
                Shared Stories
              </span>
            </h1>
            
            {/* Description */}  
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
              I-Win is a secure healthcare community where patients, caregivers, and medical professionals 
              share authentic experiences, find support, and inspire healing through connection.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Join Community</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <button className="group w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 rounded-xl text-lg font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-lg">
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Watch Stories</span>
                </span>
              </button>
            </div>

            {/* Community Stats */}
            {/* <div className="pt-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {[
                  { number: '25K+', label: 'Active Members', icon: '👥' },
                  { number: '50K+', label: 'Stories Shared', icon: '💬' },
                  { number: '4.8★', label: 'Trust Rating', icon: '⭐' }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/50">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Trust Indicators */}
            <div className="pt-8">
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-70">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9L10,17Z"/>
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5,12C19,12 21,14 21,16.5C21,17.38 20.75,18.21 20.31,18.9L23.39,22L22,23.39L18.88,20.32C18.19,20.75 17.37,21 16.5,21C14,21 12,19 12,16.5C12,14 14,12 16.5,12M16.5,14A2.5,2.5 0 0,0 14,16.5A2.5,2.5 0 0,0 16.5,19A2.5,2.5 0 0,0 19,16.5A2.5,2.5 0 0,0 16.5,14M6,8V10H18V8H6M2,12V14H11V12H2M2,16V18H9V16H2Z"/>
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Medically Reviewed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Roles Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-24">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-full mb-6">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-emerald-700 font-semibold text-sm">Healthcare Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Your Healthcare
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Support Network
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Connect with others who understand your journey. Whether you&apos;re seeking support, 
              sharing expertise, or offering care, find your place in our community.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Patients & Survivors Card */}
            <div 
              className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 sm:p-10 lg:p-12 rounded-2xl lg:rounded-3xl hover:shadow-2xl transition-all duration-700 border border-emerald-100 hover:border-emerald-200 hover:-translate-y-2 cursor-pointer"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl lg:rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Patients & Survivors</h3>
                <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-base lg:text-lg">
                  Share your journey, find others with similar experiences, and discover hope through 
                  community support and authentic stories of resilience.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                  {['Share Stories', 'Find Support', 'Connect Safely'].map((feature, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-200/50 text-emerald-700 rounded-full text-xs lg:text-sm font-semibold border border-emerald-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/auth" className="group/btn inline-flex items-center space-x-2 lg:space-x-3 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-base lg:text-lg">
                  <span>Join as Patient</span>
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-2xl lg:rounded-3xl blur-xl transition-opacity duration-500 ${hoveredCard === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>

            {/* Caregivers Card */}
            <div 
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 sm:p-10 lg:p-12 rounded-2xl lg:rounded-3xl hover:shadow-2xl transition-all duration-700 border border-blue-100 hover:border-blue-200 hover:-translate-y-2 cursor-pointer"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl lg:rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Caregivers & Family</h3>
                <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-base lg:text-lg">
                  Find support, share experiences, and connect with other caregivers who understand 
                  the challenges and rewards of caring for loved ones.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                  {['Caregiver Support', 'Resource Sharing', 'Expert Advice'].map((feature, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-200/50 text-blue-700 rounded-full text-xs lg:text-sm font-semibold border border-blue-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/auth" className="group/btn inline-flex items-center space-x-2 lg:space-x-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-base lg:text-lg">
                  <span>Join as Caregiver</span>
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl lg:rounded-3xl blur-xl transition-opacity duration-500 ${hoveredCard === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>

            {/* Medical Professionals Card */}
            <div 
              className="group relative bg-gradient-to-br from-teal-50 to-teal-100/50 p-8 sm:p-10 lg:p-12 rounded-2xl lg:rounded-3xl hover:shadow-2xl transition-all duration-700 border border-teal-100 hover:border-teal-200 hover:-translate-y-2 cursor-pointer"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-2xl lg:rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Medical Professionals</h3>
                <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-base lg:text-lg">
                  Share insights, connect with colleagues, and contribute to patient education and 
                  support through professional expertise and experience.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                  {['Share Expertise', 'Professional Network', 'Patient Education'].map((feature, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 lg:px-4 lg:py-2 bg-teal-200/50 text-teal-700 rounded-full text-xs lg:text-sm font-semibold border border-teal-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link href="/auth" className="group/btn inline-flex items-center space-x-2 lg:space-x-3 text-teal-600 font-semibold hover:text-teal-700 transition-colors text-base lg:text-lg">
                  <span>Join as Professional</span>
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-2xl lg:rounded-3xl blur-xl transition-opacity duration-500 ${hoveredCard === 2 ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-blue-50/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-24">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span className="text-blue-700 font-semibold text-sm">Inspiring Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Stories That
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Inspire Hope
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Listen to authentic journeys from our community members. Every story is a beacon of hope, 
              resilience, and the power of human connection in healthcare.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                title: "Sarah's Stroke Recovery Journey",
                description: "From ICU to independence: A mother's determination to rebuild her life and inspire others facing similar challenges.",
                duration: "18 min",
                type: "Video Story",
                category: "Stroke Recovery",
                author: "Sarah Martinez, Stroke Survivor",
                color: "emerald",
                stats: { views: "12.4K", hearts: "892" }
              },
              {
                title: "Caring for Mom with Alzheimer's",
                description: "A daughter's heartfelt account of navigating the complexities of caregiving while maintaining hope and dignity.",
                duration: "24 min",
                type: "Audio Story",
                category: "Alzheimer's Care",
                author: "Jennifer Chen, Family Caregiver",
                color: "blue",
                stats: { views: "8.7K", hearts: "674" }
              },
              {
                title: "Life After Cancer: Finding Purpose",
                description: "A cancer survivor shares how diagnosis became a catalyst for deeper meaning and community connection.",
                duration: "31 min",
                type: "Podcast",
                category: "Cancer Survivorship",
                author: "Michael Rodriguez, Cancer Survivor",
                color: "teal",
                stats: { views: "15.2K", hearts: "1.1K" }
              }
            ].map((story, index) => (
              <div key={index} className="group bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100 hover:-translate-y-2">
                {/* Story Preview */}
                <div className={`aspect-video bg-gradient-to-br from-${story.color}-200 via-${story.color}-100 to-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent"></div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className={`w-6 h-6 sm:w-8 sm:h-8 text-${story.color}-500 ml-1`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/70 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                    {story.duration}
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 bg-${story.color}-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg`}>
                    {story.category}
                  </div>
                </div>
                
                {/* Story Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <span className={`w-2 h-2 bg-${story.color}-500 rounded-full`}></span>
                    <span className="text-sm font-medium text-gray-600">{story.type}</span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg">
                    {story.description}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-${story.color}-400 to-${story.color}-500 rounded-full flex items-center justify-center text-white font-semibold`}>
                      {story.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{story.author.split(',')[0]}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{story.author.split(',')[1]}</p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-600">{story.stats.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-600">{story.stats.hearts}</span>
                      </div>
                    </div>
                    
                    <button className={`group/btn flex items-center space-x-1 sm:space-x-2 text-${story.color}-600 font-semibold hover:text-${story.color}-700 transition-colors text-sm sm:text-base`}>
                      <span>Listen Now</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-20">
            <Link href="/community" className="group inline-flex items-center space-x-2 sm:space-x-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Explore All Stories</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 sm:mb-8">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white font-semibold text-sm">Join Today</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Your Story Matters
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              Join thousands of healthcare community members sharing, supporting, and healing together. 
              Your experience could be the hope someone else needs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-20">
            <Link href="/auth" className="group w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-emerald-600 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 active:scale-95">
              <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Start Your Journey</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            
            <button className="group w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:bg-white/30 hover:border-white/40 transition-all duration-300 shadow-xl">
              <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Watch Demo</span>
              </span>
            </button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            {[
              { number: '25K+', label: 'Community Members' },
              { number: '4.8★', label: 'Trust Rating' },
              { number: '50K+', label: 'Stories Shared' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}