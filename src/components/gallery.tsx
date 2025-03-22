"use client";
import { cn } from "@/lib/utils";
import { UserPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePosts } from "@/app/context";
import { isToday, isThisWeek, formatDistanceToNow } from "date-fns";
import { Pagination } from "./ui/pagination";
import { PaginationControls } from "./page_nav";
import { useSearchParams } from "next/navigation";

export default function PostGrid() {
  //const posts = usePosts().getFilteredPosts();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "8";

  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);

  const posts = usePosts().getFilteredPosts().slice(start, end);

  const { getFilteredPosts } = usePosts();

  const [filteredPosts, setFilteredPosts] = useState(getFilteredPosts());

  useEffect(() => {
    setFilteredPosts(getFilteredPosts());
  }, [getFilteredPosts]);

  return (
    <div className="pb-8">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {posts.map((item) => (
            <BlurImage key={item.id} post={item} />
          ))}
        </div>
      </div>
      <div className="py-2 flex justify-center">
        <PaginationControls
          hasNextPage={end < filteredPosts.length}
          hasPreviousPage={start > 0}
        />
      </div>
    </div>
  );
}

export function BlurImage({ post }: UserPost) {
  const [isLoading, setLoading] = useState(true);

  const borderColor = isToday(post.date)
    ? "border-pink-500" //Today
    : isThisWeek(post.date, { weekStartsOn: 1 })
    ? "border-cyan-500" //This week
    : "[border-color:#181832]"; //Older

  return (
    <div className="group">
      <div
        className={`relative aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 overflow-hidden rounded-lg bg-gray-200 w-64 h-64 border-2 ${borderColor}`}
      >
        <Link href={`/posts/${post.id}`}>
          <Image
            data-testid="image"
            alt=""
            src={post.source}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className={cn(
              "object-cover group-hover:opacity-75 duration-700 ease-in-out",
              isLoading
                ? "grayscale blur-2xl scale-110"
                : "grayscale-0 blur-0 scale-100"
            )}
            onLoad={() => setLoading(false)}
          />
        </Link>
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{post.title}</h3>
    </div>
  );
}
