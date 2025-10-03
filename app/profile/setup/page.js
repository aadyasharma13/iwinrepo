'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Country, State, City } from 'country-state-city';
import RoleSelector from '@/components/auth/RoleSelector';
import PatientForm from '@/components/auth/profile/PatientForm';
import CaregiverForm from '@/components/auth/profile/CaregiverForm';
import MedicalProfessionalForm from '@/components/auth/profile/MedicalProfessionalForm';

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Role Selection, 3: Role-specific Form
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    displayName: '',
    bio: '',
    country: '',
    state: '',
    city: ''
  });

  const { user, updateUserProfile } = useAuth();
  const router = useRouter();

  // Get location data
  const countries = Country.getAllCountries();
  const states = basicInfo.country ? State.getStatesOfCountry(basicInfo.country) : [];
  const cities = basicInfo.state ? City.getCitiesOfState(basicInfo.country, basicInfo.state) : [];

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!user.emailVerified) {
      router.push('/auth/verify-email');
      return;
    }

    if (user.profileCompleted) {
      router.push('/profile');
      return;
    }

    // Pre-fill basic info if available
    setBasicInfo({
      displayName: user.displayName || '',
      bio: user.bio || '',
      country: user.country || '',
      state: user.state || '',
      city: user.city || ''
    });
  }, [user, router]);

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const displayName = formData.get('displayName')?.trim();
    const bio = formData.get('bio')?.trim();
    const country = formData.get('country')?.trim();
    const state = formData.get('state')?.trim();
    const city = formData.get('city')?.trim();

    if (!displayName) {
      setError('Please enter your name');
      return;
    }

    if (!country || !state || !city) {
      setError('Please select your complete location (country, state, and city)');
      return;
    }

    setBasicInfo({ displayName, bio, country, state, city });
    setCurrentStep(2);
  };

  const handleLocationChange = (field, value) => {
    setBasicInfo(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'country') {
        updated.state = '';
        updated.city = '';
      } else if (field === 'state') {
        updated.city = '';
      }
      
      return updated;
    });
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setCurrentStep(3);
  };

  const handleRoleFormSubmit = async (roleSpecificData) => {
    setIsLoading(true);
    setError('');

    try {
      // Get country and state names for storage
      const countryName = countries.find(c => c.isoCode === basicInfo.country)?.name || basicInfo.country;
      const stateName = states.find(s => s.isoCode === basicInfo.state)?.name || basicInfo.state;

      // Prepare profile data based on role
      const profileData = {
        ...basicInfo,
        location: `${basicInfo.city}, ${stateName}, ${countryName}`, // Keep for backward compatibility
        country: basicInfo.country,
        state: basicInfo.state,
        city: basicInfo.city,
        countryName,
        stateName,
        role: selectedRole,
        roleSpecificData,
        profileCompleted: true, // Set to true for all roles
        updatedAt: new Date().toISOString()
      };

      // For medical professionals, add verification fields but still mark profile as completed
      if (selectedRole === 'medical_professional') {
        profileData.medicalVerification = {
          status: 'pending', // pending, verified, rejected
          submittedAt: new Date().toISOString(),
          verifiedAt: null,
          verifiedBy: null,
          rejectionReason: null
        };
        // Profile is still completed, they just don't get the verified badge until admin approval
      }

      const result = await updateUserProfile(profileData);

      if (result.success) {
        // AuthRouter will handle the redirect to /profile
        console.log('Profile setup completed successfully');
        
        // Show success message for medical professionals
        if (selectedRole === 'medical_professional') {
          // The success will be handled by the redirect to profile page
          // where they'll see their verification status
        }
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err) {
      console.error('Profile setup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBasicInfoStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Let&apos;s start with some basic information about you</p>
      </div>

      <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="displayName"
              required
              defaultValue={basicInfo.displayName}
              className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Enter your full name"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500">This is how other community members will see you</p>
        </div>

        {/* Location Section */}
        <div className="space-y-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location Information *
          </h3>
          
          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Country *
            </label>
            <select
              name="country"
              value={basicInfo.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              required
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900"
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              State/Province *
            </label>
            <select
              name="state"
              value={basicInfo.state}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              required
              disabled={!basicInfo.country}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select your state</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              City *
            </label>
            <select
              name="city"
              value={basicInfo.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              required
              disabled={!basicInfo.state}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-500 bg-white p-3 rounded-xl border border-emerald-200">
            <svg className="w-4 h-4 text-emerald-600 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your location helps us connect you with local healthcare resources and community members in your area.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Bio <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <textarea
              name="bio"
              rows="4"
              defaultValue={basicInfo.bio}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
              placeholder="Tell us a bit about yourself and your healthcare journey..."
            />
          </div>
          <p className="text-xs text-gray-500">This will be shown on your profile (max 500 characters)</p>
        </div>

        <button
          type="submit"
          disabled={!basicInfo.country || !basicInfo.state || !basicInfo.city}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>Continue</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );

  const renderRoleSpecificForm = () => {
    // Pass basic info including location to role-specific forms
    const formProps = {
      onSubmit: handleRoleFormSubmit,
      basicInfo: basicInfo // Pass location data to forms
    };

    switch (selectedRole) {
      case 'patient':
        return <PatientForm {...formProps} />;
      case 'caregiver':
        return <CaregiverForm {...formProps} />;
      case 'medical_professional':
        return <MedicalProfessionalForm {...formProps} />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-sm font-medium hidden sm:block">Basic Info</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:block">Choose Role</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="text-sm font-medium hidden sm:block">Details</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 font-medium">
                  {selectedRole === 'medical_professional' ? 'Submitting for verification...' : 'Saving your profile...'}
                </p>
                {selectedRole === 'medical_professional' && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Your documents will be reviewed by our admin team
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step Content */}
          {currentStep === 1 && renderBasicInfoStep()}
          {currentStep === 2 && <RoleSelector onRoleSelect={handleRoleSelect} />}
          {currentStep === 3 && renderRoleSpecificForm()}

          {/* Back Button */}
          {currentStep > 1 && !isLoading && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Go Back</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}