'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-md mx-auto pt-12 pb-16 px-6">
        {/* Auth Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-700 font-medium text-sm">Secure Healthcare Community</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {activeTab === 'signin' ? 'Welcome Back' : activeTab === 'signup' ? 'Join I-Win' : 'Reset Password'}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {activeTab === 'signin' 
              ? 'Welcome back. Your story-and your support system \— are right here.'
              : activeTab === 'signup'
              ? 'You\'re not alone anymore \— welcome to a community that truly gets it.'
              : 'Enter your email to reset your password'
            }
          </p>
        </div>

        {/* Tab Navigation - Hide for forgot password */}
        {activeTab !== 'forgot' && (
          <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'signin'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Auth Forms */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8">
          {activeTab === 'signin' && <SignInForm onForgotPassword={() => setActiveTab('forgot')} />}
          {activeTab === 'signup' && <SignUpForm />}
          {activeTab === 'forgot' && <ForgotPasswordForm onBackToSignIn={() => setActiveTab('signin')} />}
        </div>

        {/* Footer */}
        {activeTab !== 'forgot' && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all">
                Privacy Policy
              </a>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-6 mt-6 opacity-70">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9L10,17Z"/>
                </svg>
                <span className="text-xs font-medium text-gray-700">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
                <span className="text-xs font-medium text-gray-700">Encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}