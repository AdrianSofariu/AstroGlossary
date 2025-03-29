"use client";
import { useState, useEffect, useRef } from "react";
import { faker } from "@faker-js/faker";
import { usePosts } from "@/app/context";
import { Post } from "@/types";

const FakeItemGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // To store the interval ID

  const { posts, types, addPost } = usePosts(); // Get types from context

  // Function to generate a fake item
  const generateItem = () => {
    const newItem: Post = {
      id: "22",
      title: "Moon",
      type: "planetoid",
      subject: "Moon",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Supermoon_Nov-14-2016-minneapolis.jpg/800px-Supermoon_Nov-14-2016-minneapolis.jpg",
      date: new Date(),
    };
    addPost(newItem);
  };

  // Toggle the generation process
  const toggleGeneration = () => {
    setIsGenerating((prev) => !prev);
  };

  // Cleanup when the component unmounts (to clear the interval)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        generateItem(); // Correct way to update state
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }; // Cleanup function
  }, [isGenerating, generateItem]);

  return (
    <div>
      <button onClick={toggleGeneration}>
        {isGenerating ? "Stop Generating" : "Start Generating"}
      </button>
    </div>
  );
};

export default FakeItemGenerator;
