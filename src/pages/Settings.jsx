import React from 'react';
import { ArrowLeft, User, Lock, Heart, Bell, Eye, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthGuard';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const settingsItems = [
    {
      category: 'Account',
      items: [
        { icon: User, label: 'Edit profile', action: () => {} },
        { icon: Lock, label: 'Privacy', action: () => {} },
        { icon: Eye, label: 'Close friends', action: () => {} },
        { icon: Bell, label: 'Notifications', action: () => {} },
      ]
    },
    {
      category: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help', action: () => {} },
        { icon: Heart, label: 'About', action: () => {} },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 z-10">
        <div className="flex items-center p-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="dark:text-white dark:hover:bg-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-semibold ml-4 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Profile section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={user?.avatar ? `http://localhost:5001/${user.avatar}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">{user?.username}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">View profile</p>
            </div>
          </div>
        </div>

        {/* Settings sections */}
        {settingsItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold p-4 pb-2 dark:text-white">{section.category}</h2>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Button
                  key={itemIndex}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                  onClick={item.action}
                >
                  <Icon className="h-5 w-5 mr-4 text-gray-600 dark:text-gray-400" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              );
            })}
          </div>
        ))}

        {/* Preferences */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold p-4 pb-2 dark:text-white">Preferences</h2>
          
          <div className="px-4 py-3 flex items-center justify-between dark:text-white">
            <span>Push notifications</span>
            <Switch />
          </div>
          
          <div className="px-4 py-3 flex items-center justify-between dark:text-white">
            <span>Email notifications</span>
            <Switch />
          </div>
          
          <div className="px-4 py-3 flex items-center justify-between dark:text-white">
            <span>Dark mode</span>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </div>

        {/* Logout */}
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut className="h-5 w-5 mr-4" />
            Log out
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2024 Instagram Clone</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;