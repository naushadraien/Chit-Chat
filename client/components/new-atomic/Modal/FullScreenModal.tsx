import { View, Text, Modal, ViewStyle } from "react-native";
import React, { PropsWithChildren } from "react";
import { COLORS, SPACINGS } from "@/theme";
import { Typography } from "@/components/atomic/Typography";
import { useCustomSafeInsets } from "@/hooks/useCustomSafeInsets";
import { WithBackBTN } from "@/Layout/Header/WithBackBTN";

type Props = {
  visible: boolean;
  onClose: VoidFunction;
  showBackBtn?: boolean;
  childrenContainerStyle?: ViewStyle;
};

export default function FullScreenModal({
  onClose,
  visible,
  children,
  showBackBtn = true,
  childrenContainerStyle,
}: PropsWithChildren<Props>) {
  const { top } = useCustomSafeInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          paddingTop: top,
          paddingHorizontal: SPACINGS.LG,
        }}
      >
        {showBackBtn && <WithBackBTN />}

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
    </Modal>
  );
}
