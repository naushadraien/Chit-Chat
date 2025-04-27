import { Avatar } from "@/components/atomic/Avatar";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { ASPECT_RATIO, COLORS, RADII } from "@/theme";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Platform, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import * as ImagePickerExpo from "expo-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import { pickImage } from "@/utils/image.utils";

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
    if (Platform.OS === "android") {
      let { data } = await pickImage(ANDROID_IMAGE_PICKER_OPTIONS);

      if (data && data.assets && data.assets[0]) {
        onImagePick(data.assets[0].uri);
      }
    } else if (Platform.OS === "ios") {
      const result = await ImagePicker.openPicker({
        width: 1600, // Optional but kept to maintain ratio
        height: 900, // Optional but kept to maintain ratio
        cropping: true,
        cropperAspectRatio: ASPECT_RATIO.landscape.x / ASPECT_RATIO.landscape.y, // 16/9
      });

      if (result.path) {
        onImagePick(result.path);
      }
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
        <Image
          source={{
            uri: imgUri,
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <SvgIcon name="user-icon" size={44} fill="INPUTTEXTCOLOR" />
      )}
      {/* <Avatar size={100} /> */}
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
