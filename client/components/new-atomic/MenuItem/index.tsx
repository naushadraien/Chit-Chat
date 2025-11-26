import { IconNameType } from "@/assets/icons";
import { Loader } from "@/components/atomic/Loader";
import { LoadingSpinner } from "@/components/atomic/Loader/LoadingSpinner";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  iconName?: IconNameType;
  title: string;
  onPress?: VoidFunction;
  ionIcon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  isLoading?: boolean;
  loadingText?: string;
};

export function MenuItem({
  title,
  onPress,
  ionIcon,
  iconName,
  size = 19,
  isLoading,
  loadingText,
}: Props) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress}
      disabled={isLoading}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <LoadingSpinner size={"small"} />
        ) : ionIcon ? (
          <Ionicons name={ionIcon} size={size} />
        ) : iconName ? (
          <SvgIcon name={iconName} size={size} />
        ) : null}
        <Typography
          fontFamily="MULISH_SEMIBOLD"
          fontSize="MD"
          lineHeight="MD"
          color="INPUTTEXTCOLOR"
        >
          {isLoading && loadingText ? loadingText : title}
        </Typography>
      </View>
      <SvgIcon name="chevron-right-icon" size={12} />
    </Pressable>
  );
}
