import { COLORS, SPACINGS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { InputField } from "../Input";

import { useCustomSafeInsets } from "@/hooks/useCustomSafeInsets";
import {
  AudioRecorder,
  CameraPicker,
  DocumentPicker,
  MediaPicker,
} from "../chats";

interface Props {
  onSendMessage?: (text: string) => void;
  onSendAudio?: (audioFile: any) => void;
  onSendPhoto?: (imageFile: any) => void;
  onSendFile?: (file: any) => void;
  placeholder?: string;
}

export function ChatInputBox({
  onSendMessage,
  onSendAudio,
  onSendPhoto,
  onSendFile,
  placeholder = "Message",
}: Props) {
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const attachmentsAnimation = useRef(new Animated.Value(0)).current;
  const insets = useCustomSafeInsets();

  // Toggle attachment options
  const toggleAttachments = () => {
    const toValue = showAttachments ? 0 : 1;
    setShowAttachments(!showAttachments);

    Animated.spring(attachmentsAnimation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Handle sending a message
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage("");
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        {showAttachments && (
          <Animated.View
            style={[
              styles.attachmentPanel,
              {
                transform: [
                  {
                    translateY: attachmentsAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
                opacity: attachmentsAnimation,
              },
            ]}
          >
            <DocumentPicker onSelect={(file) => onSendFile?.(file)} />
            <MediaPicker onSelect={(photo) => onSendPhoto?.(photo)} />
            <CameraPicker onCapture={(photo) => onSendPhoto?.(photo)} />
          </Animated.View>
        )}
        <TouchableOpacity
          onPress={toggleAttachments}
          style={styles.attachButton}
        >
          <Ionicons name="add" size={18} color={COLORS.PRIMARYBLUE} />
        </TouchableOpacity>

        <InputField
          placeholder={placeholder}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        {message.trim() ? (
          <TouchableOpacity onPress={handleSend}>
            <View style={styles.sendButton}>
              <Ionicons name="send" size={18} color={COLORS.WHITE} />
            </View>
          </TouchableOpacity>
        ) : (
          <AudioRecorder />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACINGS.MD,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.TEXTCOLOR,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  attachButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARYBLUE,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentPanel: {
    flexDirection: "row",
    zIndex: 1000,
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACINGS.LG,
    paddingHorizontal: SPACINGS.MD,
    justifyContent: "space-around",
    position: "absolute",
    bottom: "140%",
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.GREY400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
