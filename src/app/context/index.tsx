"use client";
import { Post } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { set } from "date-fns";

// Define the context type
type AppContextType = {
  allPosts: Post[];
  posts: Post[];
  types: string[];
  checkedTypes: Record<string, boolean>;
  setCheckedTypes: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  addPost: (newPost: Post) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => Promise<Post | undefined>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  pagination: { total: number; page: number; limit: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      total: number;
      page: number;
      limit: number;
    }>
  >;
};

interface PostResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

interface AllPostsResponse {
  posts: Post[];
  total: number;
}

// Create the context
const AppContext = createContext<AppContextType>({} as AppContextType);

// Custom hook to use the context
export function usePosts() {
  return useContext(AppContext);
}

// Context Provider component
export const ContextProvider = ({ children }: any) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 8 });
  const [types, setTypes] = useState<string[]>([]);
  const [checkedTypes, setCheckedTypes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, checkedTypes, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Fetch types from the API
  const fetchTypes = async () => {
    try {
      const response = await axios.get("/api/types");

      //set types as string[]
      const types = response.data as string[];
      setTypes(types);

      //initialize checkedTypes with all types
      setCheckedTypes(
        types.reduce((acc: Record<string, boolean>, type: string) => {
          acc[type] = true;
          return acc;
        }, {})
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to fetch types - " + error.response?.data.message);
      }
    }
  };

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const selectedTypes = Object.keys(checkedTypes).filter(
        (type) => checkedTypes[type]
      );
      const { data } = await axios.get<PostResponse>("/api/posts", {
        params: {
          search: searchTerm,
          types: selectedTypes.join(","),
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      //posts contain Date fields which need to be converted from string to Date
      data.posts = data.posts.map((post) => {
        return {
          ...post,
          date: new Date(post.date),
        };
      });
      setPosts(data.posts);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert("Failed to get posts - " + error.response?.data.message);
      }
    }
  };

  //Function to get a post by id
  const getPost = async (id: string) => {
    try {
      const post = await axios.get<Post>("/api/posts/" + id);
      return post.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to get post - " + error.response?.data.message);
      }
    }
  };

  // Function to add a post
  const addPost = async (newPost: Post) => {
    try {
      const response = await axios.post<{ message: string }>(
        "/api/posts",
        newPost
      );
      if (response.status === 201) {
        // Fetch posts again to update the list
        fetchPosts();
        fetchAllPosts(); // Fetch all posts to update the list
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to add post  - " + error.response?.data.message);
      }
    }
  };

  // Function to update a post
  const updatePost = async (updatedPost: Post) => {
    try {
      const response = await axios.put<{ message: string }>(
        "/api/posts/",
        updatedPost
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchPosts(); // Fetch posts again to update the list
        fetchAllPosts(); // Fetch all posts to update the list
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to update post - " + error.response?.data.message);
      }
    }
  };

  // Function to delete a post
  const deletePost = async (id: string) => {
    try {
      const response = await axios.delete<{ message: string }>(
        "/api/posts/" + id
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchPosts(); // Fetch posts again to update the list
        fetchAllPosts(); // Fetch all posts to update the list
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to delete post - " + error.response?.data.message);
      }
    }
  };

  //fetch all posts
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get<AllPostsResponse>("/api/posts/all");
      const formattedPosts = response.data.posts.map((post) => ({
        ...post,
        date: new Date(post.date),
      }));
      setAllPosts(formattedPosts);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to fetch posts - " + error.response?.data.message);
      }
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        allPosts,
        posts,
        types,
        checkedTypes,
        setCheckedTypes,
        addPost,
        updatePost,
        deletePost,
        getPost,
        searchTerm,
        setSearchTerm,
        pagination,
        setPagination,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
