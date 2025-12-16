import * as ImagePickerExpo from "expo-image-picker";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

// ============== Types ==============
type Props = {
  isUploading?: boolean;
  imgUri?: string;
  onUploadComplete?: () => void;
  circleStrokeWidth?: number;
  startPosition: "top" | "bottom" | "left" | "right";
  progress?: number;
  onImagePick: (imgUri: string) => void;
  size?: number;
};

// ============== Constants ==============
const COLORS = {
  BACKGROUND: "#F7F7FC",
  GREY: "#ADB5BD",
  PINK: "#FF6B9D",
  WHITE: "#FFFFFF",
  ICON_COLOR: "#6B7280",
  PROGRESS_BG: "rgba(0,0,0,0.5)",
  PROGRESS_TEXT: "#FFFFFF",
};

const ANDROID_IMAGE_PICKER_OPTIONS: ImagePickerExpo.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

// ============== Helper Functions ==============
const getRotation = (startPosition: "top" | "bottom" | "left" | "right") => {
  switch (startPosition) {
    case "top":
      return "-90deg";
    case "bottom":
      return "90deg";
    case "left":
      return "180deg";
    case "right":
      return "0deg";
    default:
      return "-90deg";
  }
};

// ============== Animated Circle ==============
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ============== Inline Icons ==============
const UserIcon = ({ size = 44, color = COLORS.ICON_COLOR }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UploadPlusIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={11} fill={COLORS.PINK} />
    <Path
      d="M12 8V16M8 12H16"
      stroke={COLORS.WHITE}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============== Main Component ==============
export function NewProfilePicUpload({
  imgUri,
  isUploading = false,
  onUploadComplete,
  circleStrokeWidth = 3,
  startPosition = "top",
  progress,
  onImagePick,
  size = 100,
}: Props) {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const strokeWidth = circleStrokeWidth;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate display progress
  const displayProgress = progress !== undefined ? Math.round(progress) : 0;
  const showProgress =
    isUploading || (progress !== undefined && progress > 0 && progress < 100);

  // Animate progress
  useEffect(() => {
    if (progress !== undefined) {
      // Animate to the progress value
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Check if upload is complete
        if (progress >= 100) {
          onUploadComplete?.();
        }
      });
    } else if (isUploading) {
      // Auto-animate if only isUploading is true (no specific progress provided)
      progressAnimation.setValue(0);
      Animated.timing(progressAnimation, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onUploadComplete?.();
        }
      });
    }
  }, [isUploading, progress, progressAnimation, onUploadComplete]);

  // Reset when not uploading
  useEffect(() => {
    if (!isUploading && progress === undefined) {
      progressAnimation.setValue(0);
    }
  }, [isUploading, progress, progressAnimation]);

  const handleImagePicker = async () => {
    if (isUploading) return; // Prevent picking while uploading

    try {
      const result = await ImagePickerExpo.launchImageLibraryAsync(
        ANDROID_IMAGE_PICKER_OPTIONS
      );

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        onImagePick(selectedImage.uri);
      }
    } catch (error) {
      console.log("Error while picking image for profile", error);
      Alert.alert("Error", "Could not pick profile image. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Avatar or Placeholder */}
      {imgUri ? (
        <Image
          source={{ uri: imgUri }}
          style={[
            styles.avatar,
            {
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
              borderRadius: (size - strokeWidth * 2) / 2,
            },
          ]}
        />
      ) : (
        <UserIcon size={size * 0.44} color={COLORS.ICON_COLOR} />
      )}

      {/* Progress Overlay with Percentage */}
      {showProgress && (
        <View
          style={[
            styles.progressOverlay,
            {
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
              borderRadius: (size - strokeWidth * 2) / 2,
            },
          ]}
        >
          <Text style={styles.progressText}>{displayProgress}%</Text>
        </View>
      )}

      {/* Circular Progress Indicator */}
      {showProgress && (
        <Svg
          width={size}
          height={size}
          style={[
            styles.progressSvg,
            { transform: [{ rotateZ: getRotation(startPosition) }] },
          ]}
        >
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.GREY}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.PINK}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={progressAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: [circumference, 0],
            })}
          />
        </Svg>
      )}

      {/* Upload Button */}
      <Pressable
        style={[styles.uploadButton, { opacity: isUploading ? 0.5 : 1 }]}
        onPress={handleImagePicker}
        disabled={isUploading}
      >
        <UploadPlusIcon size={size * 0.24} />
      </Pressable>
    </View>
  );
}

// ============== Styles ==============
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    resizeMode: "cover",
  },
  progressOverlay: {
    position: "absolute",
    backgroundColor: COLORS.PROGRESS_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: COLORS.PROGRESS_TEXT,
    fontSize: 16,
    fontWeight: "bold",
  },
  progressSvg: {
    position: "absolute",
  },
  uploadButton: {
    position: "absolute",
    bottom: 4,
    right: 0,
  },
});
