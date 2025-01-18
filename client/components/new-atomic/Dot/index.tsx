import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { COLORS, ColorsType, RADII } from "@/theme";

type Props = {
  dotColor?: ColorsType;
  enableBorderColor?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function Dot({
  dotColor = "GREENSUCCESS",
  enableBorderColor = false,
  size = 14,
  style,
}: Props) {
  return (
    <View
      style={[
        {
          borderColor: enableBorderColor ? COLORS.WHITE : COLORS.TRANSPARENT,
          borderWidth: enableBorderColor ? 2 : 0,
          width: size,
          height: size,
          borderRadius: RADII.PILL,
          backgroundColor: COLORS[dotColor],
        },
        style,
      ]}
    />
  );
}
