"use client";
import { useState, useEffect } from "react";
import { userService } from "@/lib/userService";

export default function UserDisplay({
  userId,
  showRole = true,
  showVerified = true,
  size = "md",
  textSize = "sm",
}) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    const data = await userService.getUserData(userId);
    setUserData(data);
    setLoading(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "patient":
        return "text-green-600";
      case "caregiver":
        return "text-blue-600";
      case "medical_professional":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "patient":
        return "Patient";
      case "caregiver":
        return "Caregiver";
      case "medical_professional":
        return "Medical";
      default:
        return "Member";
    }
  };

  const getAvatarSize = () => {
    switch (size) {
      case "xs":
        return "w-6 h-6";
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-12 h-12";
      case "xl":
        return "w-16 h-16";
      default:
        return "w-10 h-10";
    }
  };

  const getTextSize = () => {
    switch (textSize) {
      case "xs":
        return "text-xs";
      case "lg":
        return "text-base";
      case "xl":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`${getAvatarSize()} bg-gray-200 rounded-full animate-pulse`}
        ></div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          {showRole && (
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          )}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`${getAvatarSize()} bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold`}
        >
          ?
        </div>
        <div>
          <span className={`font-medium text-gray-500 ${getTextSize()}`}>
            Unknown User
          </span>
        </div>
      </div>
    );
  }

  const displayName = userData.displayName || 
    `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 
    userData.email?.split('@')[0] || 
    "Anonymous";
  const avatarText = userData.photoURL
    ? ""
    : displayName.charAt(0).toUpperCase();
  const isVerified =
    userData.role === "medical_professional" &&
    userData.medicalVerification?.status === "verified";

  return (
    <div className="flex items-center space-x-2">
      {/* Avatar */}
      {userData.photoURL ? (
        <div className={`${getAvatarSize()} rounded-full overflow-hidden`}>
          <img
            src={userData.photoURL}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={`${getAvatarSize()} bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold ${getTextSize()}`}
        >
          {avatarText}
        </div>
      )}

      {/* User Info */}
      <div className="flex items-center space-x-1">
        <span
          className={`font-semibold text-gray-900 hover:underline cursor-pointer ${getTextSize()}`}
        >
          {displayName}
        </span>

        {showVerified && isVerified && (
          <svg
            className="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}

        {showRole && userData.role && (
          <>
            <span className="text-gray-500">·</span>
            <span
              className={`text-xs font-medium ${getRoleColor(userData.role)}`}
            >
              {getRoleDisplayName(userData.role)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
