import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { usePosts } from "@/app/context";
import { useRouter, useParams } from "next/navigation";
import SinglePostPage from "@/app/posts/[postId]/page";
import EditPostDialog from "@/components/edit-post-dialog";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock context
jest.mock("@/app/context", () => ({
  usePosts: jest.fn(),
}));

// Mock EditPostDialog to prevent UI crashes
jest.mock("@/components/edit-post-dialog", () => () => (
  <div data-testid="edit-dialog">Edit Dialog</div>
));

describe("SinglePostPage Component", () => {
  const mockDeletePost = jest.fn();
  const mockUpdatePost = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ postId: "1" });

    (usePosts as jest.Mock).mockReturnValue({
      posts: [
        {
          id: "1",
          title: "Test Post",
          type: "Landscape",
          subject: "A beautiful landscape",
          source: "/test-image.jpg",
          date: new Date(2025, 2, 19),
        },
      ],
      deletePost: mockDeletePost,
      updatePost: mockUpdatePost,
      types: ["Landscape", "Portrait", "Abstract"],
    });
  });

  test("renders post details correctly", () => {
    render(<SinglePostPage />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Type: Landscape")).toBeInTheDocument();
    expect(screen.getByText("A beautiful landscape")).toBeInTheDocument();
    expect(screen.getByText("19/03/2025")).toBeInTheDocument();
    expect(screen.getByTestId("edit-dialog")).toBeInTheDocument(); // Ensures EditPostDialog renders
  });

  test("shows 'Post not found' if post does not exist", () => {
    (usePosts as jest.Mock).mockReturnValue({ posts: [] });
    render(<SinglePostPage />);

    expect(screen.getByText("Post not found.")).toBeInTheDocument();
  });

  test("opens delete confirmation dialog", () => {
    render(<SinglePostPage />);
    fireEvent.click(screen.getByTestId("delete-post"));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
  });

  test("cancels delete action", () => {
    render(<SinglePostPage />);
    fireEvent.click(screen.getByTestId("delete-post"));

    fireEvent.click(screen.getByTestId("cancelDelete"));
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    expect(mockDeletePost).not.toHaveBeenCalled();
  });

  test("deletes post and redirects", async () => {
    render(<SinglePostPage />);
    fireEvent.click(screen.getByTestId("delete-post"));

    fireEvent.click(screen.getByTestId("confirmDelete"));

    await waitFor(() => {
      expect(mockDeletePost).toHaveBeenCalledWith("1");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
