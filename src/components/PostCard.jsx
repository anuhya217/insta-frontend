import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Edit, Trash2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './AuthGuard';
import { Link } from 'react-router-dom';

const PostCard = ({ post, onEdit, onDelete, onSave, onAddComment, onLike }) => {
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const { user } = useAuth();
  
  // Check if current user has liked this post
  const liked = user && post.likes && post.likes.some(likeId => 
    likeId.toString() === user._id || likeId._id?.toString() === user._id
  );

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    try {
      if (onLike) {
        await onLike(post._id, !liked);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDoubleClick = () => {
    const postType = post.postType || (post.video ? 'reel' : 'photo');
    if (postType === 'reel') {
      toggleVideoPlay();
    } else if (!liked) {
      handleLike();
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      // Ensure video is not muted when it loads
      videoRef.current.muted = false;
      setIsMuted(false);
      console.log('Video loaded, muted state:', videoRef.current.muted);
    }
  };

  const handleVideoPlay = () => {
    // Ensure video is not muted when it starts playing
    if (videoRef.current) {
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
        console.log('Playing video with sound, muted state:', videoRef.current.muted);
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
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

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave(post._id, !saved);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      if (onDelete) {
        onDelete(post._id);
      }
    }
    setShowOptions(false);
  };

  const isOwner = user && post.user && (user._id === post.user._id || user.username === post.user.username);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      if (onAddComment) {
        await onAddComment(post._id, commentText.trim());
        setCommentText('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  };

  return (
    <article className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 lg:border lg:rounded-lg lg:mb-6">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user?.username}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
              <img
                src={post.user?.avatar ? `http://localhost:5001/${post.user.avatar}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                alt={post.user?.username}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div>
            <Link 
              to={`/profile/${post.user?.username}`}
              className="font-semibold text-sm hover:text-gray-600 transition-colors"
            >
              {post.user?.username}
            </Link>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          
          {showOptions && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left px-3 py-2 text-sm"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left px-3 py-2 text-sm text-red-600 hover:text-red-700"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left px-3 py-2 text-sm"
                onClick={handleSave}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {saved ? 'Unsave' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Media */}
      <div className={`relative ${(() => {
        const postType = post.postType || (post.video ? 'reel' : 'photo');
        return postType === 'reel' ? 'aspect-[9/16]' : 'aspect-square';
      })()} bg-gray-100`} onDoubleClick={handleDoubleClick}>
        {(() => {
          const postType = post.postType || (post.video ? 'reel' : 'photo');
          return postType === 'reel' ? (
          <div className="relative w-full h-full group">
            <video
              ref={videoRef}
              src={post.video ? `http://localhost:5001/${post.video}` : ''}
              className="w-full h-full object-cover cursor-pointer"
              onLoadedMetadata={handleVideoLoad}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnd}
              onPlay={handleVideoPlay}
              onClick={toggleVideoPlay}
              muted={isMuted}
              loop
              playsInline
              controls={false}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
                onClick={toggleVideoPlay}
              >
                {isVideoPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            </div>

            {/* Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between text-white text-sm mb-2">
                <span>{formatTime(videoCurrentTime)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-semibold">
              REEL
            </div>
          </div>
        ) : (
          <>
            <img
              src={post.photo ? `http://localhost:5001/${post.photo}` : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'}
              alt="Post"
              className="w-full h-full object-cover"
            />
            {/* Double tap heart animation */}
            {liked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart className="h-20 w-20 text-white fill-current animate-ping" />
              </div>
            )}
          </>
          );
        })()}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:opacity-50 transition-opacity disabled:opacity-50"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : 'text-black'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:opacity-50 transition-opacity"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:opacity-50 transition-opacity"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:opacity-50 transition-opacity"
          onClick={() => setSaved(!saved)}
        >
          <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Likes */}
      <div className="px-4 pb-2">
        <p className="font-semibold text-sm">
          {post.likes?.length || 0} likes
        </p>
      </div>

      {/* Caption */}
      <div className="px-4 pb-2">
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.user?.username}</span>
          {post.caption}
        </p>
      </div>

      {/* Comments */}
      <div className="px-4 pb-2">
        {post.comments?.length > 0 && (
          <Button
            variant="ghost"
            className="p-0 h-auto text-sm text-gray-500 hover:bg-transparent"
            onClick={() => setShowComments(!showComments)}
          >
            View all {post.comments.length} comments
          </Button>
        )}
        
        {showComments && post.comments && (
          <div className="mt-2 space-y-1">
            {post.comments.slice(0, 3).map((comment, index) => (
              <p key={index} className="text-sm">
                <span className="font-semibold mr-2">{comment.user?.username || 'Unknown'}</span>
                {comment.text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Time */}
      <div className="px-4 pb-4">
        <p className="text-xs text-gray-500 uppercase">{getTimeAgo(post.createdAt)}</p>
      </div>

      {/* Add comment */}
      <div className="border-t border-gray-300 px-4 py-3">
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm border-none outline-none bg-transparent"
            disabled={isSubmittingComment}
          />
          <Button
            type="submit"
            variant="ghost"
            className="p-0 h-auto text-sm font-semibold text-blue-500 hover:bg-transparent disabled:opacity-50"
            disabled={!commentText.trim() || isSubmittingComment}
          >
            {isSubmittingComment ? 'Posting...' : 'Post'}
          </Button>
        </form>
      </div>
    </article>
  );
};

export default PostCard;