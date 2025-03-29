import { posts } from "@/app/data/posts";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Get the last part of the URL path

  if (!id) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 }
    );
  }

  const post = posts.find((post) => post.id === id);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  } else {
    return NextResponse.json(post, { status: 200 });
  }
}

// Delete a post
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Get the last part of the URL path

  if (!id) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 }
    );
  }

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }
  posts.splice(index, 1);
  return NextResponse.json(
    { message: "Post deleted successfully" },
    { status: 200 }
  );
}
