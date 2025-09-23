import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { fetchVideosFromAPI } from "./api";
import BottomNav from "./components/BottomNav";
import CommentsModal from "./components/CommentsModal";
import ProfileHeader from "./components/ProfileHeader";
import ReactionsBar from "./components/ReactionsBar";
import { Comment, LikedPosts, VideoPost } from "./types";

const { height, width } = Dimensions.get("window");

export default function TikTokFeedScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<LikedPosts>({});
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const videoRefs = useRef<{ [key: number]: Video | null }>({});

  const loadVideos = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);
    try {
      const videoData = await fetchVideosFromAPI();
      setVideos(videoData);
    } catch (e) {
      console.error("Error cargando videos:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadVideos(); }, []);

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSave = (postId: number) => {
    setVideos(prev => prev.map(v => v.id === postId ? { ...v, isSaved: !v.isSaved } : v));
  };

  const openComments = (video: VideoPost) => {
    setSelectedVideo(video);
    setCommentsModalVisible(true);
  };

  const shareVideo = (video: VideoPost) => {
    console.log("Compartir video:", video.id);
    // TODO: lógica para compartir (Share API)
  };

  const addComment = (videoId: number, text: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const newComment: Comment = {
          id: Date.now(),
          user: { name: "Tú", avatar: "https://picsum.photos/50/50?random=user" },
          text,
          likes: 0,
          timestamp: "Ahora",
          isLiked: false,
        };
        return {
          ...v,
          comments: v.comments + 1,
          commentsList: [newComment, ...(v.commentsList || [])],
        };
      }
      return v;
    }));
  };

  const toggleCommentLike = (videoId: number, commentId: number) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId && v.commentsList) {
        return {
          ...v,
          commentsList: v.commentsList.map(c =>
            c.id === commentId ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked } : c
          ),
        };
      }
      return v;
    }));
  };

  const formatCount = (n: number) => (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toString());

  const setVideoRef = (instance: Video | null, id: number) => { videoRefs.current[id] = instance; };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
      Object.keys(videoRefs.current).forEach(key => {
        const id = parseInt(key);
        if (id !== viewableItems[0].item.id && videoRefs.current[id]) videoRefs.current[id]?.pauseAsync();
      });
      if (videoRefs.current[viewableItems[0].item.id]) videoRefs.current[viewableItems[0].item.id]?.playAsync();
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderVideo = ({ item, index }: { item: VideoPost; index: number }) => {
    const isActive = activeIndex === index;
    return (
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => setVideoRef(ref, item.id)}
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          isMuted={false}
          useNativeControls={false}
        />

        <View style={styles.videoOverlay}>
          {/* IZQUIERDA: perfil + descripción + sonido */}
          <View style={styles.leftContainer}>
            <ProfileHeader name={item.user.name} avatar={item.user.avatar} verified={item.user.verified} />
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.soundContainer}>
              <Ionicons name="musical-notes" size={14} color="#fff" />
              <Text style={styles.soundText}>{item.sound}</Text>
            </View>

            {/* Rankings (opcional, a modo de demo) */}
            {/* <View style={{ marginTop: 10 }}>
              <Rankings />
            </View> */}
          </View>

          {/* DERECHA: Reacciones/Compartido/Guardado */}
          <ReactionsBar
            item={item}
            likedPosts={likedPosts}
            onToggleLike={toggleLike}
            onOpenComments={openComments}
            onShare={shareVideo}
            onToggleSave={toggleSave}
            formatCount={formatCount}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="search" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Para ti</Text>
          <Text style={styles.tab}>Siguiendo</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(it) => it.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={height}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadVideos(true)} colors={["#2e7d32"]} tintColor="#2e7d32" />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Ionicons name="videocam-off" size={48} color="#666" />
            <Text style={styles.emptyText}>No hay videos disponibles</Text>
          </View>
        }
      />

      {/* Comentarios */}
      <CommentsModal
        visible={commentsModalVisible}
        video={selectedVideo}
        onClose={() => setCommentsModalVisible(false)}
        onAddComment={addComment}
        onToggleCommentLike={toggleCommentLike}
        formatCount={formatCount}
      />

      {/* Bottom Nav */}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { color: "#fff", marginTop: 16, fontSize: 16 },
  emptyText: { color: "#666", marginTop: 16, fontSize: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 },
  tabContainer: { flexDirection: "row" },
  tab: { color: "#fff", fontSize: 16, fontWeight: "600", marginHorizontal: 10, opacity: 0.7 },
  activeTab: { opacity: 1 },
  videoContainer: { width, height, backgroundColor: "#000" },
  video: { width: "100%", height: "100%" },
  videoOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, top: 0, flexDirection: "row", justifyContent: "space-between", padding: 16, paddingBottom: 100 },
  leftContainer: { alignSelf: "flex-end", maxWidth: "70%" },
  description: { color: "#fff", fontSize: 14, marginBottom: 8 },
  soundContainer: { flexDirection: "row", alignItems: "center" },
  soundText: { color: "#fff", fontSize: 12, marginLeft: 4 },
});
