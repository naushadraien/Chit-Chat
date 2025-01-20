import { View, Text, Pressable } from "react-native";
import React from "react";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { IconNameType } from "@/assets/icons";

type Props = {
  iconName: IconNameType;
  title: string;
  onPress?: () => {};
};

export function MenuItem({ iconName, title, onPress }: Props) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 6,
          alignItems: "center",
        }}
      >
        <SvgIcon name={iconName} size={18} />
        <Typography
          fontFamily="MULISH_SEMIBOLD"
          fontSize="MD"
          lineHeight="MD"
          color="INPUTTEXTCOLOR"
        >
          {title}
        </Typography>
      </View>
      <SvgIcon name="chevron-right-icon" size={12} />
    </Pressable>
  );
}
