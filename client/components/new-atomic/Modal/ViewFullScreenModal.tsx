import { WithBackBTN } from "@/Layout/Header/WithBackBTN";
import { COLORS, SPACINGS } from "@/theme";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: VoidFunction;
  showBackBtn?: boolean;
  childrenContainerStyle?: ViewStyle;
};

export function ViewFullScreenModal({
  onClose,
  visible,
  children,
  showBackBtn = true,
  childrenContainerStyle,
}: PropsWithChildren<Props>) {
  const { top } = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: SPACINGS.LG,
        ...{
          ...StyleSheet.absoluteFillObject,
          top: top,
        },
        zIndex: 100,
      }}
    >
      {showBackBtn && <WithBackBTN onBack={onClose} />}

      <View
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          },
          childrenContainerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
