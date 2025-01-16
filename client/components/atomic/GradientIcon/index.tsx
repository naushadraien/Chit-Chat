import { Dimensions, Pressable, ViewStyle } from "react-native";
import React, { FC } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SvgIcon } from "../SvgIcon";
import { Typography } from "../Typography";
import { IconNameType } from "@/assets/icons";
import { COLORS, RADII, SPACINGS } from "@/theme";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const GRADIENT_WIDTH = SCREEN_WIDTH / 5;

type GradientIconType = {
  icon: IconNameType;
  iconColorType?: "fill" | "stroke";
  title?: string;
  onPressIcon: () => void;
  gradientStyle?: ViewStyle;
  wrapperStyle?: ViewStyle;
  gradientColors?: [string, string, ...string[]];
};
export const GradientIcon: FC<GradientIconType> = ({
  icon,
  onPressIcon,
  title,
  gradientColors = ["#E5E8F2", "#B3B9D7"],
  gradientStyle,
  wrapperStyle,
  iconColorType = "fill",
}) => {
  return (
    <Pressable
      onPress={onPressIcon}
      style={[
        {
          width: GRADIENT_WIDTH,
          alignItems: "center",
          gap: SPACINGS.SM,
        },
        wrapperStyle,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        style={[
          {
            padding: SPACINGS.MD,
            borderRadius: RADII.PILL,
            borderWidth: 2,
            borderColor: COLORS.PRIMARY200,
          },
          gradientStyle,
        ]}
      >
        {iconColorType === "fill" ? (
          <SvgIcon name={icon} fill="DEEPNAVY" size={30} />
        ) : (
          <SvgIcon name={icon} stroke="DEEPNAVY" size={30} />
        )}
      </LinearGradient>

      {title && (
        <Typography
          fontFamily="MULISH_SEMIBOLD"
          textAlign="center"
          fontSize="MD"
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};
