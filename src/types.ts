export type Post = {
  id: string;
  title: string;
  type: string;
  subject: string;
  source: string;
  date: Date;
};

export type UserPost = {
  post: Post;
};

export type UserPostList = {
  posts: Post[];
};
