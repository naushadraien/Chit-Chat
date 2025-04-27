import { IconNameType, Icons } from "@/assets/icons";
import { COLORS, ColorsType } from "@/theme";
import React, { memo } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface IconProps extends Omit<SvgProps, "width" | "height"> {
  name: IconNameType;
  size?: number;
  onPress?: () => void;
  fill?: ColorsType;
  stroke?: ColorsType;
  containerStyle?: ViewStyle;
}

const SvgIconBase = ({
  name,
  size = 24,
  fill = "INPUTTEXTCOLOR",
  stroke,
  onPress,
  containerStyle,
  ...props
}: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon not found: ${name}`);
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[containerStyle]}
    >
      <IconComponent
        width={size}
        height={size}
        fill={fill ? COLORS[fill] : undefined}
        stroke={stroke ? COLORS[stroke] : undefined}
        {...props}
      />
    </TouchableOpacity>
  );
};

export const SvgIcon = memo(SvgIconBase);
