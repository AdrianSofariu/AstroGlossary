"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { usePosts } from "@/app/context";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function DropdownMenuCheckboxes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let pageSize = searchParams.get("pageSize") ?? "8";

  const { types, checkedTypes, setCheckedTypes, setPagination } = usePosts();

  const [tempCheckedTypes, setTempCheckedTypes] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    setTempCheckedTypes(checkedTypes);
  }, [checkedTypes]);

  const handleCheckedChange = (type: string, checked: boolean) => {
    setTempCheckedTypes((prev) => ({
      ...prev,
      [type]: checked,
    }));
    //set first page when filter changes
  };

  const handleDropdownClose = () => {
    if (JSON.stringify(checkedTypes) !== JSON.stringify(tempCheckedTypes)) {
      // Redirect to the first page if the types are different
      router.push(`/?page=1&pageSize=${pageSize}`);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
    setCheckedTypes(tempCheckedTypes);
  };

  return (
    <DropdownMenu onOpenChange={(open) => !open && handleDropdownClose()}>
      <DropdownMenuTrigger asChild>
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="hover:bg-pink-600 transition"
        >
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {types.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={tempCheckedTypes[type] ?? true}
            onSelect={(e) => {
              e.preventDefault();
            }}
            onCheckedChange={(checked) => handleCheckedChange(type, checked)}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
