import PostGrid from "@/components/gallery";
import { SearchBar } from "@/components/search-bar";
import StatusBanner from "@/components/status-banner";
import { Pagination } from "@/components/ui/pagination";
import { Suspense } from "react";

export default function Home() {
  return (
    /*<div className="pl-8">
      <h1 className="text-4xl font-bold text-left text-black align-baseline">Your Gallery</h1>
      <PostGrid/>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>*/
    <div className="pl-8 w-full flex-row">
      <StatusBanner />
      <div className="flex justify-center w-full">
        <Suspense
          fallback={
            <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md" />
          }
        >
          <SearchBar />
        </Suspense>
      </div>
      <PostGrid />
      <Pagination />
    </div>
  );
}
