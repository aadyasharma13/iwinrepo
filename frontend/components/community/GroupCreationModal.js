"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { messagingService } from "@/lib/messagingService";
import { userService } from "@/lib/userService";
import UserDisplay from "./UserDisplay";

export default function GroupCreationModal({ isOpen, onClose, onGroupCreated }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Group Info, 2: Add Members
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setIsSearching(true);
    try {
      const result = await userService.searchProfiles(searchQuery, 20);
      if (result.success) {
        // Filter out current user and already selected members
        const filteredUsers = result.profiles.filter(
          profile => profile.uid !== user.uid && 
          !selectedMembers.some(member => member.uid === profile.uid)
        );
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setIsSearching(false);
  };

  const toggleMemberSelection = (profile) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(member => member.uid === profile.uid);
      if (isSelected) {
        return prev.filter(member => member.uid !== profile.uid);
      } else {
        if (prev.length >= 49) { // 49 + creator = 50 max
          alert("Maximum 50 members allowed per group");
          return prev;
        }
        return [...prev, profile];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setIsCreating(true);
    try {
      const memberIds = selectedMembers.map(member => member.uid);
      const result = await messagingService.createGroup(
        user.uid,
        groupName.trim(),
        groupDescription.trim(),
        memberIds
      );

      if (result.success) {
        onGroupCreated?.(result.conversation);
        handleClose();
      } else {
        alert(result.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group");
    }
    setIsCreating(false);
  };

  const handleClose = () => {
    setStep(1);
    setGroupName("");
    setGroupDescription("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMembers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 ? "Create Group" : "Add Members"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Group Information
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  maxLength={50}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {groupName.length}/50
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="What's this group about?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                  rows="3"
                  maxLength={200}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {groupDescription.length}/200
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!groupName.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Add Members
            <div className="space-y-4">
              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Selected Members ({selectedMembers.length}/49)
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.uid}
                        className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border"
                      >
                        <UserDisplay userId={member.uid} size="xs" showRole={false} />
                        <span className="text-sm">
                          {member.firstName} {member.lastName}
                        </span>
                        <button
                          onClick={() => toggleMemberSelection(member)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Users */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, or bio..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-64 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((profile) => (
                      <div
                        key={profile.uid}
                        onClick={() => toggleMemberSelection(profile)}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <UserDisplay userId={profile.uid} size="sm" showRole={true} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {profile.firstName} {profile.lastName}
                            </p>
                            {profile.bio && (
                              <p className="text-xs text-gray-500 truncate max-w-48">
                                {profile.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                          {selectedMembers.some(member => member.uid === profile.uid) && (
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim().length >= 2 && !isSearching ? (
                  <div className="text-center py-8 text-gray-500">
                    No users found for "{searchQuery}"
                  </div>
                ) : searchQuery.trim().length < 2 ? (
                  <div className="text-center py-8 text-gray-500">
                    Type at least 2 characters to search
                  </div>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={isCreating}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create Group"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
