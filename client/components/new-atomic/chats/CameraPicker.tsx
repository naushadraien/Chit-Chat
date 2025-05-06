import React, { useState } from "react";
import { CameraViewModal } from "./CameraViewModal";
import { MediaDataType } from "./MediaPicker";
import { AttachmentOption } from "./AttachmentOption";

interface CameraPickerProps {
  onCapture: (photoData: MediaDataType[0]) => void;
}

export const CameraPicker = ({ onCapture }: CameraPickerProps) => {
  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  const handleCameraPress = () => {
    setCameraModalVisible(true);
  };

  const handlePhotoTaken = (photoUri: string) => {
    console.log("🚀 ~ handlePhotoTaken ~ photoUri:", photoUri);
    setCameraModalVisible(false);
    if (onCapture) {
      const randomString = Math.random().toString(36).substring(2, 8);
      onCapture({
        photoId: `camera_${Date.now()}_${randomString}`,
        photoUrl: photoUri,
      });
    }
  };

  return (
    <>
      <AttachmentOption
        icon="camera"
        label="Camera"
        color="#00BCD4"
        onPress={handleCameraPress}
        accessibilityLabel="Take a photo with camera"
      />

      <CameraViewModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </>
  );
};
