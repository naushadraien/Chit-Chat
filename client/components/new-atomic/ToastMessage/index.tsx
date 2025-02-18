import { ToastConfig, ToastType } from "@/providers/ToastProvider";
import { RADII } from "@/theme";
import { TOASTCOLORS } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const ToastMessage: React.FC<{
  toast: ToastConfig;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const getIcon = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "!";
      case "info":
        return "i";
      default:
        return "i";
    }
  };

  return (
    <View style={styles.contentContainer}>
      <View style={[styles.iconContainer]}>
        <Text style={styles.icon}>{getIcon(toast.type)}</Text>
      </View>
      <Text style={styles.message}>{toast.message}</Text>
      {toast.onPress && toast.afterPressText && (
        <Pressable onPress={toast.onPress}>
          <Text style={styles.actionText}>{toast.afterPressText}</Text>
        </Pressable>
      )}
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: RADII.PILL,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderColor: TOASTCOLORS.white,
    borderWidth: 1,
  },
  icon: {
    color: TOASTCOLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  message: {
    flex: 1,
    color: TOASTCOLORS.white,
    fontSize: 14,
  },
  actionText: {
    color: TOASTCOLORS.info,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeIcon: {
    color: TOASTCOLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
