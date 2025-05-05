// AttachmentPanel.tsx
import { COLORS } from "@/theme";
import { DocumentResult } from "@/utils/file.utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraPicker } from "./CameraPicker";
import { DocumentPicker } from "./DocumentPicker";
import { MediaDataType, MediaPicker } from "./MediaPicker";

interface AttachmentPanelProps {
  attachmentsAnimation: Animated.Value;
  onClose: () => void;
  onCapture: (photoData: MediaDataType[0]) => void;
  onDocumentPick: (files: DocumentResult[]) => void;
  onMediaPick: (media: MediaDataType) => void;
}

export const AttachmentPanel = ({
  attachmentsAnimation,
  onClose,
  onCapture,
  onDocumentPick,
  onMediaPick,
}: AttachmentPanelProps) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward gestures
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        // Follow finger with animation, but only downward
        if (gestureState.dy > 0) {
          const newValue = 1 - Math.min(1, gestureState.dy / 300);
          attachmentsAnimation.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down far enough, dismiss
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          // Otherwise spring back
          Animated.spring(attachmentsAnimation, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.backdrop,
          {
            opacity: attachmentsAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        ]}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: attachmentsAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.header}>
          <View style={styles.handle} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.GREY500} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.optionsGrid}>
            <CameraPicker onCapture={onCapture} />
            <MediaPicker onSelect={onMediaPick} />
            <DocumentPicker onSelect={onDocumentPick} />
            <AttachmentOption
              icon="location"
              label="Location"
              color="#F44336"
              onPress={() => {}}
              accessibilityLabel="Share your location"
            />
            <AttachmentOption
              icon="person"
              label="Contact"
              color="#9C27B0"
              onPress={() => {}}
              accessibilityLabel="Share a contact"
            />
            <AttachmentOption
              icon="mic"
              label="Audio"
              color="#3F51B5"
              onPress={() => {}}
              accessibilityLabel="Record audio message"
            />
          </View>
        </View>
      </Animated.View>
    </>
  );
};

interface AttachmentOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export const AttachmentOption = ({
  icon,
  label,
  color,
  onPress,
  accessibilityLabel,
}: AttachmentOptionProps) => (
  <TouchableOpacity
    style={styles.option}
    onPress={onPress}
    accessible={true}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
  >
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.TEXTCOLOR,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREYF7F7FC,
    position: "relative",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.GREY200,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.GREYF7F7FC,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  option: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.TEXTCOLOR,
  },
});
