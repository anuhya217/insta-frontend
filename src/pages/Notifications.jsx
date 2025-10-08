import React, { useState, useEffect } from 'react';
import { Heart, UserPlus, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../components/AuthGuard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { mockUsers, mockPosts } from '../data/mockData';

// Update mockUsers avatars to match your screenshots
const updatedMockUsers = [
  { ...mockUsers[0], avatar: "/images/anu1.jpg" },
  { ...mockUsers[1], avatar: "/images/anu2.jpg" },
  { ...mockUsers[2], avatar: "/images/anu3.jpg" },
  { ...mockUsers[3], avatar: "/images/anu4.jpg" },
  { ...mockUsers[4], avatar: "/images/anu9.jpg" },
];

// 5 mock notifications
export const mockNotifications = [
  { _id: '1', type: 'like', read: false, createdAt: new Date().toISOString(), from: updatedMockUsers[0], post: mockPosts[0] },
  { _id: '2', type: 'comment', read: false, createdAt: new Date().toISOString(), from: updatedMockUsers[1], post: mockPosts[1] },
  { _id: '3', type: 'follow', read: true, createdAt: new Date().toISOString(), from: updatedMockUsers[2] },
  { _id: '4', type: 'message', read: false, createdAt: new Date().toISOString(), from: updatedMockUsers[3] },
  { _id: '5', type: 'like', read: true, createdAt: new Date().toISOString(), from: updatedMockUsers[4], post: mockPosts[4] },
];

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?._id) fetchNotifications();
    else {
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
    }
  }, [user?._id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/notifications/${user._id}`);
      const data = response.data.length ? response.data : mockNotifications;
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="h-5 w-5 text-red-500" />;
      case 'follow': return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'comment': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'message': return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default: return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationText = ({ from, type }) => {
    const username = from?.username || 'Someone';
    switch (type) {
      case 'like': return `${username} liked your post`;
      case 'follow': return `${username} started following you`;
      case 'comment': return `${username} commented on your post`;
      case 'message': return `${username} sent you a message`;
      default: return 'New notification';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification._id);

    if (notification.type === 'follow') navigate(`/profile/${notification.from?.username}`);
    else if (notification.type === 'message') navigate(`/messages?user=${notification.from?._id}&username=${notification.from?.username}`);
    else if (notification.post?._id) navigate(`/post/${notification.post._id}`);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 2592000)}mo ago`;
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto p-4 flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer transition-colors border-l-4 ${
                notification.read
                  ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-transparent'
                  : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-l-blue-500'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={notification.from?.avatar || `https://ui-avatars.com/api/?name=${notification.from?.username || 'User'}&background=random`}
                    alt={notification.from?.username || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-900 dark:text-white">{getNotificationText(notification)}</p>
                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
              </div>

              {notification.post && (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={notification.post.photo || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            When someone likes your post or follows you, you'll see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
