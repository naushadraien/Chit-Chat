import { selectMultipleImages } from "@/utils/image.utils";
import React from "react";
import { Alert } from "react-native";
import { AttachmentOption } from "./AttachmentOption";

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
      const newImages = await selectMultipleImages({
        allowsEditing: false,
      });
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
    <AttachmentOption
      icon="image"
      label="Gallery"
      color="#4CAF50"
      onPress={handlePickMedia}
      accessibilityLabel="Select photos from gallery"
    />
  );
};
