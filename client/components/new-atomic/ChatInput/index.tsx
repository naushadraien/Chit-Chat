import { SvgIcon } from "@/components/atomic/SvgIcon";
import { COLORS, SPACINGS } from "@/theme";
import React from "react";
import { Platform, View } from "react-native";
import { InputField } from "../Input";

interface Props {
  onPressPlus?: () => void;
  onPressSend?: () => void;
  onChangeText?: (text: string) => void;
  value?: string;
}

export function ChatInput({
  onChangeText,
  onPressPlus,
  onPressSend,
  value,
}: Props) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: COLORS.WHITE,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SPACINGS.MD,
        alignItems: "center",
        paddingHorizontal: SPACINGS.LG,
        paddingVertical: 10,
        ...Platform.select({
          ios: {
            shadowColor: COLORS.TEXTCOLOR,
            shadowOffset: {
              width: 0,
              height: -6,
            },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          },
          android: {
            elevation: 12,
            shadowColor: COLORS.TEXTCOLOR,
            shadowOffset: {
              width: 0,
              height: -6,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,
          },
        }),
      }}
    >
      <SvgIcon name="plus-icon" size={14} onPress={onPressPlus} />
      /
      <InputField
        mainContainerStyle={{
          flex: 1,
        }}
        inputViewStyle={{
          paddingVertical: 0,
        }}
        onChangeText={onChangeText}
        value={value}
      />
      <SvgIcon name="send-icon" size={18} onPress={onPressSend} />
    </View>
  );
}
