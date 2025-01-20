import { Typography } from "@/components/atomic/Typography";
import { COLORS, RADII } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { CommonProPs, WithoutImageProps } from "./types";
import { Dot } from "../Dot";

const getFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase();
};

export default function AvatarWithoutImage({
  firstName,
  gradientColor = [
    COLORS.BLUED2D5F9,
    COLORS.BLUE7F86ED,
    COLORS.BLUE2C37E1,
  ] as const,
  lastName,
  enableGradient = false,
  isOnline,
  borderType = "square",
}: WithoutImageProps) {
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
            borderRadius:
              borderType === "square"
                ? RADII.RADIUS_18
                : borderType === "rounded"
                ? RADII.PILL
                : 0,
          }}
        />
      )}

      <WithoutImage
        firstName={firstName}
        lastName={lastName}
        borderType={borderType}
      />
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

function WithoutImage({
  firstName,
  lastName,
  borderType = "square",
}: {
  firstName?: string;
  lastName?: string;
  borderType?: CommonProPs["borderType"];
}) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.BLUE166FF6,
        borderRadius:
          borderType === "square"
            ? 16
            : borderType === "rounded"
            ? RADII.PILL
            : 0,
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: COLORS.WHITE,
      }}
    >
      <Typography color="WHITE" fontFamily="LATO_BOLD">
        {firstName && lastName
          ? getFirstLetter(firstName) + getFirstLetter(lastName)
          : "SA"}
      </Typography>
    </View>
  );
}
