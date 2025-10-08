import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthGuard';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
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
      const form = new FormData();
      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('bio', `Welcome to my Instagram! 👋`);
      // Add avatar upload if needed
      const res = await axios.post('/api/auth/signup', form);
      // After signup, login with the new user
      const loginRes = await axios.post('/api/auth/signin', {
        email: formData.email,
        password: formData.password
      });
      login(loginRes.data.user);
      setLoading(false);
      navigate('/profile/' + loginRes.data.user.username);
    } catch (err) {
      setLoading(false);
      alert('Signup failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const isFormValid = formData.email && formData.fullName && formData.username && formData.password;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        {/* Main signup card */}
        <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 mb-4">
          {/* Instagram logo */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text">
              Instagram
            </h1>
            <p className="text-gray-500 text-sm mt-4 font-semibold leading-5">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          {/* Facebook signup */}
          <Button
            variant="default"
            className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold"
          >
            <span className="mr-2">📘</span>
            Log in with Facebook
          </Button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-gray-500 text-sm font-semibold">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-2 py-3 text-sm bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-gray-400 focus:ring-0"
              />
            </div>

            <div>
              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-2 py-3 text-sm bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-gray-400 focus:ring-0"
              />
            </div>

            <div>
              <Input
                type="text"
                name="username"
                placeholder="Username"
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

            {/* Terms */}
            <div className="text-center text-xs text-gray-500 leading-4 py-4">
              People who use our service may have uploaded your contact information to Instagram.{' '}
              <Link to="/terms" className="text-blue-900">Learn More</Link>
              <br /><br />
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-blue-900">Terms</Link>,{' '}
              <Link to="/privacy" className="text-blue-900">Privacy Policy</Link> and{' '}
              <Link to="/cookies" className="text-blue-900">Cookies Policy</Link>.
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
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        </div>

        {/* Login card */}
        <div className="bg-white border border-gray-300 rounded-lg px-10 py-6 text-center">
          <p className="text-sm">
            Have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Log in
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

export default Signup;