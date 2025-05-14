"use client";

import { useMemo, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePosts } from "@/app/context";
import { io } from "socket.io-client";
import FileUploader from "@/components/file-uploader";
import { useUser } from "../context/usercontext";

// Dynamic import to prevent SSR issues
const socketClientPromise = import("socket.io-client").then(
  (module) => module.io
);

const COLORS = [
  "#8B5CF6", // Nebula Purple
  "#FF007F", // Cosmic Magenta
  "#1E1B4B", // Deep Space Blue
  "#36A2EB", // Stellar Cyan
  "#FF6B35", // Solar Flare Orange
  "#5A189A", // Galactic Violet
];

export default function PostChart() {
  const { allPosts, fetchAllPosts } = usePosts();
  const [isGenerating, setIsGenerating] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const { user } = useUser(); // Get user from context

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!user || !token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_SOCKET, {
      auth: { token },
    });
    //const newSocket = io(process.env.API_SOCKET);

    newSocket.on("update", async () => {
      await fetchAllPosts();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to start/stop post generation
  const toggleGeneration = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!socket || !user || !token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (isGenerating) {
      socket.emit("stop");
      console.log("Stopped post generation");
    } else {
      socket.emit("start");
      console.log("Started post generation");
    }

    setIsGenerating(!isGenerating);
  };

  // Compute chart data
  const chartData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    allPosts.forEach((post) => {
      typeCounts[post.type] = (typeCounts[post.type] || 0) + 1;
    });

    return Object.keys(typeCounts).map((type, index) => ({
      name: type,
      value: typeCounts[type],
      color: COLORS[index % COLORS.length],
    }));
  }, [allPosts]);

  return (
    <div>
      <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-center text-lg font-bold mb-4">Posts by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        {user &&
          typeof window !== "undefined" &&
          localStorage.getItem("token") && (
            <button
              onClick={toggleGeneration}
              className={`w-full mt-4 px-4 py-2 rounded-lg text-white font-bold transition ${
                isGenerating
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isGenerating
                ? "Stop Generating Posts"
                : "Start Generating Posts"}
            </button>
          )}
      </div>
    </div>
  );
}
