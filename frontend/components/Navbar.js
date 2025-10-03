'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push('/');
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-15 h-15 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="I-Win Healthcare Community"
                fill
                className="rounded-xl object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="ml-[-10] text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                I-Win
              </span>
              <span className="ml-[-10] text-xs text-gray-500 -mt-1">Healing Through Hope</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Community Link - Always visible */}
            <Link 
              href="/community" 
              className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
            >
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* AI Assistant Link - Only show when logged in */}
            {user && (
              <Link 
                href="/chatbot" 
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 relative group flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>AI Assistant</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {/* Broadcast Channels Link - Only show when logged in */}
            {user && (
              <Link 
                href="/broadcast" 
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 relative group flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Broadcast Channels</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {/* Caregivers Corner Link - Only show for caregivers */}
            {user?.role === 'caregiver' && (
              <Link 
                href="/caregivers-corner" 
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 relative group flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Caregivers Corner</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {/* Profile Link - Only show when logged in */}
            {user && (
              <Link 
                href="/profile" 
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
              >
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {/* Admin Link - Only show for admin users */}
            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName}
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-emerald-100 group-hover:ring-emerald-200 transition-all"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold ring-2 ring-emerald-100 group-hover:ring-emerald-200 transition-all">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {user.displayName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role?.replace('_', ' ') || 'Member'}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      {user.role && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">
                            {user.role.replace('_', ' ')}
                          </span>
                          {user.role === 'medical_professional' && user.medicalVerification?.status === 'verified' && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">View Profile</span>
                    </Link>

                    <Link 
                      href="/messages"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="text-sm">Messages</span>
                    </Link>

                    <Link 
                      href="/chatbot"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">AI Assistant</span>
                    </Link>

                    <Link 
                      href="/broadcast"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Broadcast Channels</span>
                    </Link>

                    {user.role === 'caregiver' && (
                      <Link 
                        href="/caregivers-corner"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">Caregivers Corner</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-sm">Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 mt-2">
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth"
                  className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-medium transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
            <div className="px-6 py-4">
              <div className="flex flex-col space-y-1">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-3 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl mb-3">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-emerald-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-emerald-200">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 font-medium truncate">
                          {user.displayName || 'User'}
                        </div>
                        <div className="text-gray-600 text-sm truncate">
                          {user.email}
                        </div>
                        {user.role && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">
                              {user.role.replace('_', ' ')}
                            </span>
                            {user.role === 'medical_professional' && user.medicalVerification?.status === 'verified' && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <Link 
                      href="/community" 
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Community</span>
                    </Link>

                    <Link 
                      href="/messages" 
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>Messages</span>
                    </Link>

                    <Link 
                      href="/chatbot" 
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>AI Assistant</span>
                    </Link>

                    <Link 
                      href="/broadcast" 
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Broadcast Channels</span>
                    </Link>

                    {user.role === 'caregiver' && (
                      <Link 
                        href="/caregivers-corner" 
                        className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Caregivers Corner</span>
                      </Link>
                    )}
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Admin</span>
                      </Link>
                    )}
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {/* Sign Out Button */}
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 transition-colors text-left rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Community Link for Non-Authenticated Users */}
                    <Link 
                      href="/community" 
                      className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Community</span>
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Sign In Button */}
                    <Link 
                      href="/auth"
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign In</span>
                    </Link>
                    
                    {/* Join Community Button */}
                    <Link 
                      href="/auth"
                      className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg text-center flex items-center justify-center space-x-2 mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Join Community</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}