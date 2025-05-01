import { Typography } from "@/components/atomic/Typography";
import React, { PropsWithChildren } from "react";
import { View } from "react-native";

const MAX_TITLE_LENGTH = 10;

export default function StoryWrapper({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>{children}</View>
      <Typography fontFamily="MULISH_REGULAR" fontSize="XS">
        {title.length > MAX_TITLE_LENGTH
          ? `${title.substring(0, MAX_TITLE_LENGTH - 3)}...`
          : title}
      </Typography>
    </View>
  );
}
