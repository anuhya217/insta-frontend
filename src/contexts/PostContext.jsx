import React, { createContext, useState, useContext } from 'react';
import { mockPosts } from '@/data/mockData';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(mockPosts);

  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
