"use client";

import { useState } from "react";
import { usePosts } from "@/app/context"; // Ensure this exists
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post } from "@/types";

export default function AddImagePage() {
  const { types, addPost } = usePosts(); // Get types from context
  const [newPost, setNewPost] = useState({
    title: "",
    type: "",
    subject: "",
    imageSrc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setNewPost({ ...newPost, type: value });
  };

  const handleSubmit = () => {
    if (
      !newPost.title ||
      !newPost.type ||
      !newPost.subject ||
      !newPost.imageSrc
    ) {
      return alert("All fields are required!");
    }

    if (!types.includes(newPost.type)) {
      return alert("Invalid type");
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      type: newPost.type,
      subject: newPost.subject,
      source: newPost.imageSrc,
    };

    addPost(post); // Add new post

    // Reset form
    setNewPost({ title: "", type: "", subject: "", imageSrc: "" });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-lg h-[90vh] flex flex-col justify-between shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-xl text-center">Add New Image</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-6 overflow-hidden">
          <div className="space-y-2">
            <Label className="text-sm">Title</Label>
            <Input
              name="title"
              value={newPost.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="p-3"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Type</Label>
            <Select onValueChange={handleTypeChange}>
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
              value={newPost.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="p-3"
            />
          </div>

          <div className="space-y-2 flex-col">
            <Label className="text-sm">Image URL</Label>
            <Input
              name="imageSrc"
              value={newPost.imageSrc}
              onChange={handleChange}
              placeholder="Paste image URL"
              className="p-3"
            />
            {newPost.imageSrc && (
              <img
                src={newPost.imageSrc}
                alt="Preview"
                className="mt-3 h-60 w-full object-cover rounded-lg shadow-md"
              />
            )}
          </div>
        </CardContent>
        <div className="p-4">
          <Button
            onClick={handleSubmit}
            className="w-full py-3 text-lg bg-[#181832] text-white hover:bg-pink-600 transition"
          >
            Add Image
          </Button>
        </div>
      </Card>
    </div>
  );
}
