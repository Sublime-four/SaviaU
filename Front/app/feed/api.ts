import { VideoPost } from "./types";

export const fetchVideosFromAPI = async (): Promise<VideoPost[]> => {
  await new Promise(res => setTimeout(res, 1500));
  return [
    {
      id: 1,
      title: "Ecología Hoy",
      description: "Récord histórico de reforestación en el Amazonas #ecología #naturaleza",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
      likes: 2450,
      comments: 32,
      shares: 18,
      user: {
        name: "Ecología Hoy",
        avatar: "https://picsum.photos/50/50?random=10",
        verified: true
      },
      sound: "Sonido original - Ecología Hoy",
      commentsList: [
        {
          id: 1,
          user: { name: "Usuario1", avatar: "https://picsum.photos/50/50?random=21" },
          text: "¡Increíble trabajo! 🌿",
          likes: 24,
          timestamp: "2h ago"
        },
        {
          id: 2,
          user: { name: "Usuario2", avatar: "https://picsum.photos/50/50?random=22" },
          text: "Necesitamos más iniciativas como esta",
          likes: 18,
          timestamp: "1h ago"
        }
      ]
    },
  ];
};
