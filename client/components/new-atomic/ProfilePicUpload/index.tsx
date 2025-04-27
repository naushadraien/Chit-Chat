import { Avatar } from "@/components/atomic/Avatar";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { ASPECT_RATIO, COLORS, RADII } from "@/theme";
import { pickImage } from "@/utils/image.utils";
import * as ImagePickerExpo from "expo-image-picker";
import * as Linking from "expo-linking";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, Platform, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
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
    if (Platform.OS === "android") {
      // Check Android version
      const androidVersion = Platform.Version;
      console.log("Android version:", androidVersion);

      // For Android 11 and below, directly launch the picker
      if (androidVersion <= 30) {
        try {
          // Directly launch the picker without permission check for Android 11 and below
          const result = await ImagePickerExpo.launchImageLibraryAsync(
            ANDROID_IMAGE_PICKER_OPTIONS
          );

          if (!result.canceled && result.assets && result.assets[0]) {
            onImagePick(result.assets[0].uri);
          }
        } catch (error: any) {
          console.log("Android direct picker error:", error);

          // If the direct approach fails due to permission issues
          if (error.message && error.message.includes("permission")) {
            // Fall back to the permission-based approach
            let { data } = await pickImage(ANDROID_IMAGE_PICKER_OPTIONS);

            if (data && data.assets && data.assets[0]) {
              onImagePick(data.assets[0].uri);
            }
          } else {
            Alert.alert(
              "Error",
              "Could not open the image picker below Android 12 device."
            );
          }
        }
      } else {
        // Android 11+ - explicitly request permission first
        try {
          // Check if we already have permissions
          let { data } = await pickImage(ANDROID_IMAGE_PICKER_OPTIONS);

          if (data && data.assets && data.assets[0]) {
            onImagePick(data.assets[0].uri);
          }
        } catch (error) {
          console.error("Android 11+ picker error:", error);
          Alert.alert(
            "Error",
            "Could not open the image picker above Android 11 device."
          );
        }
      }
    } else if (Platform.OS === "ios") {
      try {
        const result = await ImagePicker.openPicker({
          width: 1600, // Optional but kept to maintain ratio
          height: 900, // Optional but kept to maintain ratio
          cropping: true,
          cropperAspectRatio: ANDROID_IMAGE_PICKER_OPTIONS.aspect, // 16/9
        });

        if (result.path) {
          onImagePick(result.path);
        }
      } catch (error: any) {
        console.log("iOS picker error:", error);
        if (error.code === "E_PERMISSION_MISSING") {
          Alert.alert(
            "Permission Required",
            "Please allow access to your photo library in Settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
          );
        }
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
