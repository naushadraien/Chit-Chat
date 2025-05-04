import { COLORS } from "@/theme";
import { selectMultipleImages } from "@/utils/image.utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type MediaDataType = Array<{
  photoId: string;
  photoUrl: string;
}>;

interface MediaPickerProps {
  onSelect: (media: MediaDataType) => void;
}

export const MediaPicker = ({ onSelect }: MediaPickerProps) => {
  const handlePickMedia = async () => {
    try {
      const newImages = await selectMultipleImages();
      console.log("🚀 ~ handlePickMedia ~ newImages:", newImages);

      if (newImages && newImages.length > 0) {
        onSelect(newImages);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Could not select images. Please try again.");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePickMedia}>
      <View style={[styles.iconBackground, { backgroundColor: "#673AB7" }]}>
        <MaterialIcons name="photo-library" size={22} color={COLORS.WHITE} />
      </View>
      <Text style={styles.label}>Gallery</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.GREY600,
    marginTop: 4,
  },
  expandedContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.GREY900,
  },
  imageItem: {
    margin: 1,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  browseButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  browseText: {
    color: COLORS.PRIMARYBLUE,
    fontWeight: "600",
  },
});
