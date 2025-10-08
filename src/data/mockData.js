// src/data/mockData.jsx

// ======================
// Mock User Accounts
// ======================
export const mockUsers = [
  {
    id: 1,
    username: "ajad",
    displayName: "Ajad Ahmed",
    avatar: "/images/anu1.jpg",
    bio: "Tech lover 💻 | Explorer 🌍",
  },
  {
    id: 2,
    username: "suha",
    displayName: "Suharika",
    avatar: "/images/anu2.jpg",
    bio: "Coffee ☕ | Art 🎨 | Life ❤️",
  },
  {
    id: 3,
    username: "anu",
    displayName: "Anuhya",
    avatar: "/images/anu3.jpg",
    bio: "Smile more 🌸 | Creator 📸",
  },
  {
    id: 4,
    username: "gt",
    displayName: "Tharun GT",
    avatar: "/images/anu4.jpg",
    bio: "Traveller 🚗 | Music 🎧",
  },
  {
    id: 4,
    username: "divya",
    displayName: "divya",
    avatar: "/images/anu9.jpg",
    bio: "Traveller 🚗 | Music 🎧",
  },

];

// ======================
// Mock Stories
// ======================
export const mockStories = mockUsers.map((user, i) => ({
  id: i + 1,
  username: user.username,
  avatar: user.avatar,
  hasNewStory: i % 2 === 0, // every alternate user has a new story
}));

// ======================
// Mock Posts
// ======================
export let mockPosts = [
  
    {
    id: 1,
    username: "keerthi",
    userAvatar: "/images/anu10.jpg",
    imageUrl: "/images/anu10.jpg",
    location: "ANITS",
    likes: 112,
    caption: "Having fun! with class 🎉 #batch",
    timeAgo: "5h",
    comments: [],
  },
  {
    id: 2,
    username: "divya",
    userAvatar: "/images/anu9.jpg",
    imageUrl: "/images/anu9.jpg",
    location: "beach",
    likes: 112,
    caption: "Having fun! 🎉 #batch",
    timeAgo: "5h",
    comments: [],
  },
  
  
  {
    id: 3,
    username: "anu",
    userAvatar: "/images/anu3.jpg",
    imageUrl: "/images/anu3.jpg",
    location: "Cafe",
    likes: 89,
    caption: "Love this view ☕💛",
    timeAgo: "3h",
    comments: [{ username: "ajad", text: "Vibes 🔥" }],
  },
  {
    id: 4,
    username: "gt",
    userAvatar: "/images/anu4.jpg",
    imageUrl: "/images/anu4.jpg",
    location: "Park",
    likes: 112,
    caption: "Having fun! 🎉 #batch",
    timeAgo: "5h",
    comments: [],
  },
  {
    id: 5,
    username: "suha",
    userAvatar: "/images/anu2.jpg",
    imageUrl: "/images/anu2.jpg",
    location: "City",
    likes: 56,
    caption: "Trio 😎 #friends",
    timeAgo: "1d",
    comments: [],
  },
  
  {
    id: 6,
    username: "ajad",
    userAvatar: "/images/anu1.jpg",
    imageUrl: "/images/anu1.jpg",
    location: "Beach",
    likes: 123,
    caption: "Happie bday Anuhya 🎂 #beach #sunset",
    timeAgo: "2h",
    comments: [
      { username: "suha", text: "Nice pic!" },
      { username: "anu", text: "Wow amazing!" },
    ],
  },
  {
    id: 5,
    username: "srilakshmi",
    userAvatar: "/images/anu5.jpg",
    imageUrl: "/images/anu5.jpg",
    location: "beach",
    likes: 999,
    caption: "new frnds 🎉 #batch",
    timeAgo: "5h",
    comments: [],
  },
  {
    id: 6,
    username: "rahul",
    userAvatar: "/images/anu11.png.jpg",
    imageUrl: "/images/anu11.jpg",
    location: "City",
    likes: 105,
    caption: "beach time",
    timeAgo: "1d",
    comments: [],
  },
  {
    id: 7,
    username: "manusha",
    userAvatar: "/images/anu13.jpg",
    imageUrl: "/images/anu13.jpg",
    location: "City",
    likes: 56,
    caption:"self love",
    timeAgo: "1d",
    comments: [],
  },
  {
    id: 8,
    username: "praveen",
    userAvatar: "/images/anu12.jpg",
    imageUrl: "/images/anu12.jpg",
    location: "City",
    likes: 86,
    caption: "enjoying life",
    timeAgo: "1d",
    comments: [],
  },
  
  
  

];

// ======================
// Add new mock post
// ======================
export const addMockPost = (newPost) => {
  mockPosts.unshift(newPost);
};

// ======================
// Mock Explore Photos
// ======================
export const mockExplorePhotos = [
  "/images/anu1.jpg",
  "/images/anu2.jpg",
  "/images/anu3.jpg",
  "/images/anu4.jpg",
];

// ======================
// Mock User Profile
// ======================
export const mockUserProfile = {
  username: "anu",
  displayName: "Anuhya",
  bio: "Digital creator & photographer 📸",
  avatar: "/images/anu3.jpg",
  posts: 4,
  followers: 1234,
  following: 456,
  website: "https://example.com",
  userPosts: [
    "/images/anu1.jpg",
    "/images/anu2.jpg",
    "/images/anu3.jpg",
    "/images/anu4.jpg",
  ],
};

// ======================
// Mock Messages
// ======================
export const mockConversations = [
  {
    id: 1,
    user: mockUsers[1], // Suha
    lastMessage: { text: "osey akhil ni chusava", createdAt: "2025-10-03T12:00:00Z" },
    unreadCount: 1,
  },
  {
    id: 2,
    user: mockUsers[3], // GT
    lastMessage: { text: "em dhesthunav", createdAt: "2025-10-02T16:30:00Z" },
    unreadCount: 0,
  },
  {
    id: 3,
    user: mockUsers[4], // GT
    lastMessage: { text: "em dhesthunav", createdAt: "2025-10-02T16:30:00Z" },
    unreadCount: 0,
  },
];

export const mockMessages = [
  {
    id: 101,
    conversationId: 1,
    sender: "suha",
    text: "akhil ni chusava",
    createdAt: "2025-10-03T12:00:00Z",
  },
  {
    id: 102,
    conversationId: 1,
    sender: "you",
    text: "ledhu",
    createdAt: "2025-10-03T12:05:00Z",
  },
  {
    id: 103,
    conversationId: 2,
    sender: "gt",
    text: "em chesthunav",
    createdAt: "2025-10-02T16:30:00Z",
  },
];
