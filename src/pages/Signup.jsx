// Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthGuard';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Use full backend URL (important for Render)
      const API = "https://insta-backend-0tuv.onrender.com";

      // ✅ Signup
      await axios.post(`${API}/api/auth/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bio: "Welcome to my Instagram! 👋"
      });

      // ✅ Login immediately after signup
      const loginRes = await axios.post(`${API}/api/auth/signin`, {
        email: formData.email,
        password: formData.password
      });

      login(loginRes.data.user);
      navigate('/profile/' + loginRes.data.user.username);
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.fullName && formData.username && formData.password;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 mb-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text">
              Instagram
            </h1>
            <p className="text-gray-500 text-sm mt-4 font-semibold leading-5">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            <Input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
            <Input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />

            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-2 px-4 rounded text-sm font-semibold ${
                isFormValid && !loading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg px-10 py-6 text-center">
          <p className="text-sm">
            Have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
