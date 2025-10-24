"use client";

import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import Image from 'next/image';
import { 
  useGetCurrentUserQuery, 
  useUpdateCurrentUserMutation,
  useUploadSingleMediaMutation 
} from '@/services/adminApi';
import { Camera, Loader2, X, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, refetch } = useGetCurrentUserQuery();
  const [updateCurrentUser, { isLoading: isUpdating }] = useUpdateCurrentUserMutation();
  const [uploadSingleMedia, { isLoading: isUploading }] = useUploadSingleMediaMutation();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    avatarUrl: ''
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatarUrl: user.avatarUrl || ''
      });
      if (user.avatarUrl) {
        setPreviewImage(user.avatarUrl);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    setUploadError(null);
    setSuccessMessage(null);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setSuccessMessage(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image using RTK Query
    try {
      const response = await uploadSingleMedia(file).unwrap();
      
      // Update form data with the new image URL
      if (response && response.uri) {
        setFormData(prev => ({ ...prev, avatarUrl: response.uri }));
        setSuccessMessage('Image uploaded successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to upload image';
      setUploadError(errorMessage);
      // Revert preview on error
      setPreviewImage(user?.avatarUrl || null);
    }
  };

  const handleSave = async () => {
    setUploadError(null);
    setSuccessMessage(null);
    
    try {
      // Validate required fields
      if (!formData.username.trim()) {
        setUploadError('Username is required');
        return;
      }
      if (!formData.email.trim()) {
        setUploadError('Email is required');
        return;
      }
      if (!formData.firstName.trim()) {
        setUploadError('First name is required');
        return;
      }
      if (!formData.lastName.trim()) {
        setUploadError('Last name is required');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setUploadError('Please enter a valid email address');
        return;
      }

      await updateCurrentUser(formData).unwrap();
      await refetch();
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to update profile';
      setUploadError(errorMessage);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatarUrl: user.avatarUrl || ''
      });
      setPreviewImage(user.avatarUrl || null);
      setUploadError(null);
      setSuccessMessage(null);
    }
  };

  const getInitials = () => {
    const first = formData.firstName?.[0] || user?.firstName?.[0] || 'U';
    const last = formData.lastName?.[0] || user?.lastName?.[0] || 'N';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <DashboardLayout currentPage="profile">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          {user?.isActive !== undefined && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-gray-200">
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <Image
                    src={previewImage} 
                    alt="Profile" 
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {getInitials()}
                  </span>
                )}
              </div>
              <button
                onClick={handleImageClick}
                disabled={isUploading}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg"
                title="Change profile picture"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.firstName || 'User'} {formData.lastName || 'Name'}
              </h2>
              <p className="text-gray-600 mt-1">{formData.email || 'user@stackquiz.com'}</p>
              <p className="text-sm text-gray-500 mt-2">@{formData.username || 'username'}</p>
              {user?.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800 font-medium">Success</p>
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="text-green-400 hover:text-green-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
              <button 
                onClick={() => setUploadError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form Section */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>

            {formData.avatarUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input 
                  type="text"
                  value={formData.avatarUrl}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm" 
                />
              </div>
            )}
            
            <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
              <button 
                onClick={handleSave}
                disabled={isUpdating || isUploading}
                className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
              >
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                disabled={isUpdating || isUploading}
                className="flex-1 sm:flex-none px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}