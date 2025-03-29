import { renderHook, act } from "@testing-library/react";
import { Post, UserPost, UserPostList } from "@/types";
import { ContextProvider, usePosts } from "@/app/context";
//test crud operations
describe("ContextProvider", () => {
  //mock window alert
  beforeAll(() => {
    global.alert = jest.fn(); // Mock window.alert to prevent errors
  });

  //test add post
  it("should add a post", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.addPost({
        id: "1",
        title: "title",
        type: "galaxy",
        subject: "subject",
        source: "source",
        date: new Date(),
      });
    });

    expect(result.current.posts.length).toBe(38);
  });

  //test adding invalid type post
  it("should not add a post with invalid type", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.addPost({
        id: "1",
        title: "title",
        type: "invalid",
        subject: "subject",
        source: "source",
        date: new Date(),
      });
    });

    expect(result.current.posts.length).toBe(37);
  });

  //test update post
  it("should update a post", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.updatePost("1", {
        id: "1",
        title: "title",
        type: "Galaxy",
        subject: "subject",
        source: "source",
        date: new Date(),
      });
    });

    expect(result.current.posts[0].title).toBe("title");
  });

  //test delete post
  it("should delete a post", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ContextProvider,
    });

    act(() => {
      result.current.deletePost("1");
    });

    expect(result.current.posts.length).toBe(36);
  });
});
