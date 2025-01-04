'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Send signup request to the API
      const response = await axios.post('/api/auth/signup', formData);
      if (response.status === 201) {
        setSuccess('Signup successful! Logging you in...');
        setFormData({ email: '', username: '', password: '', name: '' });

        // Automatically log the user in after signup
        const loginResult = await signIn('credentials', {
          redirect: true,
          username: formData.username,
          password: formData.password,
          callbackUrl: '/', // Redirect to home or desired page after login
        });

        if (loginResult?.error) {
          setError('Signup successful, but login failed. Please log in manually.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Signup</h1>
        {success && <p className="text-sm text-green-500">{success}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Signup
          </button>
        </form>
        <Link
          className="w-full px-4 py-2 font-medium text-gray-500 bg-white-600 rounded hover:bg-white-500"
          href="/account/login"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
