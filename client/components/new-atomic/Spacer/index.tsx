import React from "react";
import { View, ViewStyle } from "react-native";

export type SpacerProps = {
  size?: number;
  direction?: "vertical" | "horizontal";
  style?: ViewStyle;
  flex?: boolean;
};

export default function Spacer({
  size = 8,
  direction = "vertical",
  style,
  flex = false,
}: SpacerProps) {
  const spacerStyle: ViewStyle = {
    ...(direction === "vertical" ? { height: size } : { width: size }),
    ...(flex ? { flex: 1 } : {}),
    ...style,
  };

  return <View style={spacerStyle} />;
}
