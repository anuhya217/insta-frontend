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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send JSON, not FormData
      const signupRes = await axios.post(
        'https://insta-backend-0tuv.onrender.com/api/auth/signup',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          bio: "Welcome to my Instagram! 👋"
        }
      );

      // Auto-login after signup
      const loginRes = await axios.post(
        'https://insta-backend-0tuv.onrender.com/api/auth/signin',
        {
          email: formData.email,
          password: formData.password
        }
      );

      login(loginRes.data.user);
      navigate('/profile/' + loginRes.data.user.username);

    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.fullName && formData.username && formData.password;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Sign up</h2>
        <Input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
        <Input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
        <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
        <Button type="submit" disabled={!isFormValid || loading} className="w-full bg-blue-500 text-white">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        <p className="text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
