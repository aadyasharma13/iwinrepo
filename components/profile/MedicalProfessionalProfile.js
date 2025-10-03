'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Country, State, City } from 'country-state-city';

export default function MedicalProfessionalProfile({ userData, onUpdate }) {
  const { uploadFile, deleteFile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialization: userData.roleSpecificData?.specialization || '',
    yearsOfExperience: userData.roleSpecificData?.yearsOfExperience || '',
    primaryInstitution: userData.roleSpecificData?.primaryInstitution || '',
    licenseNumber: userData.roleSpecificData?.licenseNumber || '',
    workLocations: userData.roleSpecificData?.workLocations || [],
    degree: userData.roleSpecificData?.degree || '',
    graduationYear: userData.roleSpecificData?.graduationYear || '',
    additionalCertifications: userData.roleSpecificData?.additionalCertifications || [],
    // Location fields
    country: userData.roleSpecificData?.country || '',
    state: userData.roleSpecificData?.state || '',
    city: userData.roleSpecificData?.city || '',
    // Documents
    documents: userData.roleSpecificData?.documents || {
      medicalDegree: null,
      licenseDocument: null,
      institutionId: null,
      governmentId: null
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Comprehensive medical specialization list matching MedicalProfessionalForm
  const specializationOptions = [
    // Primary Care & General Medicine
    'General Medicine', 'Family Medicine', 'Internal Medicine', 'General Practice',
    
    // Surgical Specialties
    'General Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Cardiovascular Surgery',
    'Plastic Surgery', 'Pediatric Surgery', 'Urological Surgery', 'Thoracic Surgery',
    'Vascular Surgery', 'Trauma Surgery', 'Transplant Surgery',
    
    // Medical Specialties
    'Cardiology', 'Interventional Cardiology', 'Electrophysiology',
    'Oncology', 'Medical Oncology', 'Radiation Oncology', 'Hematology',
    'Neurology', 'Stroke Medicine', 'Epileptology', 'Movement Disorders',
    'Gastroenterology', 'Hepatology', 'Pulmonology', 'Critical Care Medicine',
    'Nephrology', 'Dialysis', 'Endocrinology', 'Diabetes & Metabolism',
    'Rheumatology', 'Infectious Diseases', 'Immunology', 'Allergy Medicine',
    
    // Pediatric Specialties
    'Pediatrics', 'Neonatology', 'Pediatric Cardiology', 'Pediatric Oncology',
    'Pediatric Neurology', 'Pediatric Surgery', 'Pediatric Intensive Care',
    'Developmental Pediatrics', 'Pediatric Endocrinology',
    
    // Women's Health & Reproductive Medicine
    'Obstetrics & Gynecology', 'Maternal-Fetal Medicine', 'Gynecologic Oncology',
    'Reproductive Endocrinology', 'Infertility Medicine', 'High-Risk Pregnancy',
    
    // Mental Health & Behavioral Sciences
    'Psychiatry', 'Child & Adolescent Psychiatry', 'Geriatric Psychiatry',
    'Addiction Medicine', 'Forensic Psychiatry', 'Clinical Psychology',
    'Counseling Psychology', 'Neuropsychology', 'Behavioral Medicine',
    
    // Diagnostic & Laboratory Medicine
    'Radiology', 'Interventional Radiology', 'Nuclear Medicine',
    'Pathology', 'Clinical Pathology', 'Anatomical Pathology',
    'Forensic Pathology', 'Laboratory Medicine', 'Transfusion Medicine',
    
    // Anesthesia & Pain Management
    'Anesthesiology', 'Pain Medicine', 'Critical Care Anesthesia',
    'Pediatric Anesthesia', 'Cardiac Anesthesia',
    
    // Emergency & Urgent Care
    'Emergency Medicine', 'Trauma Medicine', 'Emergency Pediatrics',
    'Toxicology', 'Disaster Medicine', 'Urgent Care',
    
    // Specialized Medicine
    'Dermatology', 'Dermatopathology', 'Cosmetic Dermatology',
    'Ophthalmology', 'Retina Specialist', 'Cornea Specialist', 'Glaucoma Specialist',
    'ENT (Otolaryngology)', 'Head & Neck Surgery', 'Audiology',
    'Urology', 'Pediatric Urology', 'Urologic Oncology',
    
    // Rehabilitation & Physical Medicine
    'Physical Medicine & Rehabilitation', 'Sports Medicine',
    'Occupational Medicine', 'Pain & Palliative Care',
    
    // Geriatric Medicine
    'Geriatrics', 'Geriatric Psychiatry', 'Palliative Medicine',
    'Hospice Medicine', 'Memory Care',
    
    // Allied Health Professionals
    'Nursing', 'Critical Care Nursing', 'Oncology Nursing', 'Pediatric Nursing',
    'Psychiatric Nursing', 'Community Health Nursing', 'Nurse Practitioner',
    'Certified Nurse Midwife', 'Nurse Anesthetist',
    
    'Pharmacy', 'Clinical Pharmacy', 'Hospital Pharmacy', 'Oncology Pharmacy',
    'Pediatric Pharmacy', 'Geriatric Pharmacy', 'Pharmaceutical Research',
    
    'Physiotherapy', 'Sports Physiotherapy', 'Neurological Physiotherapy',
    'Pediatric Physiotherapy', 'Geriatric Physiotherapy', 'Cardiopulmonary PT',
    
    'Occupational Therapy', 'Speech & Language Therapy', 'Audiology',
    'Clinical Social Work', 'Medical Social Work',
    
    // Nutrition & Dietetics
    'Clinical Nutrition', 'Sports Nutrition', 'Pediatric Nutrition',
    'Geriatric Nutrition', 'Oncology Nutrition', 'Renal Nutrition',
    'Diabetes Education', 'Weight Management',
    
    // Medical Technology & Research
    'Medical Research', 'Clinical Research', 'Biomedical Engineering',
    'Medical Technology', 'Healthcare Informatics', 'Telemedicine',
    'Public Health', 'Epidemiology', 'Health Policy',
    
    // Administration & Management
    'Healthcare Administration', 'Hospital Management', 'Medical Coding',
    'Health Information Management', 'Quality Assurance',
    'Medical Affairs', 'Regulatory Affairs',
    
    // Alternative & Complementary Medicine
    'Ayurveda', 'Homeopathy', 'Naturopathy', 'Acupuncture',
    'Chiropractic Medicine', 'Integrative Medicine',
    
    // Dental Specialties
    'General Dentistry', 'Oral & Maxillofacial Surgery', 'Orthodontics',
    'Periodontology', 'Endodontics', 'Prosthodontics', 'Pediatric Dentistry',
    'Oral Pathology', 'Dental Public Health',
    
    // Veterinary Medicine
    'Veterinary Medicine', 'Veterinary Surgery', 'Veterinary Pathology',
    
    // Other Specialties
    'Aerospace Medicine', 'Diving Medicine', 'Travel Medicine',
    'Wilderness Medicine', 'Military Medicine', 'Prison Medicine',
    'Medical Education', 'Medical Writing', 'Medical Ethics',
    
    'Other'
  ];

  const degreeOptions = [
    // Medical Degrees
    'MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'FRCS', 'MRCP', 'FRCR',
    'DO (Doctor of Osteopathy)', 'BAMS', 'BHMS', 'BUMS', 'BNYS',
    
    // Dental Degrees
    'BDS', 'MDS', 'DMD', 'DDS', 'PhD in Dentistry',
    
    // Nursing Degrees
    'B.Sc Nursing', 'M.Sc Nursing', 'B.Sc (Hons) Nursing', 'Post Basic B.Sc Nursing',
    'M.Sc in Psychiatric Nursing', 'M.Sc in Community Health Nursing',
    
    // Pharmacy Degrees
    'B.Pharm', 'M.Pharm', 'PharmD', 'PhD in Pharmacy', 'Diploma in Pharmacy',
    
    // Physiotherapy Degrees
    'BPT', 'MPT', 'DPT', 'PhD in Physiotherapy', 'Diploma in Physiotherapy',
    
    // Allied Health Degrees
    'B.Sc in Medical Technology', 'M.Sc in Medical Technology',
    'B.Sc in Radiology', 'M.Sc in Radiology', 'B.Sc in Operation Theatre Technology',
    'B.Sc in Medical Laboratory Technology', 'B.Sc in Respiratory Therapy',
    'Bachelor of Occupational Therapy', 'Master of Occupational Therapy',
    'Bachelor of Audiology & Speech Language Pathology',
    'Master of Audiology & Speech Language Pathology',
    
    // Psychology Degrees
    'M.A in Psychology', 'M.Sc in Psychology', 'M.Phil in Psychology',
    'PhD in Psychology', 'PsyD', 'Diploma in Clinical Psychology',
    
    // Public Health Degrees
    'MPH', 'DrPH', 'M.Sc in Public Health', 'M.Sc in Epidemiology',
    'M.Sc in Health Administration', 'MBA in Healthcare Management',
    
    // Research & Academic Degrees
    'PhD', 'M.Phil', 'M.Sc', 'M.A', 'Post Doctoral Fellowship',
    
    // Diploma & Certificate Courses
    'Diploma in Medical Radio Diagnosis', 'Diploma in Anesthesia',
    'Diploma in Gynecology & Obstetrics', 'Diploma in Pediatrics',
    'Diploma in Orthopedics', 'Diploma in Ophthalmology',
    'Diploma in Dermatology', 'Diploma in Psychiatry',
    'Diploma in Emergency Medicine', 'Diploma in Family Medicine',
    
    // International Degrees
    'ECFMG Certified', 'USMLE', 'PLAB', 'AMC', 'Medical Council Certification',
    
    'Other'
  ];

  const workLocationOptions = [
    'Hospital', 'Clinic', 'Private Practice', 'Research Institute',
    'Medical College', 'Home Care', 'Telemedicine', 'Other'
  ];

  const certificationOptions = [
    'Fellowship', 'Board Certification', 'Specialty Training', 'Research Publications',
    'Teaching Experience', 'International Training', 'Awards/Recognition', 'Other'
  ];

  // Get location data
  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

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
      additionalCertifications: userData.roleSpecificData?.additionalCertifications || [],
      country: userData.roleSpecificData?.country || '',
      state: userData.roleSpecificData?.state || '',
      city: userData.roleSpecificData?.city || '',
      documents: userData.roleSpecificData?.documents || {
        medicalDegree: null,
        licenseDocument: null,
        institutionId: null,
        governmentId: null
      }
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

  const handleLocationFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'country') {
        updated.state = '';
        updated.city = '';
      } else if (field === 'state') {
        updated.city = '';
      }
      
      return updated;
    });
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress({ ...uploadProgress, [documentType]: 0 });

    try {
      const timestamp = Date.now();
      const fileName = `${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `medical-verification/${userData.uid}/${documentType}/${timestamp}_${fileName}`;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[documentType] || 0;
          const newProgress = Math.min(currentProgress + 10, 90);
          return { ...prev, [documentType]: newProgress };
        });
      }, 200);

      const uploadResult = await uploadFile(file, filePath);

      clearInterval(progressInterval);

      if (uploadResult.success) {
        setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));

        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: uploadResult.url
          }
        }));

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
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: null
      }
    }));
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
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

  const getLocationName = (code, type) => {
    if (!code) return '';
    
    switch (type) {
      case 'country':
        const country = countries.find(c => c.isoCode === code);
        return country?.name || code;
      case 'state':
        const state = states.find(s => s.isoCode === code);
        return state?.name || code;
      case 'city':
        return code; // City is stored as name, not code
      default:
        return code;
    }
  };

  const DocumentUpload = ({ documentType, file, progress, onUpload, onRemove }) => (
    <div>
      {!formData.documents[documentType] ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
          <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-600 mb-2">
            Drop document here or <span className="text-purple-600 font-medium">browse files</span>
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onUpload(documentType, e.target.files[0])}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Document uploaded</p>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <label className="block text-sm font-semibold text-gray-700">Medical Specialization *</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select your specialization</option>
                  {specializationOptions.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 ml-1">Select your primary area of medical practice</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Primary Medical Degree *</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select your degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Years of Experience *</label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select experience range</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="21+">21+ years</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Graduation Year *</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                  placeholder="YYYY"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Primary Institution/Hospital *</label>
              <input
                type="text"
                value={formData.primaryInstitution}
                onChange={(e) => setFormData({ ...formData, primaryInstitution: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                placeholder="e.g., Apollo Hospital, AIIMS, Private Practice"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Medical License/Registration Number *</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                placeholder="State Medical Council Registration Number"
              />
              <p className="text-xs text-gray-500">This will be verified with the Medical Council database</p>
            </div>

            {/* Location Information */}
            <div className="space-y-4 bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Location *</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleLocationFieldChange('country', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">State/Province *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleLocationFieldChange('state', e.target.value)}
                    disabled={!formData.country}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select your state</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleLocationFieldChange('city', e.target.value)}
                    disabled={!formData.state}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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

            {/* Document Upload Section */}
            <div className="space-y-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Verification Documents</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Medical Degree Certificate *</label>
                  <DocumentUpload
                    documentType="medicalDegree"
                    file={formData.documents.medicalDegree}
                    progress={uploadProgress.medicalDegree}
                    onUpload={handleFileUpload}
                    onRemove={removeDocument}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Medical License Certificate *</label>
                  <DocumentUpload
                    documentType="licenseDocument"
                    file={formData.documents.licenseDocument}
                    progress={uploadProgress.licenseDocument}
                    onUpload={handleFileUpload}
                    onRemove={removeDocument}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Institution ID/Work Proof</label>
                  <DocumentUpload
                    documentType="institutionId"
                    file={formData.documents.institutionId}
                    progress={uploadProgress.institutionId}
                    onUpload={handleFileUpload}
                    onRemove={removeDocument}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Government ID *</label>
                  <DocumentUpload
                    documentType="governmentId"
                    file={formData.documents.governmentId}
                    progress={uploadProgress.governmentId}
                    onUpload={handleFileUpload}
                    onRemove={removeDocument}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Practice Location</label>
                  <p className="text-gray-900">
                    {formData.country && formData.state && formData.city
                      ? `${formData.city}, ${getLocationName(formData.state, 'state')}, ${getLocationName(formData.country, 'country')}`
                      : 'Not specified'}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Graduation Year</label>
                  <p className="text-gray-900">{formData.graduationYear || 'Not specified'}</p>
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
            {formData.documents && Object.values(formData.documents).some(doc => doc) && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Verification Documents</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(formData.documents).map(([key, url]) => url && (
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