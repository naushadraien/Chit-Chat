import { useCustomSafeInsets } from "@/hooks/useCustomSafeInsets";
import { COLORS, ColorsType } from "@/theme";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

export type SafeAreaWrapperProps = {
  topInset?: number;
  backgroundColor?: ColorsType;
  bottomInset?: number;
  children: ReactNode;
  style?: ViewStyle;
  statusBarStyle?: StatusBarStyle;
  statusBarColor?: ColorsType;
};

export const SafeAreaWrapper = ({
  children,
  style,
  topInset,
  bottomInset,
  backgroundColor = "WHITE",
  statusBarStyle = "dark",
  statusBarColor,
  ...props
}: SafeAreaWrapperProps) => {
  const { bottom, top } = useCustomSafeInsets();
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: topInset ?? top,
          paddingBottom: bottomInset ?? bottom,
          backgroundColor: COLORS[backgroundColor],
        },
        style,
      ]}
      {...props}
    >
      <StatusBar
        style={statusBarStyle}
        backgroundColor={statusBarColor ? COLORS[statusBarColor] : undefined}
      />
      {children}
    </View>
  );
};
