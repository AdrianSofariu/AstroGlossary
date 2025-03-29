"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, Filter } from "lucide-react";
import { usePosts } from "@/app/context";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function DropdownPageSize() {
  const router = useRouter();
  const { setPagination } = usePosts();

  const changePageSize = (newPageSize: string) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit: parseInt(newPageSize),
    }));
    router.push(`/?page=${1}&pageSize=${newPageSize}`);
  };

  return (
    <DropdownMenu onOpenChange={(open) => !open}>
      <DropdownMenuTrigger asChild>
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="hover:bg-pink-600 transition"
        >
          <Bookmark />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => changePageSize("4")}>
          4
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changePageSize("6")}>
          6
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changePageSize("8")}>
          8
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
