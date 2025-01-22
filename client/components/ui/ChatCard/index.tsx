import { View, Text } from "react-native";
import React from "react";
import { Avatar } from "@/components/new-atomic/Avatar";
import { Typography } from "@/components/atomic/Typography";
import { COLORS, RADII, SPACINGS } from "@/theme";

type Props = {
  isOnline?: boolean;
  name: string;
  content?: string;
  date?: string;
  messageUnreadCount?: number;
  imgUri?: string;
};

export default function ChatCard({
  name,
  content,
  date,
  isOnline,
  messageUnreadCount,
  imgUri,
}: Props) {
  const splittedName = name.split("");
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SPACINGS.MD,
      }}
    >
      {imgUri ? (
        <Avatar variant="Image" imgUri={imgUri} isOnline={isOnline} />
      ) : (
        <Avatar
          variant="WithoutImage"
          isOnline={isOnline}
          firstName={splittedName[0]}
          lastName={splittedName[1]}
        />
      )}
      <View
        style={{
          flex: 1,
        }}
      >
        <Typography
          numberOfLines={1}
          fontFamily="MULISH_SEMIBOLD"
          fontSize="MD"
        >
          {name}
        </Typography>
        <Typography
          numberOfLines={1}
          fontFamily="MULISH_REGULAR"
          fontSize="SM"
          lineHeight="SM"
          color="GREYADB5BD"
        >
          {content}
        </Typography>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1 / 4,
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        {date && (
          <Typography
            numberOfLines={1}
            color="GREY6D6D6D"
            fontSize="XS"
            fontFamily="MULISH_REGULAR"
            lineHeight="XS"
          >
            {date}
          </Typography>
        )}
        {messageUnreadCount && (
          <Typography
            numberOfLines={1}
            fontFamily="MULISH_SEMIBOLD"
            fontSize="XS"
            lineHeight="XS"
            color="BRANDCOLOR"
            style={{
              borderRadius: RADII.PILL,
              backgroundColor: COLORS.BLUED2D5F9,
              paddingHorizontal: SPACINGS.BASE,
              paddingVertical: SPACINGS.XS,
            }}
          >
            {messageUnreadCount}
          </Typography>
        )}
      </View>
    </View>
  );
}
