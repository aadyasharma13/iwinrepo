'use client';
import { useState } from 'react';

export default function CaregiverForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    relationship: '',
    careRecipientCondition: '',
    caregiverRoles: [],
    caregivingPeriod: {
      startDate: '',
      endDate: '',
      isOngoing: true
    }
  });

  const relationshipOptions = [
    'Spouse/Partner',
    'Parent',
    'Child',
    'Sibling',
    'Grandparent',
    'Grandchild',
    'Friend',
    'Professional Caregiver',
    'Other Family Member',
    'Other'
  ];

  const caregiverRoleOptions = [
    'Emotional Support',
    'Medical Assistance',
    'Daily Living Support',
    'Transportation',
    'Financial Support',
    'Advocacy',
    'Medication Management',
    'End-of-life Care',
    'Childcare Support',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      caregiverRoles: formData.caregiverRoles.includes(role)
        ? formData.caregiverRoles.filter(r => r !== role)
        : [...formData.caregiverRoles, role]
    });
  };

  const handlePeriodChange = (field, value) => {
    setFormData({
      ...formData,
      caregivingPeriod: {
        ...formData.caregivingPeriod,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Caregiver Information</h2>
        <p className="text-gray-600">Tell us about your caregiving experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Relationship */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Your Relationship to Care Recipient *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relationshipOptions.map((relationship) => (
              <label key={relationship} className="flex items-start p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group">
                <input
                  type="radio"
                  name="relationship"
                  value={relationship}
                  checked={formData.relationship === relationship}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{relationship}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Care Recipient Condition */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Care Recipient&apos;s Condition/Diagnosis *
          </label>
          <div className="relative">
            <input
              type="text"
              name="careRecipientCondition"
              value={formData.careRecipientCondition}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="e.g., Alzheimer's, Cancer, Stroke Recovery"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Caregiver Roles */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Your Caregiving Roles <span className="text-gray-400 font-normal">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {caregiverRoleOptions.map((role) => (
              <label key={role} className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.caregiverRoles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{role}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Caregiving Period */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Caregiving Period
          </label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.caregivingPeriod.startDate}
                  onChange={(e) => handlePeriodChange('startDate', e.target.value)}
                  className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <label className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.caregivingPeriod.isOngoing}
                onChange={(e) => handlePeriodChange('isOngoing', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-blue-900">Currently ongoing</span>
                <p className="text-xs text-blue-700 mt-1">Check this if you&apos;re still actively caregiving</p>
              </div>
            </label>

            {!formData.caregivingPeriod.isOngoing && (
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.caregivingPeriod.endDate}
                    onChange={(e) => handlePeriodChange('endDate', e.target.value)}
                    className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
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
}