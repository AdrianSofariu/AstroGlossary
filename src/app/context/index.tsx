"use client";
import { Post, PostWithUser } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  cache,
  useRef,
} from "react";
import axios from "axios";
import { addToQueue, processQueue } from "../utils/offlineQueue";
import { AxiosError } from "axios";

/// Function to save posts to localStorage when offline
const savePostsToLocalStorage = (posts: Post[]) => {
  localStorage.setItem("posts", JSON.stringify(posts));
};

const saveTypesToLocalStorage = (types: string[]) => {
  localStorage.setItem("types", JSON.stringify(types));
};

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
  getPost: (id: string) => Promise<PostWithUser | undefined>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  pagination: { total: number; offset: number; limit: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      total: number;
      offset: number;
      limit: number;
    }>
  >;
  isOnline: boolean;
  isServerUp: boolean;
  fetchPosts: () => void;
  fetchAllPosts: () => void;
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
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    limit: 8,
  });
  const [types, setTypes] = useState<string[]>([]);
  const [checkedTypes, setCheckedTypes] = useState<Record<string, boolean>>({});
  const hasMouted = useRef(false); // To track if the component has mounted
  const hasMouted2 = useRef(false); // To track if the component has mounted

  //offline support
  const [isOnline, setIsOnline] = useState(true);
  const [isServerUp, setIsServerUp] = useState(true);

  // Check if the server is up and the user is online
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    const checkServerStatus = async () => {
      try {
        await axios.get(
          process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/health"
        );
        setIsServerUp(true);
      } catch (error) {
        setIsServerUp(false);
      }
    };

    const interval = setInterval(checkServerStatus, 5000); // Check server status every 5 seconds

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  //log ip
  useEffect(() => {
    try {
      const logIp = async () => {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/log"
        );
      };
      logIp();
    } catch (error) {
      console.error("Error logging IP:", error);
    }
  }, []);

  //update offline queue when online
  useEffect(() => {
    if (hasMouted.current) {
      processQueue(isOnline, isServerUp); // Sync the queue when online
      syncLocalPosts();
    } else {
      hasMouted.current = true; // Set to true after the first render
    }
  }, [isOnline, isServerUp]);

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllPosts();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (hasMouted2.current) {
      //Reset posts when offset changes
      posts.length = 0; // Clear posts array

      // Reset offset and total when search term or checked types change
      pagination.offset = 0; // Reset offset to 0
      fetchPosts();
    } else {
      hasMouted2.current = true; // Set to true after the first render
    }
  }, [searchTerm, checkedTypes]);

  // Fetch types from the API
  const fetchTypes = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/types"
      );

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

      saveTypesToLocalStorage(types);
    } catch (error) {
      if (!isOnline || !isServerUp) {
        const types = JSON.parse(localStorage.getItem("types") || "[]");
        setTypes(types);
        setCheckedTypes(
          types.reduce((acc: Record<string, boolean>, type: string) => {
            acc[type] = true;
            return acc;
          }, {})
        );
      } else if (error instanceof AxiosError) {
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
      const { data } = await axios.get<PostResponse>(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts",
        {
          params: {
            search: searchTerm,
            types: selectedTypes.join(","),
            offset: pagination.offset,
            limit: pagination.limit,
          },
        }
      );
      //posts contain Date fields which need to be converted from string to Date
      data.posts = data.posts.map((post) => {
        return {
          ...post,
          date: new Date(post.date),
        };
      });

      //add this page to the currently fetched posts
      const newPosts = [...posts, ...data.posts];
      savePostsToLocalStorage(newPosts); // Save posts to localStorage when offline
      setPosts(newPosts);
      //update offset and total in pagination
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + pagination.limit,
        total: data.total,
      }));
    } catch (error) {
      //Fallback to localStorage if offline
      if (!isOnline || !isServerUp) {
        const cachedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        setPosts(cachedPosts);
      }
      //if there is some other error, show alert
      else if (error instanceof AxiosError) {
        alert("Failed to get posts - " + error.response?.data.message);
      }
    }
  };

  //Function to get a post by id
  const getPost = async (id: string) => {
    try {
      const post = await axios.get<PostWithUser>(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts/" + id
      );
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
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        alert("You are not authenticated");
        return;
      }

      const response = await axios.post<{ message: string }>(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts",
        {
          ...newPost,
          date: newPost.date.toISOString(), // Convert date to ISO string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      if (response.status === 201) {
        alert("Post added successfully!");
        // Fetch posts again to update the list
        pagination.offset = 0; // Reset offset to 0
        posts.length = 0; // Clear posts array
        fetchPosts();
      }
    } catch (error) {
      if (!isOnline || !isServerUp) {
        addToQueue({
          request: {
            method: "POST",
            url: process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts",
            data: newPost,
          },
        });

        // Update localStorage with new post
        addPostToCache(newPost); // Add post to cache
      } else if (error instanceof AxiosError) {
        alert("Failed to add post - " + error.response?.data.message);
      }
    }
  };

  // Function to update a post
  const updatePost = async (updatedPost: Post) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        alert("You are not authenticated");
        return;
      }

      const response = await axios.put<{ message: string }>(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING +
          "/posts/" +
          updatedPost.id,
        {
          ...updatedPost,
          date: updatedPost.date.toISOString(), // Convert date to ISO string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      if (response.status === 200) {
        alert(response.data.message);
        pagination.offset = 0; // Reset offset to 0
        posts.length = 0; // Clear posts array
        fetchPosts(); // Fetch posts again to update the list
      }
    } catch (error) {
      if (!isOnline || !isServerUp) {
        addToQueue({
          request: {
            method: "PUT",
            url:
              process.env.NEXT_PUBLIC_API_CONNECTION_STRING +
              "/posts/" +
              updatedPost.id,
            data: updatedPost,
          },
        });

        // Update localStorage immediately
        updatePostInCache(updatedPost); // Update post in cache
      } else if (error instanceof AxiosError) {
        alert("Failed to update post - " + error.response?.data.message);
      }
    }
  };

  // Function to delete a post
  const deletePost = async (id: string) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        alert("You are not authenticated");
        return;
      }

      const response = await axios.delete<{ message: string }>(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      if (response.status === 200) {
        alert(response.data.message);
        pagination.offset = 0; // Reset offset to 0
        posts.length = 0; // Clear posts array
        fetchPosts(); // Fetch posts again to update the list
      }
    } catch (error) {
      if (!isOnline || !isServerUp) {
        addToQueue({
          request: {
            method: "DELETE",
            url: process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts/" + id,
          },
        });

        // Update localStorage immediately
        deletePostFromCache(id); // Remove post from cache
      } else if (error instanceof AxiosError) {
        alert("Failed to delete post - " + error.response?.data.message);
      }
    }
  };

  //fetch all posts
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get<AllPostsResponse>(
        process.env.NEXT_PUBLIC_API_CONNECTION_STRING + "/posts/all"
      );
      const formattedPosts = response.data.posts.map((post) => ({
        ...post,
        date: new Date(post.date),
      }));

      setAllPosts(formattedPosts);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Failed to fetch posts - " + error.response?.data.message);
      }
      console.error("Error fetching all posts:", error);
      return [];
    }
  };

  // Function to update a post in the local cache
  const updatePostInCache = (updatedPost: Post) => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const postIndex = posts.findIndex(
      (post: Post) => post.id === updatedPost.id
    );
    if (postIndex !== -1) {
      posts[postIndex] = updatedPost; // Update post in cache
      localStorage.setItem("posts", JSON.stringify(posts)); // Save the updated posts back to localStorage
      //make sure date is in Date format
      const updatedPosts = posts.map((post: Post) => {
        return {
          ...post,
          date: new Date(post.date),
        };
      });
      setPosts(updatedPosts); // Update state to reflect changes
    }
  };

  // Function to delete a post from the local cache
  const deletePostFromCache = (postId: string) => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const updatedPosts = posts.filter((post: Post) => post.id !== postId); // Remove post from cache
    localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Save the updated posts back to localStorage
    //make sure date is in Date format
    const formattedPosts = updatedPosts.map((post: Post) => {
      return {
        ...post,
        date: new Date(post.date),
      };
    });
    setPosts(formattedPosts);
  };

  // Function to add a post to the local cache
  const addPostToCache = (newPost: Post) => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.unshift(newPost); // Add new post to cache
    localStorage.setItem("posts", JSON.stringify(posts)); // Save the updated posts back to localStorage
    //make sure date is in Date format
    const updatedPosts = posts.map((post: Post) => {
      return {
        ...post,
        date: new Date(post.date),
      };
    });
    setPosts(updatedPosts); // Update state to reflect changes
  };

  const syncLocalPosts = async () => {
    if (!isOnline || !isServerUp) return; // Sync only when online

    // Clear locally stored posts
    localStorage.removeItem("posts");
    // Fetch fresh posts from the API
    posts.length = 0; // Clear posts array
    pagination.offset = 0; // Reset offset to 0
    fetchPosts();
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
        isOnline,
        isServerUp,
        fetchPosts,
        fetchAllPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
