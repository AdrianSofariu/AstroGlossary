"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePosts } from "@/app/context";
import FakeItemGenerator from "@/components/faker";

const COLORS = [
  "#8B5CF6", // Nebula Purple
  "#FF007F", // Cosmic Magenta
  "#1E1B4B", // Deep Space Blue
  "#36A2EB", // Stellar Cyan
  "#FACC15", // Supernova Yellow
  "#FF6B35", // Solar Flare Orange
  "#5A189A", // Galactic Violet
];

export default function PostChart() {
  const { posts } = usePosts();

  // Count posts per type
  const data = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    posts.forEach((post) => {
      typeCounts[post.type] = (typeCounts[post.type] || 0) + 1;
    });

    return Object.keys(typeCounts).map((type, index) => ({
      name: type,
      value: typeCounts[type],
      color: COLORS[index % COLORS.length], // Cycle through colors
    }));
  }, [posts]);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-center text-lg font-bold mb-4">Posts by Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
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
      <FakeItemGenerator />
    </div>
  );
}
