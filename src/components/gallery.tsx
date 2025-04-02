"use client";
import { cn } from "@/lib/utils";
import { UserPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePosts } from "@/app/context";
import { isToday, isThisWeek, formatDistanceToNow } from "date-fns";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { off } from "process";
import { waitFor } from "@testing-library/dom";

export default function PostGrid() {
  const { posts, pagination, fetchPosts, isOnline, isServerUp } = usePosts();

  //Retrieve page and pageSize from URL search params
  //If not present, default to 1 and 8 respectively
  const pageSize = pagination.limit;

  //Calculate the posts to display based on the current page and pageSize
  //const start = (page - 1) * pageSize;
  //const end = start + pageSize;
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate if more posts exist
  const hasMorePosts = posts.length < pagination.total;

  // Fetch more posts when scroll reaches loader
  useEffect(() => {
    if (
      !loaderRef.current ||
      !hasMorePosts ||
      isLoading ||
      !isOnline ||
      !isServerUp
    )
      return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          try {
            await fetchPosts(); // Fetch next page of posts
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 1 } // Trigger when loader is 50% visible
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [posts.length, isLoading, hasMorePosts, isOnline, isServerUp]);

  return (
    <div className="pb-8">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8 overflow-y-auto h-3/4">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {posts.map((item) => (
            <BlurImage key={item.id} post={item} />
          ))}
        </div>
      </div>
      <div ref={loaderRef} className="py-2 text-center">
        {!isOnline || !isServerUp ? (
          <p className="text-yellow-600">
            Offline - Cannot bring in more posts
          </p>
        ) : isLoading ? (
          <p className="text-gray-500">Loading more posts...</p>
        ) : !hasMorePosts ? (
          <p className="text-gray-400">No more posts to load</p>
        ) : (
          <p className="text-gray-400">Scroll to load more</p>
        )}
      </div>
      {/*<div className="py-2 flex justify-center">
        <PaginationControls
          hasNextPage={end < pagination.total}
          hasPreviousPage={start > 0}
          onNext={() => setPagination((prev) => ({ ...prev, page: page + 1 }))}
          onPrevious={() =>
            setPagination((prev) => ({ ...prev, page: page - 1 }))
          }
        />
      </div>*/}
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
