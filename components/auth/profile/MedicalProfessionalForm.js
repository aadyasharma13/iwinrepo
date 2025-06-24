'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function MedicalProfessionalForm({ onSubmit }) {
  const { uploadFile } = useAuth();
  const [formData, setFormData] = useState({
    specialization: '',
    yearsOfExperience: '',
    primaryInstitution: '',
    licenseNumber: '',
    workLocations: [],
    degree: '',
    graduationYear: '',
    additionalCertifications: [],
    
    // Document URLs (not file objects)
    documents: {
      medicalDegree: null,
      licenseDocument: null,
      institutionId: null,
      governmentId: null
    },
    
    // Store file paths for deletion if needed
    documentPaths: {
      medicalDegree: null,
      licenseDocument: null,
      institutionId: null,
      governmentId: null
    }
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);

  const specializationOptions = [
    'General Medicine',
    'Cardiology',
    'Oncology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Dermatology',
    'Radiology',
    'Anesthesiology',
    'Emergency Medicine',
    'Internal Medicine',
    'Surgery',
    'Obstetrics & Gynecology',
    'Ophthalmology',
    'ENT (Otolaryngology)',
    'Urology',
    'Gastroenterology',
    'Endocrinology',
    'Pulmonology',
    'Nephrology',
    'Rheumatology',
    'Infectious Diseases',
    'Pathology',
    'Physical Medicine & Rehabilitation',
    'Nursing',
    'Pharmacy',
    'Physiotherapy',
    'Psychology/Counseling',
    'Nutrition/Dietetics',
    'Medical Research',
    'Healthcare Administration',
    'Other'
  ];

  const degreeOptions = [
    'MBBS',
    'MD',
    'MS',
    'DM',
    'MCh',
    'DNB',
    'BAMS',
    'BHMS',
    'BDS',
    'MDS',
    'BPT',
    'MPT',
    'B.Sc Nursing',
    'M.Sc Nursing',
    'B.Pharm',
    'M.Pharm',
    'PharmD',
    'Ph.D',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationStep === 1) {
      setVerificationStep(2);
    } else {
      // Submit for admin verification
      const submissionData = {
        ...formData,
        verificationStatus: 'pending',
        submittedAt: new Date().toISOString()
      };
      onSubmit(submissionData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress({ ...uploadProgress, [documentType]: 0 });

    try {
      // Generate unique file path
      const timestamp = Date.now();
      const fileName = `${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `medical-verification/${auth.currentUser.uid}/${documentType}/${timestamp}_${fileName}`;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[documentType] || 0;
          const newProgress = Math.min(currentProgress + 10, 90);
          return { ...prev, [documentType]: newProgress };
        });
      }, 200);

      // Actually upload to Firebase Storage
      const uploadResult = await uploadFile(file, filePath);

      clearInterval(progressInterval);

      if (uploadResult.success) {
        // Complete progress
        setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));

        // Update form data with download URL
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: uploadResult.url
          },
          documentPaths: {
            ...prev.documentPaths,
            [documentType]: uploadResult.path
          }
        }));

        // Clear progress after a moment
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
        }, 1000);
      } else {
        setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
        alert(`Upload failed: ${uploadResult.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = async (documentType) => {
    const filePath = formData.documentPaths[documentType];
    
    if (filePath) {
      // Delete from Firebase Storage
      await deleteFile(filePath);
    }

    // Remove from form data
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: null
      },
      documentPaths: {
        ...prev.documentPaths,
        [documentType]: null
      }
    }));
    
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
  };

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      {/* Specialization */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Medical Specialization *
        </label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900"
        >
          <option value="" className="text-gray-500">Select your specialization</option>
          {specializationOptions.map((spec) => (
            <option key={spec} value={spec} className="text-gray-900">{spec}</option>
          ))}
        </select>
      </div>

      {/* Degree */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Primary Medical Degree *
        </label>
        <select
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          required
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900"
        >
          <option value="" className="text-gray-500">Select your degree</option>
          {degreeOptions.map((degree) => (
            <option key={degree} value={degree} className="text-gray-900">{degree}</option>
          ))}
        </select>
      </div>

      {/* Years of Experience */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Years of Experience *
        </label>
        <select
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          required
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900"
        >
          <option value="" className="text-gray-500">Select experience range</option>
          <option value="0-2" className="text-gray-900">0-2 years</option>
          <option value="3-5" className="text-gray-900">3-5 years</option>
          <option value="6-10" className="text-gray-900">6-10 years</option>
          <option value="11-15" className="text-gray-900">11-15 years</option>
          <option value="16-20" className="text-gray-900">16-20 years</option>
          <option value="21+" className="text-gray-900">21+ years</option>
        </select>
      </div>

      {/* Graduation Year */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Graduation Year *
        </label>
        <div className="relative">
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            required
            min="1950"
            max={new Date().getFullYear()}
            className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="YYYY"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Primary Institution */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Primary Institution/Hospital *
        </label>
        <div className="relative">
          <input
            type="text"
            name="primaryInstitution"
            value={formData.primaryInstitution}
            onChange={handleChange}
            required
            className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="e.g., Apollo Hospital, AIIMS, Private Practice"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* License Number */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Medical License/Registration Number *
        </label>
        <div className="relative">
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="State Medical Council Registration Number"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-1">
          This will be verified with the Medical Council database
        </p>
      </div>

      {/* Work Locations */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Work Locations <span className="text-gray-400 font-normal">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Hospital', 'Clinic', 'Private Practice', 'Research Institute', 'Medical College', 'Home Care', 'Telemedicine', 'Other'].map((location) => (
            <label key={location} className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.workLocations.includes(location)}
                onChange={() => handleLocationChange(location)}
                className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{location}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Certifications */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Additional Certifications <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Fellowship', 'Board Certification', 'Specialty Training', 'Research Publications', 'Teaching Experience', 'International Training', 'Awards/Recognition', 'Other'].map((cert) => (
            <label key={cert} className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.additionalCertifications.includes(cert)}
                onChange={() => handleCertificationChange(cert)}
                className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{cert}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentUploadStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Admin Verification Process</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              After submission, your profile will show as Under Review until our admin team verifies your credentials. We follow a strict verification process including license validation and document review to ensure platform safety.
            </p>
            <div className="mt-3 text-sm text-blue-800">
              <p className="font-medium">Verification Timeline:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Document review: 1-2 business days</li>
                <li>License verification: 2-3 business days</li>
                <li>Final approval: 1 business day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Sections */}
      <div className="space-y-6">
        {/* Medical Degree Certificate */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Medical Degree Certificate * 
            <span className="text-gray-500 font-normal">(MBBS/MD/MS/DM/MCh/DNB etc.)</span>
          </label>
          <DocumentUpload
            documentType="medicalDegree"
            file={formData.documents.medicalDegree}
            progress={uploadProgress.medicalDegree}
            onUpload={handleFileUpload}
            onRemove={removeDocument}
            acceptedFormats=".pdf,.jpg,.jpeg,.png"
            maxSize="5MB"
          />
        </div>

        {/* License Document */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Medical License/Registration Certificate *
          </label>
          <DocumentUpload
            documentType="licenseDocument"
            file={formData.documents.licenseDocument}
            progress={uploadProgress.licenseDocument}
            onUpload={handleFileUpload}
            onRemove={removeDocument}
            acceptedFormats=".pdf,.jpg,.jpeg,.png"
            maxSize="5MB"
          />
        </div>

        {/* Institution ID */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Institution ID/Work Proof 
            <span className="text-gray-500 font-normal">(Optional but recommended)</span>
          </label>
          <DocumentUpload
            documentType="institutionId"
            file={formData.documents.institutionId}
            progress={uploadProgress.institutionId}
            onUpload={handleFileUpload}
            onRemove={removeDocument}
            acceptedFormats=".pdf,.jpg,.jpeg,.png"
            maxSize="5MB"
          />
        </div>

        {/* Government ID */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Government ID * 
            <span className="text-gray-500 font-normal">(Aadhaar/PAN/Passport)</span>
          </label>
          <DocumentUpload
            documentType="governmentId"
            file={formData.documents.governmentId}
            progress={uploadProgress.governmentId}
            onUpload={handleFileUpload}
            onRemove={removeDocument}
            acceptedFormats=".pdf,.jpg,.jpeg,.png"
            maxSize="5MB"
          />
        </div>
      </div>
    </div>
  );

  const DocumentUpload = ({ documentType, file, progress, onUpload, onRemove, acceptedFormats, maxSize }) => (
    <div>
      {!formData.documents[documentType] ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-600 mb-2">
            Drop your document here or <span className="text-purple-600 font-medium">browse files</span>
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: {acceptedFormats} • Max size: {maxSize}
          </p>
          <input
            type="file"
            accept={acceptedFormats}
            onChange={(e) => onUpload(documentType, e.target.files[0])}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Document uploaded successfully</p>
                <p className="text-xs text-gray-500">Click to view or replace</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={formData.documents[documentType]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => onRemove(documentType)}
                disabled={isUploading}
                className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          {progress > 0 && progress < 100 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Professional Verification</h2>
        <p className="text-gray-600">
          {verificationStep === 1 ? 'Tell us about your medical practice and qualifications' : 'Upload your documents for verification'}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${verificationStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${verificationStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <span className="text-sm font-medium">Basic Info</span>
        </div>
        <div className={`w-8 h-0.5 ${verificationStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center space-x-2 ${verificationStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${verificationStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <span className="text-sm font-medium">Documents</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {verificationStep === 1 ? renderBasicInfoStep() : renderDocumentUploadStep()}

        <div className="flex space-x-4 pt-6">
          {verificationStep === 2 && (
            <button
              type="button"
              onClick={() => setVerificationStep(1)}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              ← Back to Basic Info
            </button>
          )}
          
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{verificationStep === 1 ? 'Continue to Documents' : 'Submit for Verification'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>

        {verificationStep === 2 && (
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              By submitting, you agree to our verification process and acknowledge that false information may result in account suspension.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}