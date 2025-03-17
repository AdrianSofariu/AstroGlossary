"use client";
import { Post } from "@/types";
import { createContext, useContext, useState, useEffect } from "react";

// Define the context type
type AppContextType = {
  posts: Post[];
  types: string[];
  checkedTypes: Record<string, boolean>;
  setCheckedTypes: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  addPost: (newPost: Post) => void;
  updatePost: (id: string, updatedPost: Post) => void;
  deletePost: (id: string) => void;
  getFilteredPosts: () => Post[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

// Create the context
const AppContext = createContext<AppContextType>({} as AppContextType);

// Custom hook to use the context
export function usePosts() {
  return useContext(AppContext);
}

// Context Provider component
export const ContextProvider = ({ children }: any) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
    },
    {
      id: "2",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
    },
    {
      id: "3",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
    },
    {
      id: "4",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
    },
    {
      id: "5",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
    },
    {
      id: "6",
      title: "Comet",
      type: "comet",
      subject: "C/2023 A3 (Tsuchinshan-ATLAS)",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Comet_Tsuchinshan%E2%80%93ATLAS_over_Ohio_%28Composite%29.jpg/435px-Comet_Tsuchinshan%E2%80%93ATLAS_over_Ohio_%28Composite%29.jpg",
    },
  ]);

  const types = [
    "galaxy",
    "nebula",
    "planet",
    "star",
    "comet",
    "planetoid",
    "constellation",
  ];
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [checkedTypes, setCheckedTypes] = useState<Record<string, boolean>>({
    galaxy: true,
    nebula: true,
    planet: true,
    star: true,
    comet: true,
    planetoid: true,
    constellation: true,
  });

  // Function to get filtered posts
  const getFilteredPosts = () => {
    return posts.filter(
      (post) =>
        checkedTypes[post.type] &&
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Function to add a post
  const addPost = (newPost: Post) => {
    if (!types.includes(newPost.type)) return alert("Invalid type");
    setPosts([...posts, newPost]);
  };

  // Function to update a post
  const updatePost = (id: string, updatedPost: Post) => {
    setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
  };

  // Function to delete a post
  const deletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        types,
        checkedTypes,
        setCheckedTypes,
        addPost,
        updatePost,
        deletePost,
        getFilteredPosts,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
