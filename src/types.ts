export type Post = {
  id: string;
  title: string;
  type: string;
  subject: string;
  source: string;
  date: Date;
  user_id: string;
};

export type PostWithUser = {
  id: string;
  title: string;
  type: string;
  subject: string;
  source: string;
  date: Date;
  user_id: string;
  username: string;
};

export type UserPost = {
  post: Post;
};

export type UserPostWithUser = {
  post: PostWithUser;
};

export type UserPostList = {
  posts: Post[];
};
