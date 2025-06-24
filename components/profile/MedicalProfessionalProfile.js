'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function MedicalProfessionalProfile({ userData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialization: userData.roleSpecificData?.specialization || '',
    yearsOfExperience: userData.roleSpecificData?.yearsOfExperience || '',
    primaryInstitution: userData.roleSpecificData?.primaryInstitution || '',
    licenseNumber: userData.roleSpecificData?.licenseNumber || '',
    workLocations: userData.roleSpecificData?.workLocations || [],
    degree: userData.roleSpecificData?.degree || '',
    graduationYear: userData.roleSpecificData?.graduationYear || '',
    additionalCertifications: userData.roleSpecificData?.additionalCertifications || []
  });
  const [isSaving, setIsSaving] = useState(false);

  const specializationOptions = [
    'General Medicine', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Dermatology', 'Radiology', 'Anesthesiology',
    'Emergency Medicine', 'Internal Medicine', 'Surgery', 'Obstetrics & Gynecology',
    'Ophthalmology', 'ENT (Otolaryngology)', 'Urology', 'Gastroenterology',
    'Endocrinology', 'Pulmonology', 'Nephrology', 'Rheumatology',
    'Infectious Diseases', 'Pathology', 'Physical Medicine & Rehabilitation',
    'Nursing', 'Pharmacy', 'Physiotherapy', 'Psychology/Counseling',
    'Nutrition/Dietetics', 'Medical Research', 'Healthcare Administration', 'Other'
  ];

  const degreeOptions = [
    'MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'BAMS', 'BHMS', 'BDS', 'MDS',
    'BPT', 'MPT', 'B.Sc Nursing', 'M.Sc Nursing', 'B.Pharm', 'M.Pharm',
    'PharmD', 'Ph.D', 'Other'
  ];

  const workLocationOptions = [
    'Hospital', 'Clinic', 'Private Practice', 'Research Institute',
    'Medical College', 'Home Care', 'Telemedicine', 'Other'
  ];

  const certificationOptions = [
    'Fellowship', 'Board Certification', 'Specialty Training', 'Research Publications',
    'Teaching Experience', 'International Training', 'Awards/Recognition', 'Other'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        roleSpecificData: formData
      };
      
      const success = await onUpdate(updatedData);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      specialization: userData.roleSpecificData?.specialization || '',
      yearsOfExperience: userData.roleSpecificData?.yearsOfExperience || '',
      primaryInstitution: userData.roleSpecificData?.primaryInstitution || '',
      licenseNumber: userData.roleSpecificData?.licenseNumber || '',
      workLocations: userData.roleSpecificData?.workLocations || [],
      degree: userData.roleSpecificData?.degree || '',
      graduationYear: userData.roleSpecificData?.graduationYear || '',
      additionalCertifications: userData.roleSpecificData?.additionalCertifications || []
    });
    setIsEditing(false);
  };

  const handleLocationChange = (location) => {
    setFormData({
      ...formData,
      workLocations: formData.workLocations.includes(location)
        ? formData.workLocations.filter(l => l !== location)
        : [...formData.workLocations, location]
    });
  };

  const handleCertificationChange = (certification) => {
    setFormData({
      ...formData,
      additionalCertifications: formData.additionalCertifications.includes(certification)
        ? formData.additionalCertifications.filter(c => c !== certification)
        : [...formData.additionalCertifications, certification]
    });
  };

  const getVerificationStatus = () => {
    const status = userData.medicalVerification?.status || 'pending';
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: '⏳',
        text: 'Under Review'
      },
      verified: {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: '✅',
        text: 'Verified'
      },
      rejected: {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: '❌',
        text: 'Verification Failed'
      }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Medical Professional Profile</h2>
              <p className="text-gray-600 text-sm">Professional credentials and verification</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Verification Badge */}
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${verificationStatus.color}`}>
              <span className="mr-1">{verificationStatus.icon}</span>
              {verificationStatus.text}
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Verification Status Info */}
        {userData.medicalVerification?.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Verification In Progress</p>
                <p>Your documents are being reviewed by our admin team. You&apos;ll receive an email once verification is complete.</p>
                {userData.medicalVerification?.submittedAt && (
                  <p className="text-xs mt-2">
                    Submitted: {new Date(userData.medicalVerification.submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {userData.medicalVerification?.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Verification Failed</p>
                <p>Your verification was unsuccessful. Please contact support for more information.</p>
                {userData.medicalVerification?.rejectionReason && (
                  <p className="mt-2"><strong>Reason:</strong> {userData.medicalVerification.rejectionReason}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-8">
            {/* Basic Professional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                >
                  <option value="" className="text-gray-500">Select specialization</option>
                  {specializationOptions.map((spec) => (
                    <option key={spec} value={spec} className="text-gray-700">{spec}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Primary Degree</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                >
                  <option value="" className="text-gray-500">Select degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree} className="text-gray-700">{degree}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Years of Experience</label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                >
                  <option value="" className="text-gray-500">Select experience range</option>
                  <option value="0-2" className="text-gray-700">0-2 years</option>
                  <option value="3-5" className="text-gray-700">3-5 years</option>
                  <option value="6-10" className="text-gray-700">6-10 years</option>
                  <option value="11-15" className="text-gray-700">11-15 years</option>
                  <option value="16-20" className="text-gray-700">16-20 years</option>
                  <option value="21+" className="text-gray-700">21+ years</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Graduation Year</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-700"
                  placeholder="YYYY"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Primary Institution</label>
              <input
                type="text"
                value={formData.primaryInstitution}
                onChange={(e) => setFormData({ ...formData, primaryInstitution: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-700"
                placeholder="Hospital/Clinic name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-700"
                placeholder="Medical license/registration number"
              />
              <p className="text-xs text-gray-500">Note: License information cannot be changed after verification</p>
            </div>

            {/* Work Locations */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Work Locations</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {workLocationOptions.map((location) => (
                  <label key={location} className="relative">
                    <input
                      type="checkbox"
                      checked={formData.workLocations.includes(location)}
                      onChange={() => handleLocationChange(location)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.workLocations.includes(location)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{location}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Selected Locations */}
              {formData.workLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.workLocations.map((location, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-sm">
                      <span>{location}</span>
                      <button
                        type="button"
                        onClick={() => handleLocationChange(location)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Certifications */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Additional Certifications</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificationOptions.map((cert) => (
                  <label key={cert} className="relative">
                    <input
                      type="checkbox"
                      checked={formData.additionalCertifications.includes(cert)}
                      onChange={() => handleCertificationChange(cert)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.additionalCertifications.includes(cert)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Selected Certifications */}
              {formData.additionalCertifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.additionalCertifications.map((cert, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm">
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => handleCertificationChange(cert)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* View Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-purple-700 mb-1">Specialization</label>
                  <p className="text-purple-900 font-medium">{formData.specialization || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Degree</label>
                  <p className="text-gray-900">{formData.degree || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-900">{formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : 'Not specified'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Institution</label>
                  <p className="text-gray-900">{formData.primaryInstitution || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Graduation Year</label>
                  <p className="text-gray-900">{formData.graduationYear || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">License Number</label>
                  <p className="text-gray-900 font-mono text-sm">
                    {formData.licenseNumber ? `****${formData.licenseNumber.slice(-4)}` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Work Locations */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Work Locations</label>
              {formData.workLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.workLocations.map((location, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                      {location}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No work locations specified</p>
              )}
            </div>

            {/* Additional Certifications */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Certifications</label>
              {formData.additionalCertifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.additionalCertifications.map((cert, index) => (
                    <span key={index} className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No additional certifications specified</p>
              )}
            </div>

            {/* Documents Section - View Only */}
            {userData.roleSpecificData?.documents && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Verification Documents</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(userData.roleSpecificData.documents).map(([key, url]) => url && (
                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.workLocations.length}
                </div>
                <div className="text-sm text-gray-600">Work Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.yearsOfExperience || '—'}
                </div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.additionalCertifications.length}
                </div>
                <div className="text-sm text-gray-600">Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {verificationStatus.icon}
                </div>
                <div className="text-sm text-gray-600">Verification</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}