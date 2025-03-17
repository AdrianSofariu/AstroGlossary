import { useState } from "react";
import { usePosts } from "@/app/context";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPost, Post } from "@/types";
import { Pencil } from "lucide-react";

function startsWithLetter(str: string) {
  return /^[A-Za-z]/.test(str);
}

export default function EditPostDialog({ post }: UserPost) {
  const { types, updatePost } = usePosts();

  const [editedPost, setEditedPost] = useState({
    id: post.id,
    title: post.title,
    type: post.type,
    subject: post.subject,
    source: post.source,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setEditedPost({ ...editedPost, type: value });
  };

  const handleUpdate = () => {
    if (!editedPost.title || !editedPost.type || !editedPost.subject) {
      return alert("All fields are required!");
    }

    if (!types.includes(editedPost.type)) {
      return alert("Invalid type");
    }

    if (startsWithLetter(editedPost.title) === false) {
      return alert("Title must start with a letter");
    }

    const updatedPost: Post = {
      id: editedPost.id,
      title: editedPost.title,
      type: editedPost.type,
      subject: editedPost.subject,
      source: editedPost.source,
    };

    updatePost(post.id, updatedPost);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-[#181832] hover:bg-pink-500 text-white rounded-full"
        >
          <Pencil size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {" "}
          {/* More spacing between form fields */}
          <div className="space-y-2">
            <Label className="text-sm">Title</Label>
            <Input
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              className="p-3"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Type</Label>
            <Select
              onValueChange={handleTypeChange}
              defaultValue={editedPost.type}
            >
              <SelectTrigger className="p-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Subject</Label>
            <Input
              name="subject"
              value={editedPost.subject}
              onChange={handleChange}
              className="p-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              onClick={handleUpdate}
              className="w-full bg-[#181832] text-white  hover:bg-pink-600 transition "
            >
              Update Post
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
