import { Typography } from "@/components/atomic/Typography";
import { COLORS, RADII, SPACINGS } from "@/theme";
import React from "react";
import { Platform, View } from "react-native";
import { ChatContentProps } from "./types";
import { renderContent } from "./utils";

export function ChatContent({ isMe, message }: ChatContentProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isMe ? "flex-end" : "flex-start",
        paddingHorizontal: 16,
        marginVertical: 4,
      }}
    >
      <View
        style={{
          maxWidth: message.type === "text" ? 210 : "auto",
          backgroundColor: isMe ? COLORS.BRANDCOLOR : COLORS.WHITE,
          padding: SPACINGS.MD,
          borderRadius: RADII.MD,
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
        {renderContent(message, isMe)}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: SPACINGS.XS,
          }}
        >
          <Typography
            color={isMe ? "WHITE" : "GREYADB5BD"}
            fontFamily="MULISH_REGULAR"
            fontSize="XS"
          >
            {message.time}
          </Typography>
        </View>
      </View>
    </View>
  );
}
