import { renderHook, act } from "@testing-library/react";
import { Post, UserPost, UserPostList } from "@/types";
import { ContextProvider, usePosts } from "@/app/context";

describe("ContextProvider", () => {
  it("should initialize with default posts", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    expect(result.current.posts.length).toBeGreaterThan(0);
  });

  it("should filter posts based on checked types", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.setCheckedTypes({
        galaxy: false,
        nebula: true,
        planet: true,
        star: true,
        comet: true,
        planetoid: true,
        constellation: true,
      });
    });

    const filteredPosts = result.current.getFilteredPosts();
    expect(filteredPosts.every((post) => post.type !== "galaxy")).toBe(true);
  });

  it("should filter posts based on checked types", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.setCheckedTypes({
        galaxy: false,
        nebula: false,
        planet: false,
        star: false,
        comet: false,
        planetoid: false,
        constellation: false,
      });
    });

    const filteredPosts = result.current.getFilteredPosts();
    expect(filteredPosts.length).toBe(0);
  });

  it("should filter posts based on checked types", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.setCheckedTypes({
        galaxy: false,
        nebula: false,
        planet: false,
        star: false,
        comet: true,
        planetoid: false,
        constellation: false,
      });
    });

    const filteredPosts = result.current.getFilteredPosts();
    expect(filteredPosts.every((post) => post.type == "comet")).toBe(true);
  });

  it("should filter posts based on search term", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.setSearchTerm("Angel");
    });

    const filteredPosts = result.current.getFilteredPosts();
    expect(filteredPosts.length).toBeGreaterThan(0);
    expect(filteredPosts.every((post) => post.title.includes("Angel"))).toBe(
      true
    );
  });
});
