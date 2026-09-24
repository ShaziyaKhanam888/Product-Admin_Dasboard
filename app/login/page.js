"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api/axios";

export default function LoginPage() {
  const router = useRouter();

  // Form input states
  const [username, setUsername] = useState("emilys"); // Default pre-filled for quick testing
  const [password, setPassword] = useState("emilyspass");

  // UI state feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // POST request to DummyJSON login endpoint
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 60, // Token valid for 1 hour
      });

      const { accessToken, id, firstName, lastName, image } = response.data;

      // Store token and basic user info in secure cookies
      Cookies.set("token", accessToken, { expires: 1 }); // Expires in 1 day
      Cookies.set("user", JSON.stringify({ id, firstName, lastName, image }), {
        expires: 1,
      });

      // Redirect user to the dashboard
      router.push("/products");
    } catch (err) {
      // Show user-friendly error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid credentials or network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
