import React, { useState, useEffect } from 'react';
import { X, User, UserPlus, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from './AuthGuard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FollowersModal = ({ isOpen, onClose, userId, type = 'followers' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const userData = response.data;
      const userIds = type === 'followers' ? userData.followers : userData.following;
      
      if (userIds && userIds.length > 0) {
        const promises = userIds.map(async (id) => {
          const userResponse = await axios.get(`/api/users/${id}`);
          return userResponse.data;
        });
        const usersData = await Promise.all(promises);
        setUsers(usersData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId, isCurrentlyFollowing) => {
    if (!user) return;
    
    try {
      if (isCurrentlyFollowing) {
        await axios.post(`/api/users/${targetUserId}/unfollow`, {
          followerId: user._id
        });
      } else {
        await axios.post(`/api/users/${targetUserId}/follow`, {
          followerId: user._id
        });
      }
      
      // Refresh current user's data
      await refreshUser();
      
      // Update the users list to reflect follow status
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === targetUserId 
            ? { 
                ...u, 
                followers: isCurrentlyFollowing 
                  ? u.followers.filter(f => f.toString() !== user._id)
                  : [...(u.followers || []), user._id]
              }
            : u
        )
      );
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const isFollowing = (targetUserId) => {
    if (!user?.following) return false;
    return user.following.some(followId => 
      followId.toString() === targetUserId || followId._id?.toString() === targetUserId
    );
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            {type === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((userData) => (
                <div
                  key={userData._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div 
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => handleUserClick(userData.username)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={userData.avatar ? `http://localhost:5001/${userData.avatar}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                        alt={userData.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {userData.displayName || userData.username}
                      </h3>
                      <p className="text-gray-500 text-sm truncate">
                        @{userData.username}
                      </p>
                    </div>
                  </div>
                  
                  {user && user._id !== userData._id && (
                    <Button
                      size="sm"
                      variant={isFollowing(userData._id) ? "outline" : "default"}
                      onClick={() => handleFollow(userData._id, isFollowing(userData._id))}
                      className={isFollowing(userData._id) ? "" : "bg-blue-500 hover:bg-blue-600 text-white"}
                    >
                      {isFollowing(userData._id) ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {type} yet
              </h3>
              <p className="text-gray-600">
                {type === 'followers' 
                  ? 'This user doesn\'t have any followers yet.' 
                  : 'This user isn\'t following anyone yet.'
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;
