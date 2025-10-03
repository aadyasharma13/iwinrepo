'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { collection, query, where, getDocs, doc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalCaregivers: 0,
    totalMedicalProfessionals: 0,
    verifiedProfessionals: 0,
    pendingVerifications: 0,
    rejectedVerifications: 0,
    recentRegistrations: 0
  });
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user === null) return; // Still loading
    
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStatistics(),
        fetchPendingVerifications(),
        fetchRecentUsers()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const usersRef = collection(db, 'users');
      
      // Get all users
      const allUsersSnapshot = await getDocs(usersRef);
      const allUsers = allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Calculate statistics
      const stats = {
        totalUsers: allUsers.length,
        totalPatients: allUsers.filter(u => u.role === 'patient').length,
        totalCaregivers: allUsers.filter(u => u.role === 'caregiver').length,
        totalMedicalProfessionals: allUsers.filter(u => u.role === 'medical_professional').length,
        verifiedProfessionals: allUsers.filter(u => u.role === 'medical_professional' && u.medicalVerification?.status === 'verified').length,
        pendingVerifications: allUsers.filter(u => u.role === 'medical_professional' && u.medicalVerification?.status === 'pending').length,
        rejectedVerifications: allUsers.filter(u => u.role === 'medical_professional' && u.medicalVerification?.status === 'rejected').length,
        recentRegistrations: allUsers.filter(u => {
          const createdAt = new Date(u.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdAt >= weekAgo;
        }).length
      };
      
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('role', '==', 'medical_professional'),
        where('medicalVerification.status', '==', 'pending')
      );
      
      const snapshot = await getDocs(q);
      const pending = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPendingVerifications(pending);
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit(10));
      
      const snapshot = await getDocs(q);
      const recent = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecentUsers(recent);
    } catch (error) {
      console.error('Error fetching recent users:', error);
    }
  };

  const handleVerificationAction = async (userId, action, rejectionReason = '') => {
    setIsProcessing(true);
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        'medicalVerification.status': action,
        'medicalVerification.processedAt': new Date().toISOString(),
        'medicalVerification.processedBy': user.uid
      };

      if (action === 'rejected' && rejectionReason) {
        updateData['medicalVerification.rejectionReason'] = rejectionReason;
      }

      await updateDoc(userRef, updateData);
      
      // Refresh data
      await fetchData();
      
      // Show success message
      alert(`Medical professional ${action === 'verified' ? 'verified' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Error processing verification. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const VerificationCard = ({ verification, onApprove, onReject }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleReject = () => {
      if (!rejectionReason.trim()) {
        alert('Please provide a rejection reason');
        return;
      }
      onReject(verification.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
    };

    return (
      <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {verification.photoURL ? (
                <img
                  src={verification.photoURL}
                  alt={verification.displayName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {verification.displayName?.charAt(0) || verification.email?.charAt(0)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {verification.displayName || 'No Name'}
                </h3>
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Email:</span> {verification.email}</p>
                <p><span className="font-medium">Specialization:</span> {verification.roleSpecificData?.specialization || 'Not specified'}</p>
                <p><span className="font-medium">Experience:</span> {verification.roleSpecificData?.yearsOfExperience || 'Not specified'}</p>
                <p><span className="font-medium">Institution:</span> {verification.roleSpecificData?.primaryInstitution || 'Not specified'}</p>
                <p><span className="font-medium">License:</span> {verification.roleSpecificData?.licenseNumber || 'Not specified'}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(verification.medicalVerification?.submittedAt).toLocaleDateString()}</p>
              </div>

              {/* Documents */}
              {verification.roleSpecificData?.documents && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(verification.roleSpecificData.documents).map(([key, url]) => url && (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onApprove(verification.id)}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting this medical professional&apos;s verification:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users and verify medical professionals</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex space-x-8 px-6 py-4 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('verifications')}
                className={`py-2 text-sm font-medium border-b-2 transition-colors relative ${
                  activeTab === 'verifications'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Medical Verifications
                {pendingVerifications.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingVerifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={statistics.totalUsers}
                  subtitle="All registered users"
                  icon={
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  }
                  color="bg-blue-100"
                />
                
                <StatCard
                  title="Patients"
                  value={statistics.totalPatients}
                  subtitle="Active patients"
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  color="bg-green-100"
                />
                
                <StatCard
                  title="Caregivers"
                  value={statistics.totalCaregivers}
                  subtitle="Active caregivers"
                  icon={
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                  color="bg-orange-100"
                />
                
                <StatCard
                  title="Medical Professionals"
                  value={statistics.totalMedicalProfessionals}
                  subtitle={`${statistics.verifiedProfessionals} verified`}
                  icon={
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  color="bg-purple-100"
                />
              </div>

              {/* Verification Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Pending Verifications"
                  value={statistics.pendingVerifications}
                  subtitle="Awaiting review"
                  icon={
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="bg-amber-100"
                />
                
                <StatCard
                  title="Verified Professionals"
                  value={statistics.verifiedProfessionals}
                  subtitle="Successfully verified"
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="bg-green-100"
                />
                
                <StatCard
                  title="Recent Registrations"
                  value={statistics.recentRegistrations}
                  subtitle="Last 7 days"
                  icon={
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  }
                  color="bg-blue-100"
                />
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                  <p className="text-sm text-gray-600">Latest user registrations</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            {user.displayName?.charAt(0) || user.email?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.displayName || 'No Name'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                          {user.role?.replace('_', ' ') || 'Member'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Medical Professional Verifications</h2>
                  <p className="text-gray-600 mt-1">
                    {pendingVerifications.length} pending verification{pendingVerifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              {pendingVerifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-600">No pending medical professional verifications at the moment.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingVerifications.map((verification) => (
                    <VerificationCard
                      key={verification.id}
                      verification={verification}
                      onApprove={(id) => handleVerificationAction(id, 'verified')}
                      onReject={(id, reason) => handleVerificationAction(id, 'rejected', reason)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}