import { Avatar } from "@/components/atomic/Avatar";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { ASPECT_RATIO, COLORS, RADII } from "@/theme";
import { pickImage, selectSingleImage } from "@/utils/image.utils";
import * as ImagePickerExpo from "expo-image-picker";
import * as Linking from "expo-linking";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, Platform, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  isUploading?: boolean;
  imgUri?: string;
  onUploadComplete?: () => void;
  circleStrokeWidth?: number;
  startPosition?: "top" | "bottom";
  progress?: number;
  onImagePick: (imgUri: string) => void;
};

const ANDROID_IMAGE_PICKER_OPTIONS: ImagePickerExpo.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [ASPECT_RATIO.landscape.x, ASPECT_RATIO.landscape.y],
  quality: 1,
};

const getRotation = (startPosition: "top" | "bottom") => {
  switch (startPosition) {
    case "top":
      return "270deg";
    case "bottom":
      return "90deg";
    default:
      return "270deg";
  }
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProfilePicUpload({
  imgUri,
  isUploading,
  onUploadComplete,
  circleStrokeWidth = 3,
  startPosition = "top",
  progress,
  onImagePick,
}: Props) {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const size = 100;
  const strokeWidth = circleStrokeWidth;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Use progress prop if available, otherwise animate
  useEffect(() => {
    if (progress !== undefined) {
      // Directly set progress value if provided
      progressAnimation.setValue(progress);
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

  const handleImagePicker = async () => {
    try {
      const result = await selectSingleImage();
      if (result) {
        onImagePick(result.uri);
      }
    } catch (error) {
      console.log("Error while picking image for profile", error);
      Alert.alert("Error", "Could pick profile image. Please try again.");
    }
  };

  // if (isUploading) {
  //   progressAnimation.setValue(0);
  //   Animated.timing(progressAnimation, {
  //     toValue: 100,
  //     duration: 2000,
  //     useNativeDriver: true,
  //   }).start(({ finished }) => {
  //     if (finished) {
  //       onUploadComplete?.();
  //     }
  //   });
  // }

  return (
    <View
      style={{
        backgroundColor: COLORS.GREYF7F7FC,
        borderRadius: RADII.PILL,
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {imgUri ? (
        <Avatar imageUri={imgUri} />
      ) : (
        <SvgIcon name="user-icon" size={44} fill="INPUTTEXTCOLOR" />
      )}
      {(isUploading || progress !== undefined) && (
        <Svg
          width={size}
          height={size}
          style={{
            position: "absolute",
            transform: [{ rotateZ: getRotation(startPosition) }],
          }}
        >
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.GREYADB5BD}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.PINK}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={progressAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: [circumference, 0],
            })}
          />
        </Svg>
      )}
      <SvgIcon
        name="upload-plus-icon"
        size={20}
        containerStyle={{
          position: "absolute",
          bottom: 4,
          right: 0,
        }}
        onPress={handleImagePicker}
      />
    </View>
  );
}
