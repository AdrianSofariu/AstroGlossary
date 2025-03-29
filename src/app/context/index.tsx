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
  getPagedPosts: (page: number, limit: number) => Post[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

// Create the context
const AppContext = createContext<AppContextType>({} as AppContextType);

// Custom hook to use the context
export function usePosts() {
  return useContext(AppContext);
}

//types for random generation
const randomTypes = [
  "galaxy",
  "nebula",
  "planet",
  "star",
  "comet",
  "planetoid",
  "constellation",
];

// Space-related subjects for more realism
const spaceSubjects = {
  galaxy: ["Milky Way", "Andromeda", "Whirlpool", "Sombrero", "Triangulum"],
  nebula: ["Orion Nebula", "Crab Nebula", "Eagle Nebula", "Ring Nebula"],
  planet: ["Mars", "Jupiter", "Saturn", "Venus", "Neptune", "Kepler-22b"],
  star: ["Betelgeuse", "Sirius", "Polaris", "Vega", "Proxima Centauri"],
  comet: ["Halley’s Comet", "Comet NEOWISE", "Comet Hyakutake"],
  planetoid: ["Ceres", "Eris", "Haumea", "Makemake"],
  constellation: ["Orion", "Ursa Major", "Cassiopeia", "Scorpius", "Lyra"],
};

const getRandomSearchQuery = () => {
  // Pick a random type
  const type = randomTypes[
    Math.floor(Math.random() * randomTypes.length)
  ] as keyof typeof spaceSubjects;

  // Pick a random subject from that type
  const subjects = spaceSubjects[type];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];

  return { type, subject };
};

// Function to generate random posts
async function fetchSpaceImages(count = 50) {
  const NASA_API_BASE = "https://images-api.nasa.gov/search?q=";
  const results: Post[] = [];
  let customId = 7;

  try {
    while (results.length < count) {
      const { type, subject } = getRandomSearchQuery();
      const response = await fetch(
        `${NASA_API_BASE}${encodeURIComponent(subject)}&media_type=image`
      );
      const data = await response.json();

      if (data.collection.items.length > 0) {
        const item = data.collection.items[0];
        const imageUrl = item.links?.[0]?.href;

        if (imageUrl) {
          results.push({
            id: String(customId++),
            title: item.data?.[0]?.title || subject,
            type,
            subject,
            source: imageUrl,
            date: new Date(item.data?.[0]?.date_created || Date.now()),
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return results;
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
      date: new Date(),
    },
    {
      id: "2",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
      date: new Date(2025, 0, 1),
    },
    {
      id: "3",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
      date: new Date(2022, 9, 10),
    },
    {
      id: "4",
      title: "Image 1",
      type: "galaxy",
      subject: "Milky Way",
      source:
        "https://darksky.org/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
      date: new Date(2025, 2, 21),
    },
    {
      id: "5",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "6",
      title: "Comet",
      type: "comet",
      subject: "C/2023 A3 (Tsuchinshan-ATLAS)",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Comet_Tsuchinshan%E2%80%93ATLAS_over_Ohio_%28Composite%29.jpg/435px-Comet_Tsuchinshan%E2%80%93ATLAS_over_Ohio_%28Composite%29.jpg",
      date: new Date(2025, 2, 19),
    },
    {
      id: "7",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "8",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "9",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "10",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "11",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "12",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "13",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "14",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "15",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "16",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "17",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "18",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "19",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "20",
      title: "Angel in the Sky",
      type: "nebula",
      subject: "Angel Nebula",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      date: new Date(2025, 0, 5),
    },
    {
      id: "21",
      title: "Mars",
      type: "planet",
      subject: "Mars",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      date: new Date(2025, 2, 24),
    },
    {
      id: "22",
      title: "Mars",
      type: "planet",
      subject: "Mars",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "23",
      title: "Mars",
      type: "planet",
      subject: "Mars",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      date: new Date(2025, 2, 24),
    },
    {
      id: "24",
      title: "Mars",
      type: "planet",
      subject: "Mars",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      date: new Date(2025, 2, 24),
    },
    {
      id: "25",
      title: "Mars",
      type: "planet",
      subject: "Mars",
      source:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      date: new Date(2025, 2, 24),
    },
    {
      id: "26",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "27",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "28",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "29",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "30",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "31",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "32",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "33",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "34",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "35",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 25),
    },
    {
      id: "36",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 24),
    },
    {
      id: "37",
      title: "Andormeda Photo",
      type: "galaxy",
      subject: "Andromeda",
      source:
        "https://cdn.mos.cms.futurecdn.net/hCXYB5YKXzdq2WEHYEe36d-970-80.jpg",
      date: new Date(2025, 2, 24),
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

  // Function to get paged posts
  const getPagedPosts = (page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return getFilteredPosts().slice(startIndex, endIndex);
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
        getPagedPosts,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
