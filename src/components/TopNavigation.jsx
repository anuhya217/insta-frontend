import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, PlusSquare, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from './AuthGuard';
import axios from 'axios';

const TopNavigation = ({ searchFocused, setSearchFocused }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const fetchUnreadCount = async () => {
    if (user?._id) {
      try {
        const response = await axios.get(`/api/notifications/${user._id}/unread-count`);
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [user?._id]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchUnreadCount();
    };
    
    window.addEventListener('refreshNotifications', handleRefresh);
    return () => window.removeEventListener('refreshNotifications', handleRefresh);
  }, [user?._id]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 z-50 lg:hidden">
      <div className="flex items-center justify-between px-4 py-2 h-[60px]">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <div className="text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text">
            Instagram
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xs mx-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-gray-300 dark:text-white"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </form>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 relative"
            onClick={() => navigate('/notifications')}
          >
            <Heart className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => navigate('/messages')}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-4 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 mt-2">
          <div className="p-4">
            <h3 className="font-semibold mb-3 dark:text-white">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">john_doe</span> liked your photo.
                  </p>
                  <p className="text-xs text-gray-500">2h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">jane_smith</span> started following you.
                  </p>
                  <p className="text-xs text-gray-500">5h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavigation;