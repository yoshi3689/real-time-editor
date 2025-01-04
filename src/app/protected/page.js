'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    // Log the user out and redirect to the home page
    await signOut({ callbackUrl: '/account/login' });
  };
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="mt-4 text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    // If not authenticated, redirect to login after a short delay
    setTimeout(() => router.push('/account/login'), 3000);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-600">You are not authorized to view this page.</p>
          <p className="mt-2 text-gray-500">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome, {session.user?.name || 'User'}!
        </h1>
        <p className="mt-4 text-center text-gray-600">
          You have successfully accessed the protected page.
        </p>
        <div className="mt-6 space-y-4">
          <p className="text-gray-700">
            <strong>Email:</strong> {session.user?.email || 'N/A'}
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">Other Protected Links</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="/protected/profile"
                className="text-blue-500 hover:underline"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="/protected/settings"
                className="text-blue-500 hover:underline"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="/protected/dashboard"
                className="text-blue-500 hover:underline"
              >
                Dashboard
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
