"use client";
import { usePosts } from "@/app/context";

export default function StatusBanner() {
  const { isOnline, isServerUp } = usePosts();

  if (isOnline && isServerUp) return null; // No need to show if everything is fine

  return (
    <div className="fixed top-4 right-4 p-4 text-center text-sm z-50">
      {!isOnline && (
        <p className="bg-red-500 text-white p-2 rounded shadow-lg">
          Offline Mode: No Internet
        </p>
      )}
      {!isServerUp && isOnline && (
        <p className="bg-yellow-500 text-black p-2 rounded shadow-lg">
          Server Down: Changes will sync later
        </p>
      )}
    </div>
  );
}
