import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthGuard';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    website: user?.website || '',
    bio: user?.bio || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Not specified'
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Update form data when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        username: user.username || '',
        website: user.website || '',
        bio: user.bio || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Not specified'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Profile update attempt:', { user, formData });
    
    if (!user || !user.username) {
      alert('User data missing. Please log in again.');
      setLoading(false);
      return;
    }
    try {
      console.log('Sending API request to:', `/api/users/${user.username}`);
      console.log('Request data:', formData);
      
      const response = await axios.put(`/api/users/${user.username}`, formData);
      console.log('API response:', response.data);
      
      // Update the user profile with the response from the server
      updateProfile({ ...formData, avatar: response.data.avatar || user.avatar });
      setLoading(false);
      
      // If username changed, redirect to new profile URL
      if (formData.username !== user.username) {
        navigate(`/profile/${formData.username}`);
      } else {
        navigate(`/profile/${user.username}`);
      }
    } catch (err) {
      setLoading(false);
      console.error('Profile update error:', err);
      console.error('Error response:', err.response?.data);
      
      // Handle specific error cases
      if (err.response?.data?.error?.includes('duplicate') || err.response?.data?.error?.includes('unique')) {
        alert('Username already exists. Please choose a different username.');
      } else {
        alert('Profile update failed: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      
      // Upload avatar immediately
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await axios.put(`/api/users/${user.username}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('Avatar upload response:', response.data);
        
        // Update user context with new avatar
        updateProfile({ avatar: response.data.avatar });
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        alert('Avatar updated successfully!');
      } catch (err) {
        console.error('Avatar upload error:', err);
        alert('Failed to update avatar: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-300 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={() => navigate(`/profile/${user?.username || 'currentuser'}`)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-semibold">Edit profile</h1>
          <Button
            variant="ghost"
            className="text-blue-500 font-semibold"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Done'}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Profile photo section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={avatarPreview || (user?.avatar ? `http://localhost:5001/${user.avatar}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face')}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.username}</h3>
              <Button
                variant="ghost"
                className="text-blue-500 font-semibold p-0 h-auto"
                onClick={handleAvatarChange}
              >
                Change profile photo
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Name
            </label>
            <Input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Name"
            />
            <p className="text-xs text-gray-500 mt-1">
              Help people discover your account by using the name you're known by: either your full name, nickname, or business name.
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Username
            </label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Username"
            />
            <p className="text-xs text-gray-500 mt-1">
              www.instagram.com/{formData.username}
            </p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Website
            </label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Website"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Bio
            </label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full resize-none"
              rows={3}
              maxLength={150}
              placeholder="Bio"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/150
            </p>
          </div>

          {/* Personal information header */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal information</h3>
            <p className="text-sm text-gray-500 mb-4">
              Provide your personal information, even if the account is used for a business, a pet or something else. This won't be part of your public profile.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone number
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Phone number"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Not specified">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Custom">Custom</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This won't be part of your public profile.
            </p>
          </div>

          {/* Submit button for desktop */}
          <div className="hidden lg:block pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? 'Saving...' : 'Submit'}
            </Button>
          </div>
        </form>

        {/* Additional options */}
        <div className="border-t border-gray-200 p-6 space-y-4">
          <Button
            variant="ghost"
            className="w-full text-left justify-start text-blue-500 font-semibold"
          >
            Switch to professional account
          </Button>
          
          <Button
            variant="ghost"
            className="w-full text-left justify-start text-blue-500 font-semibold"
          >
            Personal information settings
          </Button>
        </div>
      </div>
      
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default EditProfile;