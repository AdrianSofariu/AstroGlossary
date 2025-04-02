/**
 * @jest-environment node
 */

// tests/api/posts.test.ts
import { GET, POST, PUT } from "@/app/api/posts/route";
import { posts as mockPosts } from "@/app/data/posts";
import { Post } from "@/types";

// Mock the posts and types data
jest.mock("@/app/data/posts", () => ({
  posts: [
    {
      id: "1",
      title: "First Post",
      source: "source1",
      type: "type1",
      date: new Date(2023, 0, 1),
      subject: "subject1",
    },
    {
      id: "2",
      title: "Second Post",
      source: "source2",
      type: "type2",
      date: new Date(2023, 0, 2),
      subject: "subject2",
    },
    {
      id: "3",
      title: "Third Post",
      source: "source3",
      type: "type1",
      date: new Date(2023, 0, 3),
      subject: "subject3",
    },
  ],
}));

jest.mock("@/app/data/types", () => ({
  types: ["type1", "type2", "type3"],
}));

describe("GET /api/posts", () => {
  beforeEach(() => {
    // Reset mock posts to initial state before each test
    mockPosts.length = 0;
    mockPosts.push(
      {
        id: "1",
        title: "First Post",
        source: "source1",
        type: "type1",
        date: new Date(2023, 0, 1),
        subject: "subject1",
      },
      {
        id: "2",
        title: "Second Post",
        source: "source2",
        type: "type2",
        date: new Date(2023, 0, 2),
        subject: "subject2",
      },
      {
        id: "3",
        title: "Third Post",
        source: "source3",
        type: "type1",
        date: new Date(2023, 0, 3),
        subject: "subject3",
      }
    );
  });

  it("should return all posts when no filters are applied", async () => {
    const req = new Request("http://localhost/api/posts");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBe(3);
    expect(data.total).toBe(3);
  });

  it("should filter posts by search term", async () => {
    const req = new Request("http://localhost/api/posts?search=second");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBe(1);
    expect(data.posts[0].title).toBe("Second Post");
    expect(data.total).toBe(1);
  });

  it("should filter posts by type", async () => {
    const req = new Request("http://localhost/api/posts?types=type1");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBe(2);
    expect(data.posts.every((post: Post) => post.type === "type1")).toBe(true);
    expect(data.total).toBe(2);
  });

  it("should filter posts by multiple types", async () => {
    const req = new Request("http://localhost/api/posts?types=type1,type2");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBe(3);
    expect(data.total).toBe(3);
  });

  it("should paginate posts correctly", async () => {
    const req = new Request("http://localhost/api/posts?page=2&limit=1");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBe(1);
    expect(data.posts[0].title).toBe("Second Post");
    expect(data.page).toBe(2);
    expect(data.limit).toBe(1);
    expect(data.total).toBe(3);
  });

  it("should combine search, type filter and pagination", async () => {
    const req = new Request(
      "http://localhost/api/posts?search=post&types=type1&page=1&limit=1"
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBe(1);
    expect(data.posts[0].type).toBe("type1");
    expect(data.posts[0].title.toLowerCase()).toContain("post");
    expect(data.page).toBe(1);
    expect(data.limit).toBe(1);
    expect(data.total).toBe(2);
  });
});

describe("POST /api/posts", () => {
  beforeEach(() => {
    // Reset mock posts to initial state before each test
    mockPosts.length = 0;
    mockPosts.push({
      id: "1",
      title: "First Post",
      source: "source1",
      type: "type1",
      date: new Date(2023, 0, 1),
      subject: "subject1",
    });
  });

  it("should create a new post with valid data", async () => {
    const newPost: Post = {
      id: "2",
      title: "New Post",
      source: "source2",
      type: "type2",
      date: new Date(2023, 0, 2),
      subject: "subject2",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Post created successfully");
    expect(mockPosts.length).toBe(2);
    expect(mockPosts[0].id).toBe("2"); // Should be added at the beginning
  });

  it("should return 400 if required fields are missing", async () => {
    const invalidPost = {
      id: "2",
      title: "New Post",
      // Missing source, type, date, subject
    };

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidPost),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("All fields are required");
    expect(mockPosts.length).toBe(1);
  });

  it("should return 409 if post with same ID exists", async () => {
    const duplicatePost: Post = {
      id: "1", // Same ID as existing post
      title: "Duplicate Post",
      source: "source2",
      type: "type2",
      date: new Date(2023, 0, 2),
      subject: "subject2",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(duplicatePost),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe("Post with this ID already exists");
    expect(mockPosts.length).toBe(1);
  });

  it("should return 400 if type is invalid", async () => {
    const invalidTypePost: Post = {
      id: "2",
      title: "New Post",
      source: "source2",
      type: "invalid-type", // Not in mockTypes
      date: new Date(2023, 0, 2),
      subject: "subject2",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTypePost),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Invalid type");
    expect(mockPosts.length).toBe(1);
  });

  it("should return 400 if title does not start with a letter", async () => {
    const invalidTitlePost: Post = {
      id: "2",
      title: "1New Post", // Starts with number
      source: "source2",
      type: "type2",
      date: new Date(2023, 0, 2),
      subject: "subject2",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTitlePost),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Title must start with a letter");
    expect(mockPosts.length).toBe(1);
  });

  it("should return 400 if date is invalid", async () => {
    const invalidDatePost: Post = {
      id: "2",
      title: "New Post",
      source: "source2",
      type: "type2",
      date: new Date("invalid-date"), // Invalid date
      subject: "subject2",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidDatePost),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data.message).toBe("All fields are required");
    expect(mockPosts.length).toBe(1);
    expect(response.status).toBe(400);
  });
});

describe("PUT /api/posts", () => {
  beforeEach(() => {
    // Reset mock posts to initial state before each test
    mockPosts.length = 0;
    mockPosts.push({
      id: "1",
      title: "First Post",
      source: "source1",
      type: "type1",
      date: new Date(2023, 0, 1),
      subject: "subject1",
    });
  });

  it("should update an existing post with valid data", async () => {
    const updatedPost: Post = {
      id: "1",
      title: "Updated Post",
      source: "source1", // Must match original
      type: "type2", // Can change to another valid type
      date: new Date(2023, 0, 1), // Must match original
      subject: "updated-subject",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Post updated successfully");
    expect(mockPosts.length).toBe(1);
    expect(mockPosts[0].title).toBe("Updated Post");
    expect(mockPosts[0].type).toBe("type2");
    expect(mockPosts[0].subject).toBe("updated-subject");
  });

  it("should return 404 if post does not exist", async () => {
    const nonExistentPost: Post = {
      id: "999",
      title: "Non-existent Post",
      source: "source1",
      type: "type1",
      date: new Date(2023, 0, 1),
      subject: "subject1",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nonExistentPost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe("Post not found");
    expect(mockPosts.length).toBe(1);
  });

  it("should return 400 if required fields are missing", async () => {
    const invalidPost = {
      id: "1",
      title: "Updated Post",
      // Missing source, type, date, subject
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidPost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("All fields are required");
    expect(mockPosts[0].title).toBe("First Post"); // Should not be updated
  });

  it("should return 400 if type is invalid", async () => {
    const invalidTypePost: Post = {
      id: "1",
      title: "Updated Post",
      source: "source1",
      type: "invalid-type", // Not in mockTypes
      date: new Date(2023, 0, 1),
      subject: "subject1",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTypePost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Invalid type");
    expect(mockPosts[0].type).toBe("type1"); // Should not be updated
  });

  it("should return 400 if title does not start with a letter", async () => {
    const invalidTitlePost: Post = {
      id: "1",
      title: "1Updated Post", // Starts with number
      source: "source1",
      type: "type1",
      date: new Date(2023, 0, 1),
      subject: "subject1",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTitlePost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Title must start with a letter");
    expect(mockPosts[0].title).toBe("First Post"); // Should not be updated
  });

  it("should return 400 if source is changed", async () => {
    const changedSourcePost: Post = {
      id: "1",
      title: "Updated Post",
      source: "new-source", // Different from original
      type: "type1",
      date: new Date(2023, 0, 1),
      subject: "subject1",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedSourcePost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Source cannot be changed");
    expect(mockPosts[0].source).toBe("source1"); // Should not be updated
  });

  it("should return 400 if date is changed", async () => {
    const changedDatePost: Post = {
      id: "1",
      title: "Updated Post",
      source: "source1",
      type: "type1",
      date: new Date(2023, 0, 10), // Different from original
      subject: "subject1",
    };

    const req = new Request("http://localhost/api/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedDatePost),
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Date cannot be changed");
    expect(mockPosts[0].date.getTime()).toBe(new Date(2023, 0, 1).getTime()); // Should not be updated
  });
});
