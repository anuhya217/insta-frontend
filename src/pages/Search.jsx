import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../components/AuthGuard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { mockUsers } from '../data/mockData'; // ✅ import mock users

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load query from URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearchWithQuery(query);
    }
  }, [searchParams]);

  const handleSearchWithQuery = async (query) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    try {
      // Try real API first
      const response = await axios.get(`/api/users/search/${encodeURIComponent(query.trim())}`);
      setSearchResults(response.data);
    } catch (error) {
      console.warn('⚠️ API not found — using mock users instead.');
      // Fallback to mock data
      const results = mockUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.displayName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
    handleSearchWithQuery(searchQuery.trim());
  };

  const handleUserClick = (username) => navigate(`/profile/${username}`);

  const handleMessageUser = (username) => navigate(`/messages?username=${username}`);

  const handleFollow = async (userId, isCurrentlyFollowing) => {
    if (!user) return;

    try {
      if (isCurrentlyFollowing) {
        await axios.post(`/api/users/${userId}/unfollow`, { followerId: user._id });
      } else {
        await axios.post(`/api/users/${userId}/follow`, { followerId: user._id });
      }
      await refreshUser();
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
      setSearchResults((prev) =>
        prev.map((r) =>
          r._id === userId
            ? {
                ...r,
                followers: isCurrentlyFollowing
                  ? r.followers.filter((f) => f.toString() !== user._id)
                  : [...(r.followers || []), user._id],
              }
            : r
        )
      );
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const isFollowing = (userId) => {
    if (!user?.following) return false;
    return user.following.some((f) => f.toString() === userId || f._id?.toString() === userId);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search</h1>
        <p className="text-gray-600 dark:text-gray-400">Find people and accounts</p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <Button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {/* Results */}
      {hasSearched && (
        <div>
          {isSearching ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Found {searchResults.length} account{searchResults.length !== 1 ? 's' : ''}
              </h2>
              {searchResults.map((userResult) => (
                <div
                  key={userResult.id || userResult._id}
                  onClick={() => handleUserClick(userResult.username)}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={userResult.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                      alt={userResult.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {userResult.displayName || userResult.username}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                      @{userResult.username}
                    </p>
                    {userResult.bio && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {userResult.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageUser(userResult.username);
                      }}
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant={isFollowing(userResult.id) ? 'outline' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(userResult.id, isFollowing(userResult.id));
                      }}
                      className={isFollowing(userResult.id) ? '' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                    >
                      {isFollowing(userResult.id) ? (
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SearchIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No accounts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching with a different username or display name
              </p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Search for accounts
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a username or display name to find accounts
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
