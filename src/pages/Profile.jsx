import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Grid, Bookmark, MoreHorizontal, LogOut, Video, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../components/AuthGuard';
import PostCard from '../components/PostCard';
import FollowersModal from '../components/FollowersModal';
import axios from 'axios';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [mutualFollowers, setMutualFollowers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const isOwnProfile = username === user?.username;
  const displayUser = profileUser || (isOwnProfile ? user : null);

  const safeUserPosts = Array.isArray(userPosts) ? userPosts : [];
  const safeSavedPosts = Array.isArray(savedPosts) ? savedPosts : [];
  const safeMutualFollowers = Array.isArray(mutualFollowers) ? mutualFollowers : [];
  const safeSuggestedUsers = Array.isArray(suggestedUsers) ? suggestedUsers : [];

  const photoPosts = safeUserPosts.filter(post => (post.postType || (post.video ? 'reel' : 'photo')) === 'photo');
  const reelPosts = safeUserPosts.filter(post => (post.postType || (post.video ? 'reel' : 'photo')) === 'reel');

  // Fetch profile user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const idOrUsername = isOwnProfile ? user?.username : username;
        if (idOrUsername) {
          const res = await axios.get(`/api/users/${idOrUsername}`);
          setProfileUser(res.data);
        }
      } catch {
        setProfileUser(isOwnProfile && user ? user : null);
      }
    };
    fetchUser();
  }, [username, user, isOwnProfile]);

  // Fetch posts
  useEffect(() => {
    if (displayUser?._id) {
      axios.get(`/api/posts/user/${displayUser._id}`)
        .then(res => setUserPosts(res.data || []))
        .catch(() => setUserPosts([]));
    }
  }, [displayUser]);

  // Check follow status
  useEffect(() => {
    if (displayUser && user && !isOwnProfile) {
      const following = user.following || [];
      setIsFollowing(following.some(f => f._id?.toString() === displayUser._id || f.toString() === displayUser._id));
    }
  }, [displayUser, user, isOwnProfile]);

  // Fetch mutual followers
  useEffect(() => {
    const fetchMutual = async () => {
      if (!user || !displayUser || isOwnProfile) return;
      try {
        const res = await axios.get(`/api/users/${displayUser._id}/mutual/${user._id}`);
        setMutualFollowers(Array.isArray(res.data) ? res.data : []);
      } catch {
        setMutualFollowers([]);
      }
    };
    fetchMutual();
  }, [displayUser, user]);

  // Fetch suggested users
  useEffect(() => {
    if (isOwnProfile && user?._id) {
      axios.get(`/api/users/suggested/${user._id}`)
        .then(res => setSuggestedUsers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setSuggestedUsers([]));
    }
  }, [isOwnProfile, user]);

  const handleFollow = async () => {
    if (!user || !displayUser || isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      if (isFollowing) await axios.post(`/api/users/${displayUser._id}/unfollow`, { followerId: user._id });
      else await axios.post(`/api/users/${displayUser._id}/follow`, { followerId: user._id });

      setIsFollowing(!isFollowing);
      await refreshUser();
      const res = await axios.get(`/api/users/${displayUser.username}`);
      setProfileUser(res.data);
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
    } catch (err) {
      console.error('Error following/unfollowing user:', err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Fetch saved posts
  useEffect(() => {
    if (isOwnProfile && user?._id) {
      axios.get(`/api/posts/saved/${user._id}`)
        .then(res => setSavedPosts(Array.isArray(res.data) ? res.data : []))
        .catch(() => setSavedPosts([]));
    }
  }, [isOwnProfile, user?._id]);

  const handleLike = async (postId, isLiking) => {
    try {
      if (!user?._id) return alert('Please log in again.');
      if (isLiking) await axios.post(`/api/posts/${postId}/like`, { userId: user._id });
      else await axios.delete(`/api/posts/${postId}/like`, { data: { userId: user._id } });

      if (displayUser?._id) {
        const res = await axios.get(`/api/posts/user/${displayUser._id}`);
        setUserPosts(res.data || []);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to update like');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 lg:border-none">
        <div className="p-4 lg:p-8">
          <div className="flex items-start space-x-4 lg:space-x-8">
            <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={displayUser?.avatar ? `http://localhost:5001/${displayUser.avatar}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                alt={displayUser?.username}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-xl lg:text-2xl font-light dark:text-white">{displayUser?.username}</h1>
                {isOwnProfile ? (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')}>Edit profile</Button>
                    <Button variant="outline" size="sm" onClick={() => navigate('/settings')}><Settings className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }} className="text-red-600 hover:text-red-700"><LogOut className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant={isFollowing ? 'outline' : 'default'}
                      size="sm"
                      onClick={handleFollow}
                      disabled={isFollowLoading}
                      className={isFollowing ? '' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                    >
                      {isFollowLoading
                        ? '...'
                        : isFollowing
                        ? 'Following'
                        : safeMutualFollowers.length > 0
                        ? 'Follow back'
                        : 'Follow'}
                    </Button>
                    <Button variant="outline" size="sm">Message</Button>
                    <Button variant="outline" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-8 mb-4">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-semibold dark:text-white">{safeUserPosts.length}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">posts</span>
                </div>
                <div className="flex flex-col items-center lg:items-start cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setShowFollowersModal(true)}>
                  <span className="font-semibold dark:text-white">{displayUser?.followers?.length || 0}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">followers</span>
                </div>
                <div className="flex flex-col items-center lg:items-start cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setShowFollowingModal(true)}>
                 
