import { IconNameType, Icons } from "@/assets/icons";
import { COLORS, ColorsType } from "@/theme";
import React, { memo } from "react";
import { Pressable } from "react-native";
import { SvgProps } from "react-native-svg";

interface IconProps extends Omit<SvgProps, "width" | "height"> {
  name: IconNameType;
  size?: number;
  onPress?: () => void;
  fill?: ColorsType;
  stroke?: ColorsType;
}

const SvgIconBase = ({
  name,
  size = 24,
  fill = "PRIMARY",
  stroke,
  onPress,
  ...props
}: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon not found: ${name}`);
    return null;
  }

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <IconComponent
        width={size}
        height={size}
        fill={fill ? COLORS[fill] : undefined}
        stroke={stroke ? COLORS[stroke] : undefined}
        {...props}
      />
    </Pressable>
  );
};

export const SvgIcon = memo(SvgIconBase);
