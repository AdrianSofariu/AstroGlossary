"use client"
import { cn } from "@/lib/utils";
import { UserPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePosts } from "@/app/context";






export default function PostGrid() {

    const posts = usePosts().getFilteredPosts();

    const { getFilteredPosts } = usePosts();

    const [filteredPosts, setFilteredPosts] = useState(getFilteredPosts());

    useEffect(() => {
        setFilteredPosts(getFilteredPosts());
    }, [getFilteredPosts]);

    return (
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {posts.map((item) =>
                    <BlurImage key={item.id} post={item} />
                )}
            </div>
        </div>
    );
}

export function BlurImage({ post }: UserPost){

    const [isLoading, setLoading] = useState(true);

    return (
        <div className="group">
            <div className="relative aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 overflow-hidden rounded-lg bg-gray-200 w-64 h-64">
                <Link href={`/posts/${post.id}`}>
                <Image
                    alt=""
                    src={post.source}
                    fill={true}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className={cn('object-cover group-hover:opacity-75 duration-700 ease-in-out', 
                        isLoading
                        ? 'grayscale blur-2xl scale-110'
                        : 'grayscale-0 blur-0 scale-100'
                    )}
                    onLoad={() => setLoading(false)}
                />
                </Link>
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{post.title}</h3>
        </div>
    );
}