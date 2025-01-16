import React from "react";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { SvgIcon } from "../SvgIcon";
import { COLORS } from "@/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const BottomModal = ({ children, onClose, visible }: Props) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      style={{ height: "100%" }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: COLORS.MODAL_BG,
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: "100%",
                padding: 40,
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Pressable
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
                onPress={onClose}
              >
                <SvgIcon name="close-btn" size={15} fill="TEXTCOLOR" />
              </Pressable>

              <View>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
