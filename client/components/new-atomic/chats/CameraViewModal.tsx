import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Typography } from "@/components/atomic/Typography";
import { COLORS } from "@/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: VoidFunction;
  onPhotoTaken: (photoUri: string) => void;
  showGrid?: boolean;
};

export function CameraViewModal({
  visible,
  onClose,
  onPhotoTaken,
  showGrid,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const takePhoto = async () => {
    if (!cameraRef.current || isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
        exif: true,
      });
      setCapturedPhoto(photo?.uri || "");

      // Animate preview in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.log("Failed to take photo:", error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const retakePhoto = () => {
    // Animate preview out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCapturedPhoto(null);
    });
  };

  const sendPhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  const toggleCamera = () => {
    setFrontCamera((prev) => !prev);
  };

  const toggleFlash = () => {
    setFlashEnabled((prev) => !prev);
  };

  const renderPreview = () => {
    if (!capturedPhoto) return null;

    return (
      <Animated.View
        style={[
          styles.previewContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={[styles.previewButton, styles.retakeButton]}
            onPress={retakePhoto}
          >
            <Ionicons name="refresh" size={24} color={COLORS.WHITE} />
            <Typography color="WHITE" style={styles.buttonText}>
              Retake
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewButton, styles.sendButton]}
            onPress={sendPhoto}
          >
            <Ionicons name="send" size={24} color={COLORS.WHITE} />
            <Typography color="WHITE" style={styles.buttonText}>
              Send
            </Typography>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderCamera = () => {
    if (!permission) {
      return (
        <View style={styles.centeredContainer}>
          <Typography>Checking camera permissions...</Typography>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.centeredContainer}>
          <Typography fontSize={"LG"} color={"PRIMARY"}>
            Camera Permission Required
          </Typography>
          <Typography
            fontSize={"MD"}
            color={"GREY200"}
            style={{ textAlign: "center", marginVertical: 20 }}
          >
            We need camera access to take photos. Please grant permission to
            continue.
          </Typography>
          <FilledButton title="Grant Permission" onPress={requestPermission} />
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={frontCamera ? "front" : "back"}
          enableTorch={flashEnabled}
        >
          {/* Camera UI overlay */}
          <View style={[styles.overlay, { paddingTop: insets.top }]}>
            {/* Top controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.topRightControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleFlash}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={flashEnabled ? "flash" : "flash-off"}
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleCamera}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="camera-reverse-outline"
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Grid lines for composition */}
            {showGrid && (
              <View style={styles.gridLines}>
                <View style={styles.gridLineHorizontal} />
                <View style={styles.gridLineHorizontal} />
                <View style={styles.gridLineVertical} />
                <View style={styles.gridLineVertical} />
              </View>
            )}

            {/* Bottom controls */}
            <View
              style={[
                styles.bottomControls,
                { paddingBottom: insets.bottom + 20 },
              ]}
            >
              <View style={styles.captureArea}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePhoto}
                  disabled={isTakingPhoto}
                  activeOpacity={0.8}
                >
                  {isTakingPhoto ? (
                    <ActivityIndicator color="white" size="large" />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Preview mode */}
          {renderPreview()}
        </CameraView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => {
        if (capturedPhoto) {
          retakePhoto();
        } else {
          onClose();
        }
      }}
    >
      <View style={styles.modalContainer}>{renderCamera()}</View>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  centeredContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    zIndex: 10,
  },
  topRightControls: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 100,
  },
  gridLineHorizontal: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  gridLineVertical: {
    position: "absolute",
    height: "100%",
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
  },
  captureArea: {
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "white",
  },
  previewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 20,
  },
  previewImage: {
    flex: 1,
    resizeMode: "contain",
  },
  previewActions: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  previewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: COLORS.WHITE,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARYBLUE,
  },
  buttonText: {
    fontWeight: "600",
  },
});
