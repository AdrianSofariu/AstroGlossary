"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/usercontext";
import { useRouter } from "next/navigation";

type FlatFlaggedUser = {
  user_id: string;
  reason: string;
  flagged_at: string;
  username: string;
  role: string;
  email: string;
};

export default function FlaggedUsersPage() {
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<FlatFlaggedUser[]>([]); // Ensure users is always an array
  const [loading, setLoading] = useState(true);

  // Redirect if the user is not logged in or not an admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      // If the user is not logged in or not an admin, redirect to the login page
      router.push("/");
    } else {
      const fetchFlaggedUsers = async () => {
        try {
          const response = await axios.get(
            `${process.env.API_CONNECTION_STRING}/flagged`,
            { withCredentials: true }
          );

          const data = response.data.users; // Accessing the 'users' array from the response

          // Ensure the data is an array before setting it
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error("Expected an array of flagged users, got:", data);
            setUsers([]); // Reset to empty array in case of unexpected response
          }
        } catch (error) {
          console.error("Failed to fetch flagged users:", error);
          setUsers([]); // Reset to empty array in case of error
        } finally {
          setLoading(false);
        }
      };

      fetchFlaggedUsers();
    }
  }, [user, router]);

  return (
    <div className="h-[96vh] p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Flagged Users
      </h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No flagged users found.</div>
      ) : (
        <div className="overflow-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Reason</th>
                <th className="px-6 py-3 text-left">Flagged At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4">{user.username || "N/A"}</td>
                  <td className="px-6 py-4">{user.email || "N/A"}</td>
                  <td className="px-6 py-4">{user.role || "N/A"}</td>
                  <td className="px-6 py-4">{user.reason}</td>
                  <td className="px-6 py-4">
                    {new Date(user.flagged_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
