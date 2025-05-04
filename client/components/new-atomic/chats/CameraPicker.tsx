import { COLORS } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraViewModal } from "./CameraViewModal";

interface CameraPickerProps {
  onCapture: (photo: string) => void;
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
      onCapture(photoUri);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleCameraPress}>
        <View style={[styles.iconBackground, { backgroundColor: "#00BCD4" }]}>
          <MaterialIcons name="camera-alt" size={22} color={COLORS.WHITE} />
        </View>
        <Text style={styles.label}>Camera</Text>
      </TouchableOpacity>

      <CameraViewModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </>
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
});
