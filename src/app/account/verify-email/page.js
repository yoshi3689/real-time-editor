"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await axios.get(`/api/auth/verify-email?token=${token}`);
        const { status, message, token: accessToken } = response.data;

        if (status === "success") {
          setStatus("success");
          setMessage(message);
          localStorage.setItem("accessToken", accessToken); // Store token for protected routes
          setTimeout(() => router.push("/protected"), 2000); // Redirect after 2 seconds
        } else if (status === "expired") {
          setStatus("info");
          setMessage(message);
        } else {
          setStatus("error");
          setMessage(message);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    }

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Verifying Your Email...
            </h1>
            <p className="mt-4 text-center text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-center text-green-600">
              Email Verified!
            </h1>
            <p className="mt-4 text-center text-gray-600">{message}</p>
          </>
        )}

        {status === "info" && (
          <>
            <h1 className="text-2xl font-bold text-center text-blue-600">
              Verification Email Sent Again
            </h1>
            <p className="mt-4 text-center text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-center text-red-600">
              Verification Failed
            </h1>
            <p className="mt-4 text-center text-gray-600">{message}</p>
            <div className="mt-6 flex justify-center">
              <button
                className="px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onClick={() => router.push("/signup")}
              >
                Create an Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
