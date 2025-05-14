/**
 * @jest-environment node
 */
import { GET, DELETE } from "@/app/api/posts/[id]/route";
import { posts as mockPosts } from "@/app/data/posts";

// Mock the posts data
jest.mock("@/app/data/posts", () => ({
  posts: [
    {
      id: "1",
      title: "First Post",
      type: "Type 1",
      subject: "Subject 1",
      source: "Source 1",
      date: new Date("2023-01-01"),
      user_id: "1",
    },
    {
      id: "2",
      title: "Second Post",
      type: "Type 2",
      subject: "Subject 2",
      source: "Source 2",
      date: new Date("2023-01-02"),
      user_id: "2",
    },
  ],
}));

// Mock the URL and Request objects
beforeAll(() => {
  global.URL = class MockURL {
    public pathname: string;
    public searchParams: URLSearchParams;

    constructor(url: string) {
      this.pathname = url.split("?")[0];
      this.searchParams = new URLSearchParams(url.split("?")[1]);
    }
  } as any;
});

describe("GET /api/posts/[id]", () => {
  beforeEach(() => {
    // Reset mock posts before each test
    mockPosts.length = 0;
    mockPosts.push(
      {
        id: "1",
        title: "First Post",
        type: "Type 1",
        subject: "Subject 1",
        source: "Source 1",
        date: new Date("2023-01-01"),
        user_id: "1",
      },
      {
        id: "2",
        title: "Second Post",
        type: "Type 2",
        subject: "Subject 2",
        source: "Source 2",
        date: new Date("2023-01-02"),
        user_id: "2",
      }
    );
  });

  it("should return a post when valid ID is provided", async () => {
    const req = new Request("http://localhost/api/posts/1");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("1");
    expect(data.title).toBe("First Post");
  });

  it("should return 404 when post is not found", async () => {
    const req = new Request("http://localhost/api/posts/999");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe("Post not found");
  });

  it("should return 400 when ID is missing", async () => {
    const req = new Request("http://localhost/api/posts/");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Post ID is required");
  });
});

describe("DELETE /api/posts/[id]", () => {
  beforeEach(() => {
    // Reset mock posts before each test
    mockPosts.length = 0;
    mockPosts.push(
      {
        id: "1",
        title: "First Post",
        type: "Type 1",
        subject: "Subject 1",
        source: "Source 1",
        date: new Date("2023-01-01"),
        user_id: "1",
      },
      {
        id: "2",
        title: "Second Post",
        type: "Type 2",
        subject: "Subject 2",
        source: "Source 2",
        date: new Date("2023-01-02"),
        user_id: "2",
      }
    );
  });

  it("should delete a post when valid ID is provided", async () => {
    const req = new Request("http://localhost/api/posts/1", {
      method: "DELETE",
    });
    const response = await DELETE(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Post deleted successfully");
    expect(mockPosts.length).toBe(1);
    expect(mockPosts.find((p) => p.id === "1")).toBeUndefined();
  });

  it("should return 404 when post to delete is not found", async () => {
    const req = new Request("http://localhost/api/posts/999", {
      method: "DELETE",
    });
    const response = await DELETE(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe("Post not found");
    expect(mockPosts.length).toBe(2);
  });

  it("should return 400 when ID is missing", async () => {
    const req = new Request("http://localhost/api/posts/", {
      method: "DELETE",
    });
    const response = await DELETE(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Post ID is required");
    expect(mockPosts.length).toBe(2);
  });
});
