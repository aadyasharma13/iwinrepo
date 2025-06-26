'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function InstallPrompt({ onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Here you would typically save to your database
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You can add Firebase/database logic here
      console.log('Email submitted:', email);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWhatsApp = () => {
    // Replace with your actual WhatsApp group invite link
    const whatsappGroupLink = 'https://chat.whatsapp.com/Jt7hY5PNCQe5xLoq6UwLLB?mode=ac_t';
    window.open(whatsappGroupLink, '_blank');
    onClose();
  };

  if (isSubmitted) {
    return (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in duration-200 slide-in-from-bottom-4 relative">
          {/* Success State */}
          <div className="p-6 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Logo with checkmark overlay - Navbar style */}
            <div className="relative mx-auto mb-4 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="relative w-16 h-16 transition-transform duration-200">
                  <Image
                    src="/logo.png"
                    alt="I-Win Healthcare Community"
                    fill
                    className="rounded-xl object-contain"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                    I-Win
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">Healing Through Hope</span>
                </div>
              </div>
              {/* Success checkmark */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              You&apos;re on the waitlist! 🎉
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Thanks for joining! We&apos;ll notify you as soon as I-Win is ready. Want to stay even more connected?
            </p>

            <button 
              onClick={handleJoinWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-3 px-4 font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Join WhatsApp Community</span>
            </button>

            <button 
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors py-2 mt-3"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in duration-200 slide-in-from-bottom-4">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Brand Logo - Navbar style */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative w-15 h-15 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="I-Win Healthcare Community"
                fill
                className="rounded-xl object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                I-Win
              </span>
              <span className="text-xs text-gray-500 -mt-1">Healing Through Hope</span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Join the Waitlist
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Be the first to know when I-Win launches. Join thousands waiting for the future of healthcare community.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="p-6">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl py-3 px-4 font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Joining...</span>
                </span>
              ) : (
                'Join the Waitlist'
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              We&apos;ll only send you launch updates - no spam ever. 
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors py-2 mt-3"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}