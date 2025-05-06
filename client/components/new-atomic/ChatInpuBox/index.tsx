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

import { DocumentResult } from "@/utils/file.utils";
import { AttachmentPanel, PreviewItems } from "../chats";
import { MediaDataType } from "../chats/MediaPicker";

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
  const [selectedMedia, setSelectedMedia] = useState<
    Array<{
      id: string;
      uri: string;
      type: "image" | "document" | "video";
      name?: string;
      size?: number;
    }>
  >([]);
  const attachmentsAnimation = useRef(new Animated.Value(0)).current;

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

  // Handle file selection
  const handleFileSelected = (files: DocumentResult[]) => {
    setSelectedMedia((prev) => [
      ...prev,
      ...files.map((item) => ({
        id: item.id,
        uri: item.uri,
        type: "document" as const,
        name: item.name,
        size: item.size,
      })),
    ]);
    // Close attachment panel after selection
    if (showAttachments) toggleAttachments();
    onSendFile?.(files);
  };

  // Handle photo selection
  const handlePhotoSelected = (photos: MediaDataType) => {
    setSelectedMedia((prev) => [
      ...prev,
      ...photos.map((item) => ({
        id: item.photoId,
        uri: item.photoUrl,
        type: "image" as const,
      })),
    ]);
    // Close attachment panel after selection
    if (showAttachments) toggleAttachments();
    onSendPhoto?.(photos);
  };

  const handleCameraCapture = (photoData: MediaDataType[0]) => {
    setSelectedMedia((prev) => [
      ...prev,
      {
        id: photoData.photoId,
        uri: photoData.photoUrl,
        type: "image",
      },
    ]);

    // Close attachment panel after selection
    if (showAttachments) toggleAttachments();
    onSendPhoto?.(photoData);
  };

  // Remove a media item
  const removeMedia = (id: string) => {
    setSelectedMedia((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Attachment panel */}
      {showAttachments && (
        <>
          <AttachmentPanel
            attachmentsAnimation={attachmentsAnimation}
            onCapture={handleCameraCapture}
            onDocumentPick={handleFileSelected}
            onMediaPick={handlePhotoSelected}
            onClose={toggleAttachments}
          />
        </>
      )}
      <View style={styles.container}>
        {/* Media preview above input, but inside the same container */}
        {selectedMedia.length > 0 && (
          <PreviewItems
            selectedMedia={selectedMedia}
            onRemove={(itemId) => removeMedia(itemId)}
          />
        )}

        {/* Input row */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={toggleAttachments}
            style={styles.iconButton}
          >
            <Ionicons name="add" size={18} color={COLORS.PRIMARYBLUE} />
          </TouchableOpacity>

          <InputField
            placeholder={placeholder}
            value={message}
            onChangeText={setMessage}
            multiline
            style={styles.textInput}
            mainContainerStyle={{
              flex: 1,
            }}
          />

          {/* Audio button always visible */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic" size={18} color={COLORS.GREY500} />
          </TouchableOpacity>

          {/* Send button always visible but conditionally enabled */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={!message.trim() && selectedMedia.length === 0}
            style={[
              styles.sendButton,
              !message.trim() &&
                selectedMedia.length === 0 &&
                styles.sendButtonDisabled,
            ]}
          >
            <Ionicons
              name="send"
              size={18}
              color={
                !message.trim() && selectedMedia.length === 0
                  ? COLORS.GREY400
                  : COLORS.WHITE
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREYF7F7FC,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.TEXTCOLOR,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACINGS.XS,
    paddingVertical: 6,
    gap: 6,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.GREYF7F7FC,
    borderRadius: 20,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.GREYF7F7FC,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.GREY100,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.GREY200,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARYBLUE,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.GREY200,
    opacity: 0.8,
  },
});
