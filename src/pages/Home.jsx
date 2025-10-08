import React, { useState, useEffect } from "react";
import { mockPosts } from "../data/mockData";
import Stories from "../components/Stories";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Button } from "../components/ui/button";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load mock posts
    setPosts([...mockPosts]);
  }, []);

  // ---- Like Handler ----
  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // ---- Save Handler ----
  const handleSave = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  // ---- Add Comment ----
  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { username: "you", text: commentText },
              ],
            }
          : post
      )
    );
  };

  return (
    <div className="max-w-lg mx-auto pt-2 pb-20">
      {/* ✅ Stories section */}
      <Stories />

      {/* ✅ Posts section */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mb-6"
        >
          {/* Post header */}
          <div className="flex items-center p-3">
            <img
              src={post.userAvatar}
              alt={post.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold dark:text-white">{post.username}</p>
              <p className="text-sm text-gray-500">{post.location}</p>
            </div>
          </div>

          {/* Post image */}
          <img
            src={post.imageUrl}
            alt=""
            className="w-full object-cover cursor-pointer"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between px-3 pt-2">
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:opacity-60"
                onClick={() => handleLike(post.id)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    post.liked ? "fill-red-500 text-red-500" : "text-black"
                  }`}
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:opacity-60"
                onClick={() =>
                  alert(`Comment feature for ${post.username} coming soon!`)
                }
              >
                <MessageCircle className="h-6 w-6 text-black" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:opacity-60"
                onClick={() =>
                  alert(`Share feature for ${post.username} coming soon!`)
                }
              >
                <Send className="h-6 w-6 text-black" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="p-0 hover:opacity-60"
              onClick={() => handleSave(post.id)}
            >
              <Bookmark
                className={`h-6 w-6 ${
                  post.saved ? "fill-black text-black" : "text-black"
                }`}
              />
            </Button>
          </div>

          {/* Likes and caption */}
          <div className="p-3">
            <p className="text-sm font-semibold dark:text-white">
              {post.likes} likes
            </p>
            <p className="dark:text-white">
              <span className="font-semibold">{post.username} </span>
              {post.caption}
            </p>
            <p className="text-xs text-gray-500 mt-1">{post.timeAgo}</p>
          </div>

          {/* Comments */}
          <div className="px-3 pb-2">
            {post.comments.map((comment, i) => (
              <p key={i} className="text-sm dark:text-white">
                <span className="font-semibold">{comment.username} </span>
                {comment.text}
              </p>
            ))}
          </div>

          {/* Add comment input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment(post.id, e.target.comment.value);
                e.target.reset();
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                name="comment"
                placeholder="Add a comment..."
                className="flex-1 text-sm border-none outline-none bg-transparent dark:text-white"
              />
              <button
                type="submit"
                className="text-blue-500 text-sm font-semibold hover:opacity-70"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
