import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthGuard';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        'https://insta-backend-0tuv.onrender.com/api/auth/signin',
        {
          email: formData.email,
          password: formData.password
        }
      );
      login(res.data.user);
      navigate('/profile/' + res.data.user.username);
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Login</h2>
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
        <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
        <Button type="submit" disabled={loading} className="w-full bg-blue-500 text-white">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default Signin;
