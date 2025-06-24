'use client';
import { useState } from 'react';

export default function PatientProfile({ userData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    diagnoses: userData.roleSpecificData?.diagnoses || [],
    currentStage: userData.roleSpecificData?.currentStage || '',
    treatments: userData.roleSpecificData?.treatments || [],
    hospital: userData.roleSpecificData?.hospital || '',
    doctorName: userData.roleSpecificData?.doctorName || '',
    emergencyContact: userData.roleSpecificData?.emergencyContact || '',
    emergencyPhone: userData.roleSpecificData?.emergencyPhone || '',
    medications: userData.roleSpecificData?.medications || [],
    allergies: userData.roleSpecificData?.allergies || [],
    symptoms: userData.roleSpecificData?.symptoms || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [customStage, setCustomStage] = useState('');
  const [customTreatment, setCustomTreatment] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState({ condition: '', diagnosisDate: '', severity: '' });

  const treatmentOptions = [
    'Chemotherapy', 'Radiation Therapy', 'Surgery', 'Immunotherapy', 'Physiotherapy',
    'Medication Management', 'Lifestyle Changes', 'Alternative Medicine', 'Counseling/Therapy', 
    'Nutritional Support', 'Pain Management', 'Hormone Therapy', 'Clinical Trial', 'Other'
  ];

  const stageOptions = [
    'Recently Diagnosed', 'In Treatment', 'Between Treatments', 'In Remission',
    'Cured/Recovered', 'Managing Chronic Condition', 'Palliative Care', 'Follow-up Care', 'Other'
  ];

  const severityOptions = ['Mild', 'Moderate', 'Severe', 'Critical'];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        roleSpecificData: formData
      };
      
      const success = await onUpdate(updatedData);
      if (success) {
        setIsEditing(false);
        setCustomStage('');
        setCustomTreatment('');
        setNewDiagnosis({ condition: '', diagnosisDate: '', severity: '' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      diagnoses: userData.roleSpecificData?.diagnoses || [],
      currentStage: userData.roleSpecificData?.currentStage || '',
      treatments: userData.roleSpecificData?.treatments || [],
      hospital: userData.roleSpecificData?.hospital || '',
      doctorName: userData.roleSpecificData?.doctorName || '',
      emergencyContact: userData.roleSpecificData?.emergencyContact || '',
      emergencyPhone: userData.roleSpecificData?.emergencyPhone || '',
      medications: userData.roleSpecificData?.medications || [],
      allergies: userData.roleSpecificData?.allergies || [],
      symptoms: userData.roleSpecificData?.symptoms || []
    });
    setIsEditing(false);
    setCustomStage('');
    setCustomTreatment('');
    setNewDiagnosis({ condition: '', diagnosisDate: '', severity: '' });
  };

  const handleTreatmentChange = (treatment) => {
    if (treatment === 'Other') {
      return; // Handle via custom input
    }
    setFormData({
      ...formData,
      treatments: formData.treatments.includes(treatment)
        ? formData.treatments.filter(t => t !== treatment)
        : [...formData.treatments, treatment]
    });
  };

  const handleStageChange = (stage) => {
    if (stage === 'Other') {
      return; // Handle via custom input
    }
    setFormData({ ...formData, currentStage: stage });
  };

  const addCustomTreatment = () => {
    if (customTreatment.trim() && !formData.treatments.includes(customTreatment.trim())) {
      setFormData({
        ...formData,
        treatments: [...formData.treatments, customTreatment.trim()]
      });
      setCustomTreatment('');
    }
  };

  const addCustomStage = () => {
    if (customStage.trim()) {
      setFormData({ ...formData, currentStage: customStage.trim() });
      setCustomStage('');
    }
  };

  const addDiagnosis = () => {
    if (newDiagnosis.condition.trim()) {
      const diagnosis = {
        id: Date.now(),
        condition: newDiagnosis.condition.trim(),
        diagnosisDate: newDiagnosis.diagnosisDate,
        severity: newDiagnosis.severity
      };
      setFormData({
        ...formData,
        diagnoses: [...formData.diagnoses, diagnosis]
      });
      setNewDiagnosis({ condition: '', diagnosisDate: '', severity: '' });
    }
  };

  const removeDiagnosis = (id) => {
    setFormData({
      ...formData,
      diagnoses: formData.diagnoses.filter(d => d.id !== id)
    });
  };

  const removeTreatment = (treatment) => {
    setFormData({
      ...formData,
      treatments: formData.treatments.filter(t => t !== treatment)
    });
  };

  const addArrayItem = (field, value) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
    }
  };

  const removeArrayItem = (field, value) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter(item => item !== value)
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

  const ArrayInput = ({ field, placeholder, label }) => {
    const [inputValue, setInputValue] = useState('');
    
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem(field, inputValue);
                setInputValue('');
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => {
              addArrayItem(field, inputValue);
              setInputValue('');
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Add
          </button>
        </div>
        {formData[field].length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData[field].map((item, index) => (
              <span key={index} className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-sm">
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, item)}
                  className="text-emerald-500 hover:text-emerald-700"
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
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Medical Information</h2>
              <p className="text-gray-600 text-sm">Complete healthcare profile and medical history</p>
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
            {/* Diagnoses Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Diagnoses</h3>
              
              {/* Add New Diagnosis */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Add New Diagnosis</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Condition/Disease</label>
                    <input
                      type="text"
                      value={newDiagnosis.condition}
                      onChange={(e) => setNewDiagnosis({ ...newDiagnosis, condition: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                      placeholder="e.g., Breast Cancer, Type 2 Diabetes"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Diagnosis Date</label>
                    <input
                      type="date"
                      value={newDiagnosis.diagnosisDate}
                      onChange={(e) => setNewDiagnosis({ ...newDiagnosis, diagnosisDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Severity</label>
                    <select
                      value={newDiagnosis.severity}
                      onChange={(e) => setNewDiagnosis({ ...newDiagnosis, severity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700"
                    >
                      <option value="" className="text-gray-500">Select severity</option>
                      {severityOptions.map(severity => (
                        <option key={severity} value={severity} className="text-gray-700">{severity}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addDiagnosis}
                  disabled={!newDiagnosis.condition.trim()}
                  className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Diagnosis
                </button>
              </div>

              {/* Current Diagnoses */}
              {formData.diagnoses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-900">Current Diagnoses</h4>
                  <div className="space-y-3">
                    {formData.diagnoses.map((diagnosis) => (
                      <div key={diagnosis.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h5 className="font-medium text-gray-900">{diagnosis.condition}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                {diagnosis.diagnosisDate && (
                                  <span>Diagnosed: {formatDate(diagnosis.diagnosisDate)}</span>
                                )}
                                {diagnosis.severity && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    diagnosis.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                    diagnosis.severity === 'Severe' ? 'bg-orange-100 text-orange-700' :
                                    diagnosis.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {diagnosis.severity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDiagnosis(diagnosis.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current Stage */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Current Treatment Stage</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stageOptions.filter(stage => stage !== 'Other').map((stage) => (
                  <label key={stage} className="relative">
                    <input
                      type="radio"
                      name="currentStage"
                      value={stage}
                      checked={formData.currentStage === stage}
                      onChange={(e) => handleStageChange(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.currentStage === stage
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{stage}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Custom Stage Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customStage}
                  onChange={(e) => setCustomStage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomStage();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Enter custom stage..."
                />
                <button
                  type="button"
                  onClick={addCustomStage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Set Custom
                </button>
              </div>
            </div>

            {/* Treatments */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Current/Recent Treatments</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {treatmentOptions.filter(treatment => treatment !== 'Other').map((treatment) => (
                  <label key={treatment} className="relative">
                    <input
                      type="checkbox"
                      checked={formData.treatments.includes(treatment)}
                      onChange={() => handleTreatmentChange(treatment)}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.treatments.includes(treatment)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium">{treatment}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Custom Treatment Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customTreatment}
                  onChange={(e) => setCustomTreatment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomTreatment();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Enter custom treatment..."
                />
                <button
                  type="button"
                  onClick={addCustomTreatment}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Add Treatment
                </button>
              </div>

              {/* Current Treatments */}
              {formData.treatments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.treatments.map((treatment, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-sm">
                      <span>{treatment}</span>
                      <button
                        type="button"
                        onClick={() => removeTreatment(treatment)}
                        className="text-emerald-500 hover:text-emerald-700"
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

            {/* Additional Medical Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ArrayInput 
                field="medications" 
                placeholder="e.g., Aspirin 81mg daily" 
                label="Current Medications"
              />
              <ArrayInput 
                field="allergies" 
                placeholder="e.g., Penicillin, Peanuts" 
                label="Known Allergies"
              />
            </div>

            <ArrayInput 
              field="symptoms" 
              placeholder="e.g., Fatigue, Nausea, Pain" 
              label="Current Symptoms"
            />

            {/* Healthcare Provider Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Provider Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Hospital/Treatment Center</label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                    placeholder="e.g., City General Hospital"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Primary Physician</label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                    placeholder="Dr. Smith"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
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
                disabled={isSaving || formData.diagnoses.length === 0}
                className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            {/* Diagnoses Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Diagnoses</h3>
              {formData.diagnoses.length > 0 ? (
                <div className="space-y-3">
                  {formData.diagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-emerald-900">{diagnosis.condition}</h4>
                          <div className="flex items-center space-x-4 text-sm text-emerald-700 mt-1">
                            {diagnosis.diagnosisDate && (
                              <span>Diagnosed: {formatDate(diagnosis.diagnosisDate)}</span>
                            )}
                            {diagnosis.severity && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                diagnosis.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                diagnosis.severity === 'Severe' ? 'bg-orange-100 text-orange-700' :
                                diagnosis.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {diagnosis.severity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No diagnoses specified</p>
                  <p className="text-gray-500 text-sm mt-1">Click Edit to add your medical diagnoses</p>
                </div>
              )}
            </div>

            {/* Other Information Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Current Stage</label>
                  <p className="text-gray-900">{formData.currentStage || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital/Treatment Center</label>
                  <p className="text-gray-900">{formData.hospital || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Physician</label>
                  <p className="text-gray-900">{formData.doctorName || 'Not specified'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact</label>
                  <p className="text-gray-900">{formData.emergencyContact || 'Not specified'}</p>
                  {formData.emergencyPhone && (
                    <p className="text-gray-600 text-sm mt-1">{formData.emergencyPhone}</p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Current Medications</label>
                  {formData.medications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.medications.map((medication, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-xs">
                          {medication}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No medications specified</p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Known Allergies</label>
                  {formData.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map((allergy, index) => (
                        <span key={index} className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-full text-xs">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No allergies specified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Treatments and Symptoms Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Current/Recent Treatments</label>
                {formData.treatments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.treatments.map((treatment, index) => (
                      <span key={index} className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-sm font-medium">
                        {treatment}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No treatments specified</p>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Current Symptoms</label>
                {formData.symptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.symptoms.map((symptom, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full text-xs">
                        {symptom}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No symptoms specified</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.diagnoses.length}
                </div>
                <div className="text-sm text-gray-600">Active Diagnoses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.treatments.length}
                </div>
                <div className="text-sm text-gray-600">Active Treatments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.medications.length}
                </div>
                <div className="text-sm text-gray-600">Medications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formData.allergies.length}
                </div>
                <div className="text-sm text-gray-600">Known Allergies</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}