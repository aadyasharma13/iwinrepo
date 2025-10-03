'use client';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthRouter({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (loading || isRedirecting.current) return;

    console.log('AuthRouter check:', {
      user: user ? {
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        profileCompleted: user.profileCompleted,
        role: user.role
      } : null,
      pathname
    });

    // Define public routes (no authentication required)
    const publicRoutes = ['/', '/auth', '/community'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Define admin-only routes
    const adminOnlyRoutes = ['/admin'];
    const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

    if (!user) {
      // No user - redirect to auth page unless already on public route
      if (!isPublicRoute) {
        console.log('No user, redirecting to auth');
        isRedirecting.current = true;
        router.push('/auth');
        setTimeout(() => { isRedirecting.current = false; }, 1000);
      }
      return;
    }

    // Check admin access
    if (isAdminRoute && user.role !== 'admin') {
      console.log('Non-admin trying to access admin route, redirecting to home');
      isRedirecting.current = true;
      router.push('/');
      setTimeout(() => { isRedirecting.current = false; }, 1000);
      return;
    }

    // Special handling for admins
    if (user.role === 'admin') {
      console.log('Admin user detected, allowing access to:', pathname);
      
      // If admin is on auth page, redirect to admin dashboard
      if (pathname === '/auth') {
        console.log('Admin on auth page, redirecting to admin dashboard');
        isRedirecting.current = true;
        router.push('/admin');
        setTimeout(() => { isRedirecting.current = false; }, 1000);
      }
      
      // Admins have full access, no further restrictions
      return;
    }

    // For non-admin users, continue with normal flow
    const targetPath = getUserTargetPath(user);
    console.log('User target path:', targetPath, 'Current path:', pathname);

    // If user is on auth page but logged in, redirect to target
    if (pathname === '/auth') {
      console.log('User on auth page, redirecting to:', targetPath);
      isRedirecting.current = true;
      router.push(targetPath);
      setTimeout(() => { isRedirecting.current = false; }, 1000);
      return;
    }

    // Check if user should be redirected (only for non-admins)
    const shouldRedirect = getShouldRedirect(user, pathname, targetPath);
    
    if (shouldRedirect) {
      console.log('Should redirect - User not on correct path, redirecting from', pathname, 'to', targetPath);
      isRedirecting.current = true;
      router.push(targetPath);
      setTimeout(() => { isRedirecting.current = false; }, 1000);
    }

  }, [user, loading, pathname, router]);

  // Determine if user should be redirected (not applicable to admins)
  const getShouldRedirect = (user, currentPath, targetPath) => {
    // Admins can go anywhere
    if (user.role === 'admin') return false;

    // Don't redirect if already on target path
    if (currentPath === targetPath) return false;

    // Allow access to public routes and community
    const allowedPublicRoutes = ['/', '/community', '/profile'];
    if (allowedPublicRoutes.includes(currentPath)) return false;

    // Special cases for verification flow
    if (!user.emailVerified) {
      // If email not verified, only allow verify-email page and public routes
      return currentPath !== '/auth/verify-email' && !allowedPublicRoutes.includes(currentPath);
    }

    if (!user.profileCompleted) {
      // If profile not completed, only allow profile setup page and public routes
      return currentPath !== '/profile/setup' && !allowedPublicRoutes.includes(currentPath);
    }

    // For completed profiles, allow access to most routes
    const restrictedRoutes = ['/auth', '/auth/verify-email', '/profile/setup'];
    return restrictedRoutes.includes(currentPath);
  };

  // Determine where user should be based on their completion status (not applicable to admins)
  const getUserTargetPath = (user) => {
    // Admins go to admin dashboard by default
    if (user.role === 'admin') {
      return '/admin';
    }

    // 1. Email not verified - must verify first
    if (!user.emailVerified) {
      return '/auth/verify-email';
    }

    // 2. Profile not completed - go to setup
    if (!user.profileCompleted) {
      return '/profile/setup';
    }

    // 3. Everything complete - go to profile
    return '/profile';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}