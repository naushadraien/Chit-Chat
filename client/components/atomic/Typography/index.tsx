import {
  COLORS,
  ColorsType,
  FONTFAMILIES,
  FontFamilyType,
  FONTSIZES,
  FontSizeType,
  LINEHEIGHTS,
  LineHeightType,
} from "@/theme";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  fontFamily?: FontFamilyType;
  fontSize?: FontSizeType;
  color?: ColorsType;
  textAlign?: "center" | "left" | "right" | "auto" | "justify";
  lineHeight?: LineHeightType;
}

const getTextStyles = (props: Partial<TypographyProps>): TextStyle => ({
  fontFamily: FONTFAMILIES[props.fontFamily ?? "MULISH_MEDIUM"],
  fontSize: FONTSIZES[props.fontSize ?? "LG"],
  color: COLORS[props.color ?? "TEXTCOLOR"],
  textAlign: props.textAlign,
  lineHeight: LINEHEIGHTS[props.lineHeight ?? "MD"],
});

export const Typography: React.FC<TypographyProps> = ({
  children,
  fontFamily,
  fontSize,
  color,
  textAlign,
  lineHeight,
  style,
  ...props
}) => {
  const textStyles = getTextStyles({
    fontFamily,
    fontSize,
    color,
    textAlign,
    lineHeight,
  });
  return (
    <Text {...props} style={[textStyles, style]}>
      {children}
    </Text>
  );
};
