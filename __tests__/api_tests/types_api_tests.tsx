/**
 * @jest-environment node
 */
import { GET } from "@/app/api/types/route";
import { types as mockTypes } from "@/app/data/types";

// Mock the types data
jest.mock("@/app/data/types", () => ({
  types: ["tutorial", "article", "news", "guide"],
}));

describe("GET /api/types", () => {
  beforeEach(() => {
    // Reset mock data if needed
    mockTypes.length = 0;
    mockTypes.push("tutorial", "article", "news", "guide");
  });

  it("should return all types with 200 status", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(["tutorial", "article", "news", "guide"]);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(4);
  });

  it("should return empty array if no types exist", async () => {
    // Override mock for this specific test
    mockTypes.length = 0;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(data.length).toBe(0);
  });
});
