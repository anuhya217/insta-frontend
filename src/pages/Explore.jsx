import React, { useState, useEffect, useRef } from 'react';
import { Search, Video, Image, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { mockExplorePhotos } from '../data/mockData';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../components/AuthGuard';

const Explore = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, photos, reels
  const [selectedPost, setSelectedPost] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Determine post type based on available fields if postType is not set
    const postType = post.postType || (post.video ? 'reel' : 'photo');
    console.log('Explore filtering post:', {
      id: post._id,
      postType: post.postType,
      hasVideo: !!post.video,
      hasPhoto: !!post.photo,
      detectedType: postType,
      activeTab: activeTab
    });
    if (activeTab === 'photos') return postType === 'photo';
    if (activeTab === 'reels') return postType === 'reel';
    return true; // all
  });

  console.log('Explore posts:', {
    total: posts.length,
    filtered: filteredPosts.length,
    activeTab: activeTab
  });

  const handleLike = async (postId, isLiked) => {
    try {
      if (!user?._id) {
        alert('User not found. Please log in again.');
        return;
      }
      
      if (isLiked) {
        await axios.post(`/api/posts/${postId}/like`, { userId: user._id });
      } else {
        await axios.delete(`/api/posts/${postId}/like`, { data: { userId: user._id } });
      }
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like');
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      if (!user?._id) {
        alert('User not found. Please log in again.');
        return;
      }
      
      await axios.post(`/api/posts/${postId}/comment`, {
        userId: user._id,
        text
      });
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleSave = async (postId, isSaved) => {
    try {
      if (!user?._id) {
        alert('User not found. Please log in again.');
        return;
      }
      
      if (isSaved) {
        await axios.post(`/api/posts/${postId}/save`, { userId: user._id });
      } else {
        await axios.delete(`/api/posts/${postId}/save`, { data: { userId: user._id } });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to save post');
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsVideoPlaying(false);
    setIsMuted(false);
    // Reset video state when opening modal
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      // Ensure video is not muted when it loads
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleVideoPlay = () => {
    // Ensure video is not muted when it starts playing
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        // Ensure video is not muted when user plays it
        videoRef.current.muted = false;
        setIsMuted(false);
        console.log('Explore - Playing video with sound, muted state:', videoRef.current.muted);
        videoRef.current.play().catch(err => {
          console.error('Explore - Error playing video:', err);
        });
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No posts found. Create your first post!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search bar */}
      <div className="p-4 bg-white border-b border-gray-300 lg:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-100 border-none rounded-lg focus:bg-white focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 bg-white">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'all' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${
            activeTab === 'photos' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('photos')}
        >
          <Image className="h-4 w-4" />
          Photos
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${
            activeTab === 'reels' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('reels')}
        >
          <Video className="h-4 w-4" />
          Reels
        </button>
      </div>


      {/* Posts Grid/List */}
      {activeTab === 'all' ? (
        <div className="space-y-0">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onAddComment={handleAddComment}
              onSave={handleSave}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 lg:gap-4 lg:p-4">
          {filteredPosts.map((post) => {
            const postType = post.postType || (post.video ? 'reel' : 'photo');
            return (
            <div
              key={post._id}
              className={`${postType === 'reel' ? 'aspect-[9/16]' : 'aspect-square'} bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity relative`}
              onClick={() => handlePostClick(post)}
            >
              {postType === 'reel' ? (
                <div className="relative w-full h-full group">
                  <video
                    src={post.video ? `http://localhost:5001/${post.video}` : ''}
                    className="w-full h-full object-cover cursor-pointer"
                    muted={false}
                    loop
                    playsInline
                    controls={false}
                    onMouseEnter={(e) => {
                      e.target.muted = false;
                      e.target.play();
                    }}
                    onMouseLeave={(e) => e.target.pause()}
                    onClick={() => handlePostClick(post)}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-semibold">
                    REEL
                  </div>
                  <div className="absolute bottom-2 left-2 text-white text-sm">
                    <Video className="h-4 w-4 inline mr-1" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <img
                  src={post.photo ? `http://localhost:5001/${post.photo}` : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* Full-screen Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="lg"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
              onClick={handleCloseModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Content */}
            <div className="w-full h-full flex items-center justify-center">
              {(() => {
                const postType = selectedPost.postType || (selectedPost.video ? 'reel' : 'photo');
                return postType === 'reel' ? (
                <div className="relative w-full max-w-md mx-auto">
                  <video
                    ref={videoRef}
                    src={selectedPost.video ? `http://localhost:5001/${selectedPost.video}` : ''}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    onLoadedMetadata={handleVideoLoad}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={handleVideoEnd}
                    onPlay={handleVideoPlay}
                    onClick={toggleVideoPlay}
                    muted={isMuted}
                    loop
                    autoPlay
                    playsInline
                    controls={false}
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-lg">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                      onClick={toggleVideoPlay}
                    >
                      {isVideoPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
                    </Button>
                  </div>

                  {/* Video Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span>{formatTime(videoCurrentTime)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <span>{formatTime(videoDuration)}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-100"
                        style={{ width: `${(videoCurrentTime / videoDuration) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Reel indicator */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-semibold">
                    REEL
                  </div>
                </div>
                ) : (
                  <div className="max-w-4xl max-h-full">
                    <img
                      src={selectedPost.photo ? `http://localhost:5001/${selectedPost.photo}` : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'}
                      alt="Post"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;