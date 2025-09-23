import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LikedPosts, VideoPost } from "../types";

type Props = {
  item: VideoPost;
  likedPosts: LikedPosts;
  onToggleLike: (id: number) => void;
  onOpenComments: (video: VideoPost) => void;
  onShare: (video: VideoPost) => void;
  onToggleSave: (id: number) => void;
  formatCount: (n: number) => string;
};

export default function ReactionsBar({
  item,
  likedPosts,
  onToggleLike,
  onOpenComments,
  onShare,
  onToggleSave,
  formatCount,
}: Props) {
  const liked = !!likedPosts[item.id];
  const saved = !!item.isSaved;

  return (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.btn} onPress={() => onToggleLike(item.id)}>
        <Ionicons name={liked ? "heart" : "heart-outline"} size={28} color={liked ? "#ff4d4f" : "#fff"} />
        <Text style={styles.count}>{formatCount(item.likes + (liked ? 1 : 0))}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onOpenComments(item)}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
        <Text style={styles.count}>{formatCount(item.comments)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onShare(item)}>
        <Ionicons name="share-social-outline" size={28} color="#fff" />
        <Text style={styles.count}>{formatCount(item.shares)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onToggleSave(item.id)}>
        <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={28} color={saved ? "#2e7d32" : "#fff"} />
        <Text style={styles.count}>{saved ? "Guardado" : "Guardar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { alignSelf: "flex-end", alignItems: "center" },
  btn: { alignItems: "center", marginVertical: 10 },
  count: { color: "#fff", fontSize: 12, marginTop: 4 },
});
