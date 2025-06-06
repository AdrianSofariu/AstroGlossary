"use client";

import { useParams, useRouter } from "next/navigation";
import { usePosts } from "@/app/context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import EditPostDialog from "@/components/edit-post-dialog";
import { Post, PostWithUser, UserPost } from "@/types";
import { useUser } from "@/app/context/usercontext";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { posts, deletePost, getPost } = usePosts();

  const [post, setPost] = useState<PostWithUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { postId } = useParams();

  const fetchPost = async () => {
    setLoading(true); // Ensure loading is true before fetching.
    const fetched = await getPost(postId as string);
    if (!fetched) {
      setPost(null); // Post not found.
    } else {
      fetched.date = new Date(fetched.date); // Convert date string to Date object.
      setPost(fetched); // Update state with fetched post.
    }
    setLoading(false); // Turn off loading when data is fetched.
  };

  useEffect(() => {
    if (!postId) return;
    fetchPost();
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-500 text-xl">Loading...</p>;
  }

  if (!post) {
    return <p className="text-center text-red-500 text-xl">Post not found.</p>;
  }

  const handleDelete = () => {
    if (post.user_id !== user?.id) {
      alert("You are not authorized to delete this post.");
      return;
    }
    deletePost(post.id);
    setOpen(false);
    router.push("/"); // Redirect after deleting
  };

  return (
    <div className="py-5 flex flex-col justify-center items-center">
      {post.user_id === user?.id && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <EditPostDialog post={post} />
          <Button
            data-testid="delete-post"
            onClick={() => setOpen(true)}
            size="icon"
            className="bg-[#181832] hover:bg-pink-500 text-white rounded-full"
            variant="destructive"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )}
      <div className="relative priority w-full rounded-lg max-w-5xl mx-auto aspect-[16/9]">
        <Image
          alt=""
          src={post.source}
          priority={true}
          fill={true}
          sizes="(max-width: 70vw) 70vw, (max-height: 50vh) 50vh"
          className={cn(
            "object-contain group-hover:opacity-75 duration-700 ease-in-out",
            isLoading
              ? "grayscale blur-2xl scale-110"
              : "grayscale-0 blur-0 scale-100"
          )}
          onLoad={() => setLoading(false)}
        />
      </div>
      <div className="max-w-3xl px-6 py-10 mx-auto text-center">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="text-gray-600 text-lg">Type: {post.type}</p>
        <p className="text-gray-700">{post.subject}</p>
        <p className="text-gray-700">{post.username}</p>
        <p className="text-gray-500 text-sm mt-2">
          {post.date.toLocaleDateString("en-GB")}
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              data-testid="cancelDelete"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              data-testid="confirmDelete"
              onClick={handleDelete}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
