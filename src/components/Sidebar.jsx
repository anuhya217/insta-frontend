import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Compass, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  User, 
  Menu,
  Settings,
  Bookmark,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './AuthGuard';
import axios from 'axios';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/notifications', icon: Heart, label: 'Notifications', badge: unreadCount },
    { path: '/create', icon: PlusSquare, label: 'Create' },
    { path: `/profile/${user?.username || 'currentuser'}`, icon: User, label: 'Profile' },
  ];

  const moreItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/activity', icon: Clock, label: 'Your activity' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <Link to="/" className="mb-8 mt-4">
          {collapsed ? (
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-lg"></div>
          ) : (
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text">
              Instagram
            </div>
          )}
        </Link>

        {/* Main Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-3 h-auto relative ${isActive ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} dark:text-white`}
                    >
                      <Icon className={`h-6 w-6 ${collapsed ? '' : 'mr-4'} ${isActive ? 'fill-current' : ''}`} />
                      {!collapsed && <span className="text-base">{item.label}</span>}
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
            
            {/* More button */}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => setShowMore(!showMore)}
              >
                <Menu className={`h-6 w-6 ${collapsed ? '' : 'mr-4'}`} />
                {!collapsed && <span className="text-base">More</span>}
              </Button>
            </li>
          </ul>
        </nav>

        {/* Toggle button */}
        <Button
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="mt-auto p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* More menu */}
      {showMore && !collapsed && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="p-2">
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
                    onClick={() => setShowMore(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;