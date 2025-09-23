import React from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Comment, VideoPost } from "../types";

type Props = {
  visible: boolean;
  video: VideoPost | null;
  onClose: () => void;
  onAddComment: (videoId: number, text: string) => void;
  onToggleCommentLike: (videoId: number, commentId: number) => void;
  formatCount: (n: number) => string;
};

export default function CommentsModal({ visible, video, onClose, formatCount }: Props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.wrap}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Comentarios</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.close}>Cerrar</Text></TouchableOpacity>
          </View>

          {video?.commentsList?.length ? (
            <FlatList
              data={video.commentsList}
              keyExtractor={(c: Comment) => c.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.user.name}</Text>
                  <Text style={styles.text}>{item.text}</Text>
                  <Text style={styles.meta}>{formatCount(item.likes)} • {item.timestamp}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={{ color: "#aaa" }}>Sé el primero en comentar</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: "#111", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "70%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { color: "#fff", fontWeight: "700", fontSize: 16 },
  close: { color: "#2e7d32", fontWeight: "700" },
  item: { marginBottom: 12 },
  name: { color: "#fff", fontWeight: "700" },
  text: { color: "#ddd", marginTop: 2 },
  meta: { color: "#888", marginTop: 4, fontSize: 12 },
});
