import { render, screen } from "@testing-library/react";
import { usePosts } from "@/app/context";
import { UserPost, Post } from "@/types";
import { isToday, isThisWeek } from "date-fns";
import "@testing-library/jest-dom";
import Link from "next/link";
import PostGrid, { BlurImage } from "@/components/gallery";

// Mock usePosts
jest.mock("@/app/context", () => ({
  usePosts: jest.fn(),
}));

//mock navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    query: {},
  }),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Today's Post",
    type: "News",
    subject: "Breaking News",
    source: "/image1.jpg",
    date: new Date(), // Today
  },
  {
    id: "2",
    title: "Weekly Post",
    type: "Article",
    subject: "Tech Update",
    source: "/image2.jpg",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (This week)
  },
  {
    id: "3",
    title: "Old Post",
    type: "Blog",
    subject: "History",
    source: "/image3.jpg",
    date: new Date("2023-01-01"), // Older post
  },
];

describe("PostGrid Component", () => {
  beforeEach(() => {
    (usePosts as jest.Mock).mockReturnValue({
      getFilteredPosts: jest.fn(() => mockPosts),
    });
  });

  test("renders posts correctly", () => {
    render(<PostGrid />);

    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });
});

describe("BlurImage Component", () => {
  test("renders the image with correct attributes", () => {
    render(<BlurImage post={mockPosts[0]} />); // Pass post correctly

    const img = screen.getByTestId("image");
    expect(img).toHaveAttribute(
      "src",
      "/_next/image?url=%2Fimage1.jpg&w=3840&q=75"
    );
  });

  test("renders link to correct post", () => {
    render(<BlurImage post={mockPosts[0]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/posts/${mockPosts[0].id}`);
  });

  test("applies correct border color based on date", () => {
    render(<BlurImage post={mockPosts[0]} />);
    const container = screen.getByRole("link").parentElement;

    if (isToday(mockPosts[0].date)) {
      expect(container).toHaveClass("border-pink-500");
    } else if (isThisWeek(mockPosts[0].date, { weekStartsOn: 1 })) {
      expect(container).toHaveClass("border-cyan-500");
    } else {
      expect(container).toHaveClass("[border-color:#181832]");
    }
  });
});
