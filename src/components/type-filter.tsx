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

  const { types, checkedTypes, setCheckedTypes } = usePosts();

  const [tempCheckedTypes, setTempCheckedTypes] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    setTempCheckedTypes(checkedTypes);
    console.log(checkedTypes);
    console.log(tempCheckedTypes);
  }, [checkedTypes]);

  const handleCheckedChange = (type: string, checked: boolean) => {
    setTempCheckedTypes((prev) => ({
      ...prev,
      [type]: checked,
    }));
    //set first page when filter changes
    router.push(`/?page=1&pageSize=${pageSize}`);
  };

  const handleDropdownClose = () => {
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
