import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { SPACINGS } from "@/theme";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { HeaderWithSearchProps } from "./types";

export function WithSearch({
  title,
  onBack,
  onPressMenu,
  onSearch,
}: HeaderWithSearchProps) {
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
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: SPACINGS.BASE,
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: SPACINGS.BASE,
        }}
      >
        <SvgIcon name="search-icon" size={17} onPress={onSearch} />
        <SvgIcon name="menu-icon" size={15} onPress={onPressMenu} />
      </View>
    </View>
  );
}
