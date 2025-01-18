import { DUMMY_PROFILE_IMAGE } from "@/assets/images";
import { COLORS, RADII } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, View } from "react-native";
import { AvatarWithImageProps } from "./types";
import { Dot } from "../Dot";

export default function AvatarWithImage({
  gradientColor = [
    COLORS.BLUED2D5F9,
    COLORS.BLUE7F86ED,
    COLORS.BLUE2C37E1,
  ] as const,
  imgUri,
  enableGradient = false,
  isOnline,
  borderType = "square",
}: AvatarWithImageProps) {
  return (
    <View
      style={{
        width: 56,
        height: 56,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {enableGradient && (
        <LinearGradient
          colors={gradientColor}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: RADII.RADIUS_18,
          }}
        />
      )}

      <ImageWrapper imgUri={imgUri} />
      {isOnline && (
        <Dot
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 1,
          }}
          enableBorderColor
        />
      )}
    </View>
  );
}

function ImageWrapper({ imgUri }: { imgUri?: string }) {
  return (
    <Image
      source={
        imgUri
          ? {
              uri: imgUri,
            }
          : DUMMY_PROFILE_IMAGE
      }
      style={{
        width: 50,
        height: 50,
        resizeMode: "cover",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.WHITE,
      }}
    />
  );
}
