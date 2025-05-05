import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SelectedMedia = Array<{
  id: string;
  uri: string;
  type: "image" | "document" | "video";
  name?: string;
  size?: number;
}>;

type Props = {
  selectedMedia: SelectedMedia;
  onRemove?: (itemId: string) => void;
};

export function PreviewItems({ selectedMedia, onRemove }: Props) {
  return (
    <View style={styles.inlinePreviewContainer}>
      <FlatList
        data={selectedMedia}
        keyExtractor={({ id }, index) => `${id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.previewScrollContent}
        renderItem={({ item }) => {
          return <RenderFlatListItem item={item} onRemove={onRemove} />;
        }}
      />
    </View>
  );
}

function RenderFlatListItem({
  item,
  onRemove,
}: {
  item: SelectedMedia[0];
  onRemove?: (itemId: string) => void;
}) {
  return (
    <View style={styles.inlinePreviewItem}>
      {item.type === "image" ? (
        <Image source={{ uri: item.uri }} style={styles.inlinePreviewImage} />
      ) : (
        <View style={styles.inlineDocumentPreview}>
          <Ionicons name="document" size={20} color={COLORS.PRIMARYBLUE} />
          <Text numberOfLines={1} style={styles.inlineDocumentName}>
            {item.name || "Document"}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.inlineRemoveButton}
        onPress={() => onRemove?.(item.id)}
      >
        <Ionicons name="close-circle-outline" size={16} color={COLORS.WHITE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  previewScrollContent: {
    paddingVertical: 6,
    paddingRight: 8,
    gap: 10,
  },
  inlinePreviewContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREYF7F7FC,
  },
  inlinePreviewItem: {
    position: "relative",
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: COLORS.GREYF7F7FC,
    overflow: "hidden",
  },
  inlinePreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  inlineDocumentPreview: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  inlineDocumentName: {
    fontSize: 9,
    marginTop: 2,
    width: 55,
    textAlign: "center",
    color: COLORS.TEXTCOLOR,
  },
  inlineRemoveButton: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
