/**
 * @jest-environment node
 */
import { GET } from "@/app/api/posts/all/route";
import { posts as mockPosts } from "@/app/data/posts";
import { Post } from "@/types";
import { mock } from "node:test";

// Mock the posts data with proper structure
jest.mock("@/app/data/posts", () => ({
  posts: [
    {
      id: "1",
      title: "First Post",
      type: "tutorial",
      subject: "Next.js",
      source: "blog",
      date: new Date(),
    },
    {
      id: "2",
      title: "Second Post",
      type: "article",
      subject: "TypeScript",
      source: "magazine",
      date: new Date(2023, 0, 2),
    },
  ] as Post[],
}));

describe("GET /api/posts/all", () => {
  beforeEach(() => {
    // Reset mock posts before each test
    mockPosts.length = 0;
    mockPosts.push(
      {
        id: "1",
        title: "First Post",
        type: "tutorial",
        subject: "Next.js",
        source: "blog",
        date: new Date(2023, 0, 1),
      },
      {
        id: "2",
        title: "Second Post",
        type: "article",
        subject: "TypeScript",
        source: "magazine",
        date: new Date(2023, 0, 2),
      }
    );
  });

  it("should return all posts with correct structure", async () => {
    const response = await GET(new Request("http://localhost/api/posts/all"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          type: expect.any(String),
          subject: expect.any(String),
          source: expect.any(String),
          date: expect.any(String), // Dates are stringified in JSON
        }),
      ]),
      total: 2,
    });
  });

  it("should return empty array when no posts exist", async () => {
    mockPosts.length = 0; // Clear posts

    const response = await GET(new Request("http://localhost/api/posts/all"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual([]);
    expect(data.total).toBe(0);
  });

  it("should return correct total count", async () => {
    // Add 3 more posts
    mockPosts.push(
      {
        id: "3",
        title: "Third Post",
        type: "news",
        subject: "React",
        source: "portal",
        date: new Date(2023, 0, 3),
      },
      {
        id: "4",
        title: "Fourth Post",
        type: "guide",
        subject: "JavaScript",
        source: "docs",
        date: new Date(2023, 0, 4),
      },
      {
        id: "5",
        title: "Fifth Post",
        type: "tutorial",
        subject: "CSS",
        source: "blog",
        date: new Date(2023, 0, 5),
      }
    );

    const response = await GET(new Request("http://localhost/api/posts/all"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(5);
    expect(data.posts.length).toBe(5);
  });

  it("should return proper content-type header", async () => {
    const response = await GET(new Request("http://localhost/api/posts/all"));
    expect(response.headers.get("content-type")).toBe("application/json");
  });
});
