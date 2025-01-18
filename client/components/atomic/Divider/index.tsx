import { View, Text, DimensionValue } from "react-native";
import React, { FC } from "react";
import { COLORS, ColorsType } from "@/theme";

type DividerType = {
  width?: DimensionValue;
  height?: DimensionValue;
  color?: ColorsType;
};

export const Divider: FC<DividerType> = ({
  color,
  height = 1,
  width = "100%",
}) => {
  return (
    <View
      style={{
        height,
        width,
        backgroundColor: COLORS[color ?? "GREY100"],
      }}
    />
  );
};
