'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

//TODO:has to be imported from the below path instead of 'router'
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Make an Axios POST request to the login API
      const response = await axios.post('/api/auth/login',
        { username, password, },
        { withCredentials: true, },
      );
      if (response.status === 200) {
        // Extract the token from the response
        console.log(response)
      // show success message
        alert('Login successful!');
        // then redirect
        setTimeout(() => {
          router.push("/protected"); // Redirect to the protected page
        }, 2000); // Redirect after 2 seconds
      } else if (response.status === 401) {
        alert('User not found. Please signup first!');
          setTimeout(() => {
            router.push("/account/signup"); // Redirect to the protected page
          }, 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      // Handle error and show user-friendly message
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
                  <Link
            className="w-full px-4 py-2 font-medium text-gray-500 bg-white-600 rounded hover:bg-white-500"
            href="/account/signup"
          >
            Signup
          </Link>
          <Link
            className="w-full px-4 py-2 font-medium text-gray-500 bg-white-600 rounded hover:bg-white-500"
            href="/account/forgot-password"
          >
            Forgot Password
          </Link>
      </div>
    </div>
  );
}
