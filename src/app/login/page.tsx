// pages/login.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/usercontext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setUser } = useUser(); // Get the setUser function from context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      // Send the login request to your Express API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_CONNECTION_STRING}/auth/login`,
        { email, password }
      );

      if (response.status === 200) {
        // Store user information in localStorage
        const user = response.data.user; // Assuming the API returns user data
        const token = response.data.token; // The token sent in the response body

        // Set user context if you're using context or state
        setUser(user);

        // Store the user and token in localStorage
        localStorage.setItem("user", JSON.stringify(user)); // Save user details
        localStorage.setItem("token", token); // Save the JWT token for future requests

        // Redirect to a dashboard or home page on success
        router.push("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // If the error is an AxiosError, handle it
        const errorMessage =
          err.response?.data.message || "Something went wrong";
        setError(errorMessage); // Display the error message from the API
      } else {
        // If the error is not an AxiosError
        setError("An unexpected error occurred.");
      } // Handle the error if login fails
    } finally {
      setLoading(false); // Set loading to false once the request completes
    }
  };

  return (
    <div className="flex justify-center items-center h-[96vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
