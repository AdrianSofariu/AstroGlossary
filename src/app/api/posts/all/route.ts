import { posts } from "@/app/data/posts";
import { NextResponse } from "next/server";
import { Post } from "@/types";

export async function GET(req: Request) {
  //response
  return NextResponse.json({
    posts,
    total: posts.length,
  });
}
