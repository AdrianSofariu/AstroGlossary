import { posts } from "@/app/data/posts";
import { types } from "@/app/data/types";
import { Post } from "@/types";
import { Console } from "console";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const typesString = url.searchParams.get("types");
  //split the types string into an array
  const types = typesString ? typesString.split(",") : [];
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "8";

  let filteredPosts = [...posts];

  const typesArray = Array.isArray(types) ? types : [types];

  //filter by search term
  if (search) {
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(search.toString().toLowerCase())
    );
  }

  //filter by types
  if (typesArray) {
    filteredPosts = filteredPosts.filter((post) =>
      typesArray.includes(post.type)
    );
  }

  //pagination
  const pageNumber = parseInt(page.toString(), 10);
  const limitNumber = parseInt(limit.toString(), 10);
  const startIndex = (pageNumber - 1) * limitNumber;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + limitNumber
  );
  //response
  return NextResponse.json({
    posts: paginatedPosts,
    total: filteredPosts.length,
    page: pageNumber,
    limit: limitNumber,
  });
}

// Create a new post
export async function POST(req: Request) {
  const post: Post = await req.json();

  post.date = new Date(post.date);
  //validate post data
  if (
    !post.title ||
    !post.source ||
    !post.type ||
    !post.id ||
    !post.date ||
    !post.subject
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }
  // Check if post with the same ID already exists
  const existingPost = posts.find((p) => p.id === post.id);
  if (existingPost) {
    return NextResponse.json(
      { message: "Post with this ID already exists" },
      { status: 409 }
    );
  }
  // Check if the type is valid
  if (!types.includes(post.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }
  // Check if the title starts with a letter
  if (!/^[A-Za-z]/.test(post.title)) {
    return NextResponse.json(
      { message: "Title must start with a letter" },
      { status: 400 }
    );
  }
  // Check if the date is valid
  if (isNaN(new Date(post.date).getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  //add at the beginning of the array
  posts.unshift(post);
  //posts.push(post);
  return NextResponse.json(
    { message: "Post created successfully" },
    { status: 201 }
  );
}

// Update an existing post
export async function PUT(req: Request) {
  const post = await req.json();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index === -1) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  //validate new post data
  if (
    !post.title ||
    !post.source ||
    !post.type ||
    !post.date ||
    !post.subject
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }
  // Check if the type is valid
  if (!types.includes(post.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }
  // Check if the title starts with a letter
  if (!/^[A-Za-z]/.test(post.title)) {
    return NextResponse.json(
      { message: "Title must start with a letter" },
      { status: 400 }
    );
  }
  //make sure date and source are not changed
  if (post.source !== posts[index].source) {
    return NextResponse.json(
      { message: "Source cannot be changed" },
      { status: 400 }
    );
  }
  const postDate = new Date(post.date);
  if (postDate.getTime() !== posts[index].date.getTime()) {
    return NextResponse.json(
      { message: "Date cannot be changed" },
      { status: 400 }
    );
  }

  posts[index] = post;
  return NextResponse.json(
    { message: "Post updated successfully" },
    { status: 200 }
  );
}
