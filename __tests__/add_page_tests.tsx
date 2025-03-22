import { render, screen, fireEvent } from "@testing-library/react";
import { Post, UserPost, UserPostList } from "@/types";
import AddImagePage from "@/app/add/page";
import { usePosts } from "@/app/context";

// Mock usePosts context with correct TypeScript types
jest.mock("@/app/context", () => ({
  usePosts: jest.fn(),
}));

describe("AddImagePage Component", () => {
  let mockAddPost: jest.Mock;

  beforeEach(() => {
    mockAddPost = jest.fn();

    (usePosts as jest.Mock).mockReturnValue({
      types: ["Landscape", "Portrait", "Abstract"], // Mock available types
      addPost: mockAddPost, // Mock function
    });
  });

  test("renders form inputs and button", () => {
    render(<AddImagePage />);

    // Check if all input fields are rendered
    expect(screen.getByPlaceholderText("Enter title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter subject")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Paste image URL")).toBeInTheDocument();
    expect(screen.getByText("Add Image")).toBeInTheDocument();
  });

  test("shows an alert when submitting with missing fields", () => {
    global.alert = jest.fn(); // Mock window.alert

    render(<AddImagePage />);

    const addButton = screen.getByText("Add Image");
    fireEvent.click(addButton); // Click submit button

    expect(global.alert).toHaveBeenCalledWith("All fields are required!");
  });

  test("submits a valid form and calls addPost", () => {
    render(<AddImagePage />);

    // Fill in inputs
    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "Beautiful Sunset" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: { value: "Nature" },
    });
    fireEvent.change(screen.getByPlaceholderText("Paste image URL"), {
      target: { value: "https://example.com/image.jpg" },
    });

    // Select type from dropdown
    fireEvent.click(screen.getByText("Select type"));
    // Click on the "Landscape" option
    fireEvent.click(screen.getByTitle("Landscape"));

    // Submit form
    fireEvent.click(screen.getByText("Add Image"));

    // Ensure addPost is called with expected data
    expect(mockAddPost).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String), // ID is generated dynamically
        title: "Beautiful Sunset",
        type: "Landscape",
        subject: "Nature",
        source: "https://example.com/image.jpg",
        date: expect.any(Date), // Ensure date is included
      })
    );
  });

  test("shows an alert when title does not start with a letter", () => {
    global.alert = jest.fn(); // Mock window.alert

    render(<AddImagePage />);

    // Fill in inputs
    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "123 Sunset" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: { value: "Nature" },
    });
    fireEvent.change(screen.getByPlaceholderText("Paste image URL"), {
      target: { value: "https://example.com/image.jpg" },
    });

    // Select type
    fireEvent.click(screen.getByText("Select type"));
    fireEvent.click(screen.getByText("Landscape"));

    // Submit form
    fireEvent.click(screen.getByText("Add Image"));

    expect(global.alert).toHaveBeenCalledWith("Title must start with a letter");
  });
});
