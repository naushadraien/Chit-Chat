import { Typography } from "@/components/atomic/Typography";
import { COLORS } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { WithoutImageProps } from "./types";
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
}: WithoutImageProps) {
  return (
    <View
      style={{
        width: 56,
        height: 56,
        position: "relative",
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
            padding: 2,
            borderRadius: 18,
          }}
        />
      )}
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          overflow: "hidden",
          borderRadius: 18,
          margin: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WithoutImage firstName={firstName} lastName={lastName} />
      </View>
      {isOnline && (
        <Dot
          style={{
            position: "absolute",
            right: 0,
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
}: {
  firstName?: string;
  lastName?: string;
}) {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.BLUE166FF6,
        borderRadius: 16,
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
