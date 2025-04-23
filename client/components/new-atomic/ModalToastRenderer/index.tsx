// modalToast.tsx
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ToastType = "success" | "error" | "info" | "warning";
type ToastPosition = "top" | "bottom";

interface ModalToastProps {
  text1?: string;
  text2?: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

interface ModalToastData {
  visible: boolean;
  text1: string;
  text2: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
}

// Create a global emitter for direct access from anywhere
const toastEmitter = {
  listeners: new Set<(props: ModalToastProps) => void>(),

  emit(props: ModalToastProps) {
    this.listeners.forEach((listener) => listener(props));
  },

  subscribe(listener: (props: ModalToastProps) => void) {
    //here listener is a function whose type is like listener:(props:ModalToastProps)=>void
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },
};

// Global API for direct access
export const modalToast = {
  success: (text1: string, text2?: string) => {
    toastEmitter.emit({ type: "success", text1, text2 });
  },
  error: (text1: string, text2?: string) => {
    toastEmitter.emit({ type: "error", text1, text2 });
  },
  info: (text1: string, text2?: string) => {
    toastEmitter.emit({ type: "info", text1, text2 });
  },
  warning: (text1: string, text2?: string) => {
    toastEmitter.emit({ type: "warning", text1, text2 });
  },
  hide: () => {
    // Optional: Add ability to hide programmatically
  },
};

// Component for use inside modals
export function ModalToastRenderer() {
  const [toast, setToast] = useState<ModalToastData>({
    visible: false,
    text1: "",
    text2: "",
    type: "info",
    duration: 3000,
    position: "top",
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for toast events
  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((props) => {
      showToast(props);
    });

    return unsubscribe;
  }, []);

  const showToast = ({
    text1 = "",
    text2 = "",
    type = "info",
    duration = 3000,
    position = "top",
  }: ModalToastProps) => {
    // Clear existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Update state
    setToast({ visible: true, text1, text2, type, duration, position });

    // Reset and start animations
    progressAnim.setValue(0);
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();

    // Set timeout to hide toast
    timeoutRef.current = setTimeout(hideToast, duration);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setToast((prev) => ({ ...prev, visible: false })));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    const iconProps = { size: 24, color: "#fff" };
    switch (toast.type) {
      case "success":
        return <CheckCircle {...iconProps} />;
      case "error":
        return <AlertCircle {...iconProps} />;
      case "warning":
        return <AlertTriangle {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  // Get background color based on toast type
  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  // Get position styles based on position prop
  const getPositionStyle = () => {
    return toast.position === "top"
      ? { top: 50, bottom: undefined }
      : { top: undefined, bottom: 50 };
  };

  // Don't render anything if toast is not visible
  if (!toast.visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        { opacity: fadeAnim, backgroundColor: getBackgroundColor() },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <View style={styles.textContainer}>
          {toast.text1 ? <Text style={styles.title}>{toast.text1}</Text> : null}
          {toast.text2 ? (
            <Text style={styles.message}>{toast.text2}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["100%", "0%"],
            }),
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 9999, // Increased for modal visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999999, // Increased for modal visibility
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  closeButton: {
    marginLeft: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
