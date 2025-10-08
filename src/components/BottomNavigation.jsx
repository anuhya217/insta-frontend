import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './AuthGuard';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/create', icon: PlusSquare, label: 'Create' },
    { path: '/notifications', icon: Heart, label: 'Notifications' },
    { path: `/profile/${user?.username || 'currentuser'}`, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around py-2 h-[50px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full h-full p-2 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'fill-current' : ''}`} />
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;