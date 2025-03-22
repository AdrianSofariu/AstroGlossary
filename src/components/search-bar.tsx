"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { DropdownMenuCheckboxes } from "./type-filter";
import { usePosts } from "@/app/context";

export function SearchBar() {
  const { searchTerm, setSearchTerm } = usePosts();

  return (
    <div className="flex w-full max-w-lg items-center space-x-2  bg-pink-500 rounded-md py-2 px-10">
      <Input
        type="email"
        placeholder="Search"
        value={searchTerm}
        className="bg-white"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <Button type="submit"  size="icon" className="bg-[#181832] hover:bg-pink-600 transition"> */}
      <Search />
      {/* </Button> */}
      <DropdownMenuCheckboxes />
    </div>
  );
}
