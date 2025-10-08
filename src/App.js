import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthGuard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PostProvider } from "./contexts/PostContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditProfile from "./pages/EditProfile";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Layout>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Redirect root */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
        }
      />
      {/* Protected routes */}
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PostProvider>
          <BrowserRouter>
            <div className="App">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
