import { usePosts } from "@/app/context";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function PaginationControls({
  hasNextPage,
  hasPreviousPage,
}: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "8";
  const totalPages = Math.ceil(
    usePosts().getFilteredPosts().length / parseInt(pageSize)
  );

  const getVisiblePages = () => {
    let visiblePages = [];
    let delta = 1;

    let currentPage = Number(page);

    //always show the first page and the page before the current page
    if (currentPage - delta > 2) {
      visiblePages.push(1, "...", currentPage - 1);
    } else {
      for (let i = 1; i < currentPage; i++) visiblePages.push(i);
    }

    //current page
    visiblePages.push(currentPage);

    //always show the last page and the page after the current page
    if (currentPage + delta < totalPages - 1) {
      visiblePages.push(currentPage + 1, "...", totalPages);
    } else {
      for (let i = currentPage + 1; i <= totalPages; i++) visiblePages.push(i);
    }

    //let startPage = Math.max(1, Number(page) - Math.floor(Number(page) / 2));
    //let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    //if (endPage - startPage < maxVisiblePages - 1) {
    //  startPage = Math.max(1, endPage - maxVisiblePages + 1);
    //}

    //for (let i = startPage; i <= endPage; i++) {
    //  visiblePages.push(i);
    //}

    return visiblePages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={() => {
                router.push(
                  `/?page=${parseInt(page) - 1}&pageSize=${pageSize}`
                );
              }}

              //href={`/?page=${parseInt(page) - 1}&pageSize=${pageSize}`}
            />
          </PaginationItem>
        )}
        {getVisiblePages().map((pageNumber) =>
          typeof pageNumber === "number" ? (
            <PaginationItem key={pageNumber} className="cursor-pointer">
              <PaginationLink
                onClick={() => {
                  router.push(`/?page=${pageNumber}&pageSize=${pageSize}`);
                }}
                isActive={pageNumber === parseInt(page)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key="ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        {hasNextPage && (
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={() => {
                router.push(
                  `/?page=${parseInt(page) + 1}&pageSize=${pageSize}`
                );
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
