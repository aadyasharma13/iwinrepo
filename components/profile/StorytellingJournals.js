'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { journalService } from '@/lib/journalService';

export default function StorytellingJournals() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newJournal, setNewJournal] = useState({
    title: '',
    content: '',
    type: 'text', // text, audio, video
    isPublic: false,
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterPrivacy, setFilterPrivacy] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Load journals from Firebase
  useEffect(() => {
    loadJournals();
  }, [user]);

  const loadJournals = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      const result = await journalService.getUserJournals(user.uid);
      if (result.success) {
        setJournals(result.journals);
      } else {
        console.error('Error loading journals:', result.error);
      }
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJournal = async () => {
    if (!newJournal.title.trim() || (!newJournal.content.trim() && !audioBlob && !videoBlob)) {
      return;
    }

    setIsSaving(true);
    try {
      const journalData = {
        ...newJournal,
        author: user?.displayName || 'Anonymous',
        audioBlob: audioBlob,
        videoBlob: videoBlob
      };

      const result = await journalService.createJournal(user.uid, journalData);
      
      if (result.success) {
        // Reload journals to get the updated list
        await loadJournals();
        
        // Reset form
        setNewJournal({
          title: '',
          content: '',
          type: 'text',
          isPublic: false,
          tags: []
        });
        setAudioBlob(null);
        setVideoBlob(null);
        setIsCreating(false);
      } else {
        console.error('Error creating journal:', result.error);
        alert('Failed to save journal entry. Please try again.');
      }
    } catch (error) {
      console.error('Error creating journal:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newJournal.tags.includes(newTag.trim())) {
      setNewJournal(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewJournal(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      const recorder = new MediaRecorder(stream);
      const videoChunks = [];

      recorder.ondataavailable = (event) => {
        videoChunks.push(event.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        setVideoBlob(videoBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting video recording:', error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const filteredJournals = journals.filter(journal => {
    const typeMatch = filterType === 'all' || journal.type === filterType;
    const privacyMatch = filterPrivacy === 'all' || 
      (filterPrivacy === 'public' && journal.isPublic) ||
      (filterPrivacy === 'private' && !journal.isPublic);
    return typeMatch && privacyMatch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Storytelling Journals</h2>
          <p className="text-gray-600">Document your healing journey through text, audio, or video</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Privacy:</label>
          <select
            value={filterPrivacy}
            onChange={(e) => setFilterPrivacy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Create Journal Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Journal Entry</h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewJournal({
                    title: '',
                    content: '',
                    type: 'text',
                    isPublic: false,
                    tags: []
                  });
                  setAudioBlob(null);
                  setVideoBlob(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newJournal.title}
                  onChange={(e) => setNewJournal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your journal entry a title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
                <div className="flex space-x-4">
                  {[
                    { value: 'text', label: 'Text', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                    { value: 'audio', label: 'Audio', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                    { value: 'video', label: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewJournal(prev => ({ ...prev, type: type.value }))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        newJournal.type === type.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                      </svg>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content based on type */}
              {newJournal.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newJournal.content}
                    onChange={(e) => setNewJournal(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your thoughts, feelings, and experiences..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              )}

              {newJournal.type === 'audio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audio Recording</label>
                  <div className="space-y-4">
                    {!audioBlob ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <p className="text-gray-500 mb-4">Record your thoughts and feelings</p>
                        <button
                          onClick={isRecording ? stopAudioRecording : startAudioRecording}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isRecording
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <audio ref={audioRef} controls className="w-full">
                          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                        </audio>
                        <button
                          onClick={() => setAudioBlob(null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Re-record
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {newJournal.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Recording</label>
                  <div className="space-y-4">
                    {!videoBlob ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 mb-4">Record a video of your thoughts and experiences</p>
                        <button
                          onClick={isRecording ? stopVideoRecording : startVideoRecording}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isRecording
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <video ref={videoRef} controls className="w-full max-w-md">
                          <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
                        </video>
                        <button
                          onClick={() => setVideoBlob(null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Re-record
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newJournal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-emerald-500 hover:text-emerald-700"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!newJournal.isPublic}
                      onChange={() => setNewJournal(prev => ({ ...prev, isPublic: false }))}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Private</div>
                      <div className="text-sm text-gray-700">Only you can see this entry</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="privacy"
                      checked={newJournal.isPublic}
                      onChange={() => setNewJournal(prev => ({ ...prev, isPublic: true }))}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Public</div>
                      <div className="text-sm text-gray-700">Share with the community to inspire others</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewJournal({
                      title: '',
                      content: '',
                      type: 'text',
                      isPublic: false,
                      tags: []
                    });
                    setAudioBlob(null);
                    setVideoBlob(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJournal}
                  disabled={!newJournal.title.trim() || (!newJournal.content.trim() && !audioBlob && !videoBlob) || isSaving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Create Entry</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journals List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your journals...</p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
            <p className="text-gray-500 mb-4">Start documenting your healing journey</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Create Your First Entry
            </button>
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div key={journal.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    {getTypeIcon(journal.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{journal.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatDate(journal.createdAt)}</span>
                      <span>•</span>
                      <span className="capitalize">{journal.type}</span>
                      {journal.isPublic ? (
                        <span className="text-emerald-600">• Public</span>
                      ) : (
                        <span className="text-gray-500">• Private</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {journal.type === 'text' && (
                <p className="text-gray-700 mb-4">{journal.content}</p>
              )}

              {journal.type === 'audio' && journal.audioUrl && (
                <div className="mb-4">
                  <audio controls className="w-full">
                    <source src={journal.audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {journal.type === 'video' && journal.videoUrl && (
                <div className="mb-4">
                  <video controls className="w-full max-w-md">
                    <source src={journal.videoUrl} type="video/webm" />
                    Your browser does not support the video element.
                  </video>
                </div>
              )}

              {journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {journal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {journal.isPublic && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{journal.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{journal.comments}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
