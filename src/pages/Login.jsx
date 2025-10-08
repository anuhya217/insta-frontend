import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthGuard';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await axios.post('/api/auth/signin', {
        email: formData.username,
        password: formData.password
      });
      // Save user data and token from backend
      login(res.data.user, res.data.token);
      setLoading(false);
      navigate('/profile/' + res.data.user.username);
    } catch (err) {
      setLoading(false);
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const isFormValid = formData.username && formData.password;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        {/* Main login card */}
        <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 mb-4">
          {/* Instagram logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text">
              Instagram
            </h1>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="username"
                placeholder="Email or Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-2 py-3 text-sm bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-gray-400 focus:ring-0"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-2 py-3 text-sm bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-gray-400 focus:ring-0 pr-10"
              />
              {formData.password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-800"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-2 px-4 rounded text-sm font-semibold ${
                isFormValid && !loading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-gray-500 text-sm font-semibold">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Facebook login */}
          <Button
            variant="ghost"
            className="w-full py-2 text-sm font-semibold text-blue-900 hover:bg-gray-50"
          >
            <span className="mr-2">📘</span>
            Log in with Facebook
          </Button>

          {/* Forgot password */}
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-xs text-blue-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Sign up card */}
        <div className="bg-white border border-gray-300 rounded-lg px-10 py-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Get the app */}
        <div className="text-center mt-4">
          <p className="text-sm mb-4">Get the app.</p>
          <div className="flex justify-center space-x-2">
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
              alt="Download on the App Store"
              className="h-10"
            />
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
              alt="Get it on Google Play"
              className="h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;