"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProtectedPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // "loading", "success", or "error"
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchProtectedData() {
            try {
        const response = await axios.get("/api/protected", { withCredentials: true, },);

        if (response.status === 200) {
          setStatus("success");
          setUserData(response.data.user); // Assuming the API returns user data in `response.data.user`
        }
      } catch (error) {
        console.error("Error accessing protected data:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "You are not authorized to view this page. Redirecting to login..."
        );
        setTimeout(() => router.push("/account/login"), 3000); // Redirect after 3 seconds
      }

      
    }

    fetchProtectedData();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="mt-4 text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-600">{message}</p>
          <p className="mt-2 text-gray-500">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome, {userData?.name || "User"}!
        </h1>
        <p className="mt-4 text-center text-gray-600">
          You have successfully accessed the protected page.
        </p>
        <div className="mt-6 space-y-4">
          <p className="text-gray-700">
            <strong>Email:</strong> {userData?.email || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Username:</strong> {userData?.username || "N/A"}
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
      </div>
    </div>
  );
}
