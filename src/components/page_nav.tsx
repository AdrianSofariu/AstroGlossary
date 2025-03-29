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
import { useRouter } from "next/navigation";

interface PaginationControlProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function PaginationControls({
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
}: PaginationControlProps) {
  const { pagination, setPagination } = usePosts();
  const router = useRouter();

  const page = pagination.page;
  const pageSize = pagination.limit;
  const totalPages = Math.ceil(pagination.total / pageSize);

  // Handle page click
  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
    router.push(`/?page=${pageNumber}&pageSize=${pageSize}`);
  };

  // Handle next page click
  const handleNextPage = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPagination((prev) => ({ ...prev, page: nextPage }));
      router.push(`/?page=${nextPage}&pageSize=${pageSize}`);
    }
  };

  // Handle previous page click
  const handlePreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPagination((prev) => ({ ...prev, page: prevPage }));
      router.push(`/?page=${prevPage}&pageSize=${pageSize}`);
    }
  };

  const getVisiblePages = () => {
    let visiblePages = [];
    let delta = 1;
    let currentPage = page;

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

    return visiblePages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious onClick={handlePreviousPage} />
          </PaginationItem>
        )}
        {getVisiblePages().map((pageNumber) =>
          typeof pageNumber === "number" ? (
            <PaginationItem key={pageNumber} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(pageNumber)}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ) : (
            //make key unique
            <PaginationItem
              key={`ellipsis-${Date.now.toString()}`}
              className="cursor-pointer"
            >
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        {hasNextPage && (
          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
