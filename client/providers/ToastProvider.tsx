"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react-native";

type ToastType = "success" | "error" | "info" | "warning";
type ToastPosition = "top" | "bottom";

// Add position to the props interface
interface ToastProps {
  text1?: string;
  text2?: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

interface ToastData {
  visible: boolean;
  text1: string;
  text2: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
}

interface ToastContextType {
  showToast: (props: ToastProps) => void;
  hideToast: () => void;
}

// Create context and global reference
const ToastContext = createContext<ToastContextType | undefined>(undefined);
let toastRef: ToastContextType | undefined;

// Hooks and global functions
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const showToast = (props: ToastProps) => {
  if (toastRef) toastRef.showToast(props);
};

export const hideToast = () => {
  if (toastRef) toastRef.hideToast();
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Add position to the state
  const [toast, setToast] = useState<ToastData>({
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

  // Add position to the showToast function
  const showToast = ({
    text1 = "",
    text2 = "",
    type = "info",
    duration = 3000,
    position = "top",
  }: ToastProps) => {
    // Clear existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Update state with single setter
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

  // Store methods in ref for external access
  React.useEffect(() => {
    toastRef = { showToast, hideToast };
    return () => {
      toastRef = undefined;
    };
  }, []);

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

  if (!toast.visible)
    return (
      <ToastContext.Provider value={{ showToast, hideToast }}>
        {children}
      </ToastContext.Provider>
    );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
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
            {toast.text1 ? (
              <Text style={styles.title}>{toast.text1}</Text>
            ) : null}
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
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
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
