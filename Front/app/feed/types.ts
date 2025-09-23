// Tipos compartidos
export type Comment = {
  id: number;
  user: { name: string; avatar: string; verified?: boolean };
  text: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
};

export type VideoPost = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  user: { name: string; avatar: string; verified?: boolean };
  sound: string;
  commentsList?: Comment[];
  isSaved?: boolean;
};

export type LikedPosts = { [key: number]: boolean };
