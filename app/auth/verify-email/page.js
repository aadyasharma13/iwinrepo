'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');
  const { user, sendEmailVerification, checkEmailVerification } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // If already verified, redirect immediately
    if (user.emailVerified && !hasRedirected.current) {
      console.log('Email already verified, redirecting to profile setup');
      hasRedirected.current = true;
      router.push('/profile/setup');
      return;
    }

    // Auto-check every 3 seconds
    const interval = setInterval(async () => {
      if (!isChecking && !hasRedirected.current) {
        console.log('Auto-checking email verification...');
        setIsChecking(true);
        const verified = await checkEmailVerification();
        setIsChecking(false);
        
        console.log('Email verification check result:', verified);
        
        if (verified && !hasRedirected.current) {
          clearInterval(interval);
          hasRedirected.current = true;
          setMessage('Email verified! Redirecting to profile setup...');
          
          // Small delay to show the success message, then redirect
          setTimeout(() => {
            router.push('/profile/setup');
          }, 1500);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, router, checkEmailVerification, isChecking]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage('');

    const result = await sendEmailVerification();
    
    if (result.success) {
      setMessage('Verification email sent! Please check your inbox.');
    } else {
      setMessage('Failed to send email. Please try again.');
    }
    
    setIsResending(false);
  };

  const handleCheckNow = async () => {
    if (hasRedirected.current) return;
    
    setIsChecking(true);
    setMessage('');

    console.log('Manual email verification check...');
    const verified = await checkEmailVerification();
    
    console.log('Manual verification check result:', verified);
    
    if (verified && !hasRedirected.current) {
      hasRedirected.current = true;
      setMessage('Email verified! Redirecting to profile setup...');
      setTimeout(() => {
        router.push('/profile/setup');
      }, 1500);
    } else if (!verified) {
      setMessage('Email not verified yet. Please check your inbox and click the verification link.');
    }
    
    setIsChecking(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already verified, show loading while redirecting
  if (user.emailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Email verified! Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h1>
        
        <p className="text-gray-600 mb-2">
          We&apos;ve sent a verification link to:
        </p>
        <p className="text-emerald-600 font-semibold mb-6">{user.email}</p>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Steps to verify:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here - we&apos;ll detect it automatically</li>
            </ol>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isResending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Resend Email'
              )}
            </button>

            <button
              onClick={handleCheckNow}
              disabled={isChecking}
              className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isChecking ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                'I Verified - Check Now'
              )}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              message.includes('sent') || message.includes('verified') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Auto-check indicator */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Auto-checking every 3 seconds...</span>
          </div>
        </div>
      </div>
    </div>
  );
}