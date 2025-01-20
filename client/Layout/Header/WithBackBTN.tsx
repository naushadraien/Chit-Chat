import { SvgIcon } from "@/components/atomic/SvgIcon";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { CommonProps } from "./types";

export function WithBackBTN({ onBack }: CommonProps) {
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
        justifyContent: "center",
        paddingVertical: 6,
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
    </View>
  );
}
