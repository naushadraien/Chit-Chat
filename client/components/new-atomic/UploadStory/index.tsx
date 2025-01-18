import { View, Text, Pressable } from "react-native";
import React from "react";
import { COLORS } from "@/theme";
import { SvgIcon } from "@/components/atomic/SvgIcon";

export function UploadStory() {
  return (
    <Pressable
      style={{
        width: 56,
        height: 56,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: COLORS.GREYADB5BD,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.GREYF7F7FC,
          borderRadius: 16,
        }}
      >
        <SvgIcon name="plus-icon" size={14} />
      </View>
    </Pressable>
  );
}
