"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/lib/postsService";
import UserDisplay from "./UserDisplay";

export default function CreatePost({ onPostCreated }) {
  const { user, uploadFile, deleteFile } = useAuth();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please select only images under 5MB.');
    }

    // Limit to 4 images total
    const newImages = [...selectedImages, ...validFiles].slice(0, 4);
    setSelectedImages(newImages);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && selectedImages.length === 0) || !user) return;

    setIsSubmitting(true);
    setUploadingImages(true);

    try {
      // Upload images first
      const imageUrls = [];
      const imagePaths = [];

      for (const image of selectedImages) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${image.name}`;
        const path = `posts/${user.uid}/${fileName}`;
        
        const uploadResult = await uploadFile(image, path);
        if (uploadResult.success) {
          imageUrls.push(uploadResult.url);
          imagePaths.push(uploadResult.path);
        } else {
          console.error('Failed to upload image:', uploadResult.error);
        }
      }

      const postData = {
        content: content.trim(),
        authorId: user.uid,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        images: imageUrls,
        imagePaths: imagePaths, // Store paths for potential deletion
      };

      const result = await postsService.createPost(postData);

      if (result.success) {
        setContent("");
        setTags("");
        setSelectedImages([]);
        setShowForm(false);
        onPostCreated?.();
      } else {
        console.error("Error creating post:", result.error);
        alert("Failed to create post");
        
        // Clean up uploaded images if post creation failed
        for (const path of imagePaths) {
          await deleteFile(path);
        }
      }
    } catch (error) {
      console.error("Error in post submission:", error);
      alert("Failed to create post");
    }

    setIsSubmitting(false);
    setUploadingImages(false);
  };

  if (!user) {
    return (
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-center text-gray-500 text-sm">
          Please log in to share your thoughts
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <UserDisplay
            userId={user.uid}
            showRole={false}
            showVerified={false}
          />
          <span className="text-gray-500 flex-1">
            What&apos;s on your mind?
          </span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <UserDisplay
              userId={user.uid}
              showRole={false}
              showVerified={false}
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                rows="3"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {content.length}/500
              </div>
            </div>
          </div>

          <div className="ml-13">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags (comma separated, e.g. recovery, support, tips)"
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="ml-13">
              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between ml-13">
            <div className="flex items-center space-x-4 text-gray-400">
              <label className="hover:text-gray-600 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={selectedImages.length >= 4}
                />
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
              <span className="text-xs text-gray-500">
                {selectedImages.length}/4 images
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setContent("");
                  setTags("");
                }}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {uploadingImages ? "Uploading..." : isSubmitting ? "Sharing..." : "Share"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
