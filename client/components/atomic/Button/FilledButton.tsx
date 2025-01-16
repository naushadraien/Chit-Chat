import { COLORS, ColorsType, RADII, SPACINGS } from "@/theme";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Typography } from "../Typography";

interface FilledButtonProps {
  title: string;
  bgColor?: ColorsType;
  textColor?: ColorsType;
  border?: "rounded" | "square";
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function FilledButton({
  bgColor = "BRANDCOLOR",
  border = "rounded",
  textColor = "WHITE",
  onPress,
  style,
  title,
  disabled,
}: FilledButtonProps) {
  return (
    <Pressable
      style={[
        {
          borderRadius: border === "rounded" ? RADII.PILL : RADII.MD,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS[bgColor],
          paddingVertical: SPACINGS.MD,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Typography
        color={textColor}
        fontFamily="MULISH_SEMIBOLD"
        fontSize="LG"
        lineHeight="LG"
      >
        {title}
      </Typography>
    </Pressable>
  );
}
