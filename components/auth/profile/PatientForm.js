'use client';
import { useState } from 'react';

export default function PatientForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    diagnosis: '',
    diagnosisDate: '',
    currentStage: '',
    treatments: [],
    hospital: '',
    doctorName: ''
  });

  const treatmentOptions = [
    'Chemotherapy',
    'Radiation Therapy',
    'Surgery',
    'Immunotherapy',
    'Physiotherapy',
    'Medication',
    'Lifestyle Changes',
    'Alternative Medicine',
    'Counseling/Therapy',
    'Other'
  ];

  const stageOptions = [
    'Recently Diagnosed',
    'In Treatment',
    'Between Treatments',
    'In Remission',
    'Cured/Recovered',
    'Managing Chronic Condition',
    'Palliative Care',
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

  const handleTreatmentChange = (treatment) => {
    setFormData({
      ...formData,
      treatments: formData.treatments.includes(treatment)
        ? formData.treatments.filter(t => t !== treatment)
        : [...formData.treatments, treatment]
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
        <p className="text-gray-600">Help us understand your healthcare journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Diagnosis */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Diagnosis / Condition *
          </label>
          <div className="relative">
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="e.g., Breast Cancer, Type 2 Diabetes, Anxiety"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 ml-1">You can enter multiple conditions separated by commas</p>
        </div>

        {/* Diagnosis Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Date of Diagnosis
          </label>
          <div className="relative">
            <input
              type="date"
              name="diagnosisDate"
              value={formData.diagnosisDate}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Current Stage */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Current Stage / Status *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stageOptions.map((stage) => (
              <label key={stage} className="flex items-start p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer group">
                <input
                  type="radio"
                  name="currentStage"
                  value={stage}
                  checked={formData.currentStage === stage}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-emerald-600 border-gray-300 focus:ring-emerald-500 focus:ring-2"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">{stage}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Treatments */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Current/Recent Treatments <span className="text-gray-400 font-normal">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {treatmentOptions.map((treatment) => (
              <label key={treatment} className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.treatments.includes(treatment)}
                  onChange={() => handleTreatmentChange(treatment)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">{treatment}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Hospital */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Hospital / Treatment Center <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="e.g., City General Hospital, Cancer Care Center"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Doctor Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Primary Doctor&apos;s Name <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Dr. Smith"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 ml-1">This information is kept private and helps with verification</p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
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