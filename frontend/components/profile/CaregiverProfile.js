'use client';
import { useState } from 'react';

export default function CaregiverProfile({ userData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    relationship: userData.roleSpecificData?.relationship || '',
    careRecipientCondition: userData.roleSpecificData?.careRecipientCondition || '',
    caregiverRoles: userData.roleSpecificData?.caregiverRoles || [],
    caregivingPeriod: userData.roleSpecificData?.caregivingPeriod || {
      startDate: '',
      endDate: '',
      isOngoing: true
    },
    caregivingChallenges: userData.roleSpecificData?.caregivingChallenges || [],
    supportNeeded: userData.roleSpecificData?.supportNeeded || [],
    caregivingLocation: userData.roleSpecificData?.caregivingLocation || '',
    hoursPerWeek: userData.roleSpecificData?.hoursPerWeek || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [customRelationship, setCustomRelationship] = useState('');
  const [customRole, setCustomRole] = useState('');

  const relationshipOptions = [
    'Spouse/Partner', 'Parent', 'Child', 'Sibling', 'Grandparent',
    'Grandchild', 'Friend', 'Professional Caregiver', 'Other Family Member', 'Other'
  ];

  const caregiverRoleOptions = [
    'Emotional Support', 'Medical Assistance', 'Daily Living Support', 'Transportation',
    'Financial Support', 'Advocacy', 'Medication Management', 'End-of-life Care',
    'Childcare Support', 'Household Management', 'Communication Coordination', 'Other'
  ];

  // Same extensive condition list as CaregiverForm
  const conditionOptions = [
    // Cancer Types
    'Breast Cancer', 'Lung Cancer', 'Prostate Cancer', 'Colorectal Cancer', 'Skin Cancer (Melanoma)', 
    'Liver Cancer', 'Pancreatic Cancer', 'Kidney Cancer', 'Bladder Cancer', 'Brain Cancer',
    'Ovarian Cancer', 'Cervical Cancer', 'Endometrial Cancer', 'Stomach Cancer', 'Esophageal Cancer',
    'Thyroid Cancer', 'Blood Cancer (Leukemia)', 'Lymphoma', 'Multiple Myeloma', 'Bone Cancer',
    
    // Neurological & Age-related (common in caregiving)
    'Alzheimer\'s Disease', 'Dementia', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Stroke',
    'Traumatic Brain Injury', 'Spinal Cord Injury', 'Cerebral Palsy', 'Epilepsy',
    'Huntington\'s Disease', 'ALS (Lou Gehrig\'s Disease)', 'Migraine', 'Neuropathy',
    
    // Chronic Conditions
    'Type 1 Diabetes', 'Type 2 Diabetes', 'Heart Disease', 'COPD', 'Chronic Kidney Disease',
    'Liver Disease', 'Arthritis', 'Fibromyalgia', 'Chronic Pain', 'Lupus',
    'High Blood Pressure', 'Heart Failure', 'Asthma', 'Osteoporosis',
    
    // Mental Health (common in caregiving)
    'Depression', 'Anxiety', 'Bipolar Disorder', 'Schizophrenia', 'PTSD', 'Autism Spectrum Disorder',
    'ADHD', 'Eating Disorders', 'Substance Abuse', 'Dementia-related Behavioral Issues',
    'OCD', 'Panic Disorder', 'Social Anxiety',
    
    // Physical Disabilities
    'Mobility Impairment', 'Vision Loss/Blindness', 'Hearing Loss/Deafness', 'Amputation',
    'Muscular Dystrophy', 'Paralysis', 'Chronic Fatigue Syndrome', 'Fractures',
    'Joint Replacement Recovery', 'Back Pain', 'Spinal Disorders',
    
    // Age-related Conditions (common in elderly care)
    'Frailty', 'Falls Risk', 'Incontinence', 'Age-related Cognitive Decline',
    'Macular Degeneration', 'Cataracts', 'Hearing Loss', 'Balance Disorders',
    
    // Developmental Disabilities
    'Down Syndrome', 'Intellectual Disability', 'Developmental Delays', 'Cerebral Palsy',
    'Autism', 'Learning Disabilities', 'Fetal Alcohol Syndrome',
    
    // Terminal/End-of-life Conditions
    'Terminal Cancer', 'End-stage Organ Disease', 'Hospice Care', 'Palliative Care',
    'Advanced Dementia', 'End-stage COPD', 'End-stage Heart Disease',
    
    // Recovery/Rehabilitation
    'Post-surgery Recovery', 'Accident Recovery', 'Stroke Recovery', 'Heart Attack Recovery',
    'Rehabilitation', 'Physical Therapy', 'Occupational Therapy',
    
    // Child-specific (pediatric caregiving)
    'Pediatric Cancer', 'Birth Defects', 'Childhood Disabilities', 'Special Needs',
    'Premature Birth Complications', 'Genetic Disorders', 'Cystic Fibrosis',
    
    // Autoimmune & Chronic Conditions
    'Rheumatoid Arthritis', 'Crohn\'s Disease', 'Ulcerative Colitis', 'Celiac Disease',
    'Psoriasis', 'Sjogren\'s Syndrome', 'Scleroderma', 'Thyroid Disease',
    
    // Cardiovascular
    'Heart Attack', 'Stroke', 'Arrhythmia', 'Coronary Artery Disease', 'Heart Valve Disease',
    'Cardiomyopathy', 'Peripheral Artery Disease', 'Deep Vein Thrombosis',
    
    // Respiratory
    'Pulmonary Fibrosis', 'Sleep Apnea', 'Pneumonia', 'Tuberculosis', 'Bronchitis',
    'Emphysema', 'Lung Disease',
    
    // Kidney & Urological
    'Kidney Stones', 'Dialysis', 'Kidney Transplant', 'Bladder Disorders',
    'Prostate Problems', 'Urinary Tract Infections',
    
    // Gastrointestinal
    'IBS (Irritable Bowel Syndrome)', 'GERD', 'Peptic Ulcer', 'Gallbladder Disease',
    'Hepatitis', 'Cirrhosis', 'Pancreatitis', 'Diverticulitis',
    
    // Blood Disorders
    'Anemia', 'Hemophilia', 'Sickle Cell Disease', 'Thalassemia', 'Blood Clotting Disorders',
    
    // Infectious Diseases
    'HIV/AIDS', 'Hepatitis B', 'Hepatitis C', 'COVID-19', 'Malaria', 'Dengue',
    
    // Women's Health
    'Endometriosis', 'Fibroids', 'Pregnancy Complications', 'Menopause', 'Infertility',
    'Breast Disease', 'PCOS',
    
    // Men's Health
    'Erectile Dysfunction', 'Low Testosterone', 'Benign Prostatic Hyperplasia',
    
    // Eye & Skin Conditions
    'Glaucoma', 'Diabetic Retinopathy', 'Eczema', 'Dermatitis', 'Skin Allergies',
    
    // Other
    'Multiple Conditions', 'Rare Disease', 'Temporary Disability', 'Obesity',
    'Malnutrition', 'Addiction Recovery', 'Other'
  ];

  const challengeOptions = [
    'Physical Exhaustion', 'Emotional Stress', 'Financial Strain', 'Time Management',
    'Lack of Support', 'Medical Complexity', 'Behavioral Issues', 'Sleep Deprivation',
    'Social Isolation', 'Work-Life Balance', 'Other'
  ];

  const supportOptions = [
    'Respite Care', 'Support Groups', 'Professional Training', 'Financial Assistance',
    'Medical Guidance', 'Emotional Counseling', 'Equipment/Supplies', 'Transportation Help',
    'Advocacy Services', 'Educational Resources', 'Other'
  ];

  const locationOptions = [
    'Care Recipient\'s Home', 'My Home', 'Assisted Living Facility', 'Nursing Home',
    'Multiple Locations', 'Hospital/Medical Facility', 'Other'
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
        setCustomRelationship('');
        setCustomRole('');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      relationship: userData.roleSpecificData?.relationship || '',
      careRecipientCondition: userData.roleSpecificData?.careRecipientCondition || '',
      caregiverRoles: userData.roleSpecificData?.caregiverRoles || [],
      caregivingPeriod: userData.roleSpecificData?.caregivingPeriod || {
        startDate: '',
        endDate: '',
        isOngoing: true
      },
      caregivingChallenges: userData.roleSpecificData?.caregivingChallenges || [],
      supportNeeded: userData.roleSpecificData?.supportNeeded || [],
      caregivingLocation: userData.roleSpecificData?.caregivingLocation || '',
      hoursPerWeek: userData.roleSpecificData?.hoursPerWeek || ''
    });
    setIsEditing(false);
    setCustomRelationship('');
    setCustomRole('');
  };

  const handleRoleChange = (role) => {
    if (role === 'Other') return; // Handle via custom input
    setFormData({
      ...formData,
      caregiverRoles: formData.caregiverRoles.includes(role)
        ? formData.caregiverRoles.filter(r => r !== role)
        : [...formData.caregiverRoles, role]
    });
  };

  const handleChallengeChange = (challenge) => {
    if (challenge === 'Other') return; // Handle via custom input
    setFormData({
      ...formData,
      caregivingChallenges: formData.caregivingChallenges.includes(challenge)
        ? formData.caregivingChallenges.filter(c => c !== challenge)
        : [...formData.caregivingChallenges, challenge]
    });
  };

  const handleSupportChange = (support) => {
    if (support === 'Other') return; // Handle via custom input
    setFormData({
      ...formData,
      supportNeeded: formData.supportNeeded.includes(support)
        ? formData.supportNeeded.filter(s => s !== support)
        : [...formData.supportNeeded, support]
    });
  };

  const handleRelationshipChange = (relationship) => {
    if (relationship === 'Other') return; // Handle via custom input
    setFormData({ ...formData, relationship });
  };

  const addCustomRelationship = () => {
    if (customRelationship.trim()) {
      setFormData({ ...formData, relationship: customRelationship.trim() });
      setCustomRelationship('');
    }
  };

  const addCustomRole = () => {
    if (customRole.trim() && !formData.caregiverRoles.includes(customRole.trim())) {
      setFormData({
        ...formData,
        caregiverRoles: [...formData.caregiverRoles, customRole.trim()]
      });
      setCustomRole('');
    }
  };

  const removeRole = (role) => {
    setFormData({
      ...formData,
      caregiverRoles: formData.caregiverRoles.filter(r => r !== role)
    });
  };

  const removeChallenge = (challenge) => {
    setFormData({
      ...formData,
      caregivingChallenges: formData.caregivingChallenges.filter(c => c !== challenge)
    });
  };

  const removeSupport = (support) => {
    setFormData({
      ...formData,
      supportNeeded: formData.supportNeeded.filter(s => s !== support)
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateCaregivingDuration = () => {
    const startDate = formData.caregivingPeriod.startDate;
    if (!startDate) return 'Duration not specified';

    const start = new Date(startDate);
    const end = formData.caregivingPeriod.isOngoing ? new Date() : new Date(formData.caregivingPeriod.endDate);
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Caregiver Information</h2>
              <p className="text-gray-600 text-sm">Your caregiving journey and support needs</p>
            </div>
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

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-8">
            {/* Relationship */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Your Relationship to Care Recipient
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relationshipOptions.filter(rel => rel !== 'Other').map((relationship) => (
                  <label key={relationship} className="relative">
                    <input
                      type="radio"
                      name="relationship"
                      value={relationship}
                      checked={formData.relationship === relationship}
                      onChange={(e) => handleRelationshipChange(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.relationship === relationship
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{relationship}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Custom Relationship Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customRelationship}
                  onChange={(e) => setCustomRelationship(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomRelationship();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Enter custom relationship..."
                />
                <button
                  type="button"
                  onClick={addCustomRelationship}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Set Custom
                </button>
              </div>
            </div>

            {/* Care Recipient Condition - Now a dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Care Recipient&apos;s Condition/Diagnosis *
              </label>
              <select
                value={formData.careRecipientCondition}
                onChange={(e) => setFormData({ ...formData, careRecipientCondition: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Select care recipient&apos;s condition</option>
                {conditionOptions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 ml-1">Select the primary condition you&apos;re providing care for</p>
            </div>

            {/* Caregiving Location & Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Primary Caregiving Location</label>
                <select
                  value={formData.caregivingLocation}
                  onChange={(e) => setFormData({ ...formData, caregivingLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                  <option value="" className="text-gray-500">Select location</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location} className="text-gray-700">{location}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Hours Per Week</label>
                <input
                  type="number"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="e.g., 40"
                  min="0"
                />
              </div>
            </div>

            {/* Caregiver Roles */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Your Caregiving Roles
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {caregiverRoleOptions.filter(role => role !== 'Other').map((role) => (
                  <label key={role} className="relative">
                    <input
                      type="checkbox"
                      checked={formData.caregiverRoles.includes(role)}
                      onChange={() => handleRoleChange(role)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.caregiverRoles.includes(role)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{role}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Custom Role Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomRole();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Enter custom role..."
                />
                <button
                  type="button"
                  onClick={addCustomRole}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Add Role
                </button>
              </div>

              {/* Current Roles */}
              {formData.caregiverRoles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.caregiverRoles.map((role, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm">
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => removeRole(role)}
                        className="text-blue-500 hover:text-blue-700"
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

            {/* Caregiving Period */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Caregiving Period
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.caregivingPeriod.startDate}
                    onChange={(e) => handlePeriodChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  />
                </div>

                {!formData.caregivingPeriod.isOngoing && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.caregivingPeriod.endDate}
                      onChange={(e) => handlePeriodChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.caregivingPeriod.isOngoing}
                  onChange={(e) => handlePeriodChange('isOngoing', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-semibold text-blue-900">Currently ongoing</span>
                  <p className="text-xs text-blue-700 mt-1">Check this if you&apos;re still actively caregiving</p>
                </div>
              </label>
            </div>

            {/* Caregiving Challenges */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Current Caregiving Challenges
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {challengeOptions.filter(challenge => challenge !== 'Other').map((challenge) => (
                  <label key={challenge} className="relative">
                    <input
                      type="checkbox"
                      checked={formData.caregivingChallenges.includes(challenge)}
                      onChange={() => handleChallengeChange(challenge)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.caregivingChallenges.includes(challenge)
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{challenge}</span>
                    </div>
                  </label>
                ))}
              </div>

              {formData.caregivingChallenges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.caregivingChallenges.map((challenge, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm">
                      <span>{challenge}</span>
                      <button
                        type="button"
                        onClick={() => removeChallenge(challenge)}
                        className="text-red-500 hover:text-red-700"
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

            {/* Support Needed */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Support You Need
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {supportOptions.filter(support => support !== 'Other').map((support) => (
                  <label key={support} className="relative">
                    <input
                      type="checkbox"
                      checked={formData.supportNeeded.includes(support)}
                      onChange={() => handleSupportChange(support)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.supportNeeded.includes(support)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{support}</span>
                    </div>
                  </label>
                ))}
              </div>

              {formData.supportNeeded.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.supportNeeded.map((support, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm">
                      <span>{support}</span>
                      <button
                        type="button"
                        onClick={() => removeSupport(support)}
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
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Relationship</label>
                  <p className="text-blue-900 font-medium">{formData.relationship || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Care Recipient&apos;s Condition</label>
                  <p className="text-gray-900">{formData.careRecipientCondition || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Caregiving Location</label>
                  <p className="text-gray-900">{formData.caregivingLocation || 'Not specified'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Caregiving Started</label>
                  <p className="text-gray-900">{formatDate(formData.caregivingPeriod.startDate)}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                  <p className="text-gray-900">{calculateCaregivingDuration()}</p>
                  {formData.caregivingPeriod.isOngoing && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mt-1">
                      Ongoing
                    </span>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hours Per Week</label>
                  <p className="text-gray-900">{formData.hoursPerWeek ? `${formData.hoursPerWeek} hours` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Caregiver Roles */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Caregiving Roles</label>
              {formData.caregiverRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.caregiverRoles.map((role, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No roles specified</p>
              )}
            </div>

            {/* Challenges and Support */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Current Challenges</label>
                {formData.caregivingChallenges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.caregivingChallenges.map((challenge, index) => (
                      <span key={index} className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm">
                        {challenge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No challenges specified</p>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Support Needed</label>
                {formData.supportNeeded.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.supportNeeded.map((support, index) => (
                      <span key={index} className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm">
                        {support}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No support needs specified</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.caregiverRoles.length}
                </div>
                <div className="text-sm text-gray-600">Active Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.hoursPerWeek || '—'}
                </div>
                <div className="text-sm text-gray-600">Hours/Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.caregivingChallenges.length}
                </div>
                <div className="text-sm text-gray-600">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.supportNeeded.length}
                </div>
                <div className="text-sm text-gray-600">Support Needs</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}