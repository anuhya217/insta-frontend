import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './AuthGuard';
import axios from 'axios';

const StoriesCarousel = () => {
  const scrollRef = useRef(null);
  const { user, refreshUser } = useAuth();
  const [followedUsers, setFollowedUsers] = useState([]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollLeft -= 300;
    } else {
      current.scrollLeft += 300;
    }
  };

  // Fetch followed users for stories
  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (user?.following && user.following.length > 0) {
        try {
          const promises = user.following.map(async (followId) => {
            const response = await axios.get(`/api/users/${followId}`);
            return {
              id: response.data._id,
              username: response.data.username,
              avatar: response.data.avatar ? `http://localhost:5001/${response.data.avatar}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
              hasNewStory: true, // Assume they have new stories
              isOwnStory: false
            };
          });
          const stories = await Promise.all(promises);
          setFollowedUsers(stories);
        } catch (error) {
          console.error('Error fetching followed users:', error);
        }
      } else {
        setFollowedUsers([]);
      }
    };
    fetchFollowedUsers();
  }, [user?.following]);

  // Create user's own story with their profile image
  const userStory = user ? {
    id: 'user-story',
    username: 'Your Story',
    avatar: user.avatar ? `http://localhost:5001/${user.avatar}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    hasNewStory: false,
    isOwnStory: true
  } : null;

  // Combine user story with followed users
  const allStories = userStory ? [userStory, ...followedUsers] : followedUsers;

  return (
    <div className="relative py-4 px-4">
      {/* Left arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md border dark:border-gray-600 hidden lg:flex items-center justify-center"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Stories container */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allStories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-1 min-w-[66px] cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full p-0.5 ${story.hasNewStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' : story.isOwnStory ? 'bg-gray-300 dark:bg-gray-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-700 overflow-hidden relative">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full object-cover"
                />
                {story.isOwnStory && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-center text-gray-900 dark:text-gray-100 truncate w-full">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md border dark:border-gray-600 hidden lg:flex items-center justify-center"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StoriesCarousel;