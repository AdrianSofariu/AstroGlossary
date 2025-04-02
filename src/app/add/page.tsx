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
import axios from "axios";

function startsWithLetter(str: string) {
  return /^[A-Za-z]/.test(str);
}

export default function AddImagePage() {
  const { types, addPost } = usePosts(); // Get types from context
  const [newPost, setNewPost] = useState({
    title: "",
    type: "",
    subject: "",
    imageFile: null as File | null,
    imageSrc: "", // This will store the URL after upload
  });

  // Handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle the image type selection
  const handleTypeChange = (value: string) => {
    setNewPost({ ...newPost, type: value });
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPost({ ...newPost, imageFile: file });
    }
  };

  // Upload image to the server
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${process.env.API_CONNECTION_STRING}/images/`, // Your backend upload endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.fileUrl; // Return the uploaded file URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !newPost.title ||
      !newPost.type ||
      !newPost.subject ||
      !newPost.imageFile
    ) {
      return alert("All fields are required!");
    }

    if (!types.includes(newPost.type)) {
      return alert("Invalid type");
    }

    if (startsWithLetter(newPost.title) === false) {
      return alert("Title must start with a letter");
    }

    // Upload the image file and get the URL
    const imageUrl = await uploadImage(newPost.imageFile);

    if (!imageUrl) {
      return alert("Image upload failed!");
    }

    // Create the new post object
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      type: newPost.type,
      subject: newPost.subject,
      source: imageUrl, // Store the image URL
      date: new Date(),
    };

    addPost(post); // Add the new post

    // Reset the form
    setNewPost({
      title: "",
      type: "",
      subject: "",
      imageFile: null,
      imageSrc: "",
    });
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
                  <SelectItem key={type} value={type} title={type}>
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

          <div className="space-y-2">
            <Label className="text-sm">Image Upload</Label>
            <Input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="p-3"
            />
            {newPost.imageFile && (
              <div className="mt-3">
                <p>File selected: {newPost.imageFile.name}</p>
              </div>
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
