import { SvgIcon } from "@/components/atomic/SvgIcon";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { CommonProps, HeaderWithTitleProps } from "./types";
import { SPACINGS } from "@/theme";
import { Typography } from "@/components/atomic/Typography";

export function WithTitle({ title, onBack }: HeaderWithTitleProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        gap: SPACINGS.BASE,
        alignItems: "center",
      }}
    >
      <SvgIcon
        name="chevron-right-icon"
        style={{
          transform: [{ rotate: "180deg" }],
        }}
        size={12}
        onPress={handleBack}
      />
      <Typography
        fontFamily="MULISH_SEMIBOLD"
        fontSize="XL"
        lineHeight="CUSTOM_30"
        color="INPUTTEXTCOLOR"
      >
        {title}
      </Typography>
    </View>
  );
}
