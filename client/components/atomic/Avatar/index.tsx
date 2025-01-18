import { DUMMY_PROFILE_IMAGE } from "@/assets/images";
import { COLORS, ColorsType } from "@/theme";
import React, { memo } from "react";
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from "react-native";

type AvatarSize = 20 | 24 | 30 | 34 | 40 | 45 | 50 | 60 | 70 | 80 | 90 | 100;

interface AvatarProps {
  size?: AvatarSize;
  imageUri?: string;
  enableBorder?: boolean;
  borderColor?: ColorsType;
}

const getContainerStyle = (
  size: AvatarSize,
  enableBorder: boolean,
  borderColor: ColorsType
): ViewStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  borderWidth: enableBorder ? 1 : 0,
  borderColor: enableBorder ? COLORS[borderColor] : "transparent",
});

const getImageStyle = (size: AvatarSize): ImageStyle => ({
  width: "100%",
  height: "100%",
  borderRadius: size / 2,
});

const AvatarBase: React.FC<AvatarProps> = ({
  size = 100,
  imageUri,
  enableBorder = false,
  borderColor = "PURPLE900",
}) => (
  <View
    style={[
      styles.container,
      getContainerStyle(size, enableBorder, borderColor),
    ]}
  >
    <Image
      source={imageUri ? { uri: imageUri } : DUMMY_PROFILE_IMAGE}
      style={[styles.image, getImageStyle(size)]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "cover",
  },
});

export const Avatar = memo(AvatarBase);
