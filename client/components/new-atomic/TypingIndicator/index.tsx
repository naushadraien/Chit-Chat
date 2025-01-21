import React from "react";
import { View, Platform } from "react-native";
import { COLORS, RADII, SPACINGS } from "@/theme";
import { Avatar } from "../Avatar";
import { Typography } from "@/components/atomic/Typography";
import { AnimatedDots } from "./AnimatedDots";

interface TypingIndicatorProps {
  isMe?: boolean;
  avatarUrl?: string;
  userName?: string;
}

export function TypingIndicator({
  isMe,
  avatarUrl,
  userName,
}: TypingIndicatorProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: isMe ? "flex-end" : "flex-start",
        paddingHorizontal: SPACINGS.LG,
        marginVertical: SPACINGS.XS,
        gap: SPACINGS.SM,
      }}
    >
      {!isMe && <Avatar imgUri={avatarUrl} variant="Image" />}
      <View
        style={{
          backgroundColor: isMe ? COLORS.BRANDCOLOR : COLORS.WHITE,
          padding: SPACINGS.MD,
          borderRadius: RADII.MD,
          flexDirection: "row",
          alignItems: "center",
          gap: SPACINGS.XS,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
            },
            android: {
              elevation: 4,
            },
          }),
        }}
      >
        <Typography fontSize="XS" color={isMe ? "WHITE" : "TEXTCOLOR"}>
          {userName || "Someone"} is typing
        </Typography>
        <AnimatedDots color={isMe ? "WHITE" : "GREYADB5BD"} />
      </View>
      {isMe && <Avatar imgUri={avatarUrl} variant="Image" />}
    </View>
  );
}
