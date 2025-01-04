'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
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
      // Use NextAuth's signIn function
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirection
        username,
        password,
      });

      if (result?.error) {
        setError(result.error); // Show error from NextAuth
      } else {
        // Redirect to a protected page after successful login
        router.push("/protected");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
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
