import { ToastMessage } from "@/components/new-atomic/ToastMessage";
import { useCustomSafeInsets } from "@/hooks/useCustomSafeInsets";
import { TOASTCOLORS } from "@/theme/colors";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Animated, Platform, StyleSheet } from "react-native";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  afterPressText?: string;
  onClose?: void;
  onPress?: () => void;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastFn: ((config: ToastConfig) => void) | null = null;

export const showToast = (config: ToastConfig) => {
  if (toastFn) {
    toastFn(config);
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const { top } = useCustomSafeInsets();

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => setToast(null));
  }, [animation, progressAnimation]);

  const showToastMessage = useCallback(
    (config: ToastConfig) => {
      setToast(config);
      animation.setValue(0);
      progressAnimation.setValue(1);

      const duration = config.duration || 3000;

      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(progressAnimation, {
            toValue: 0,
            duration: duration,
            useNativeDriver: false,
          }),
          Animated.delay(duration),
        ]),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setToast(null));
    },
    [animation, progressAnimation]
  );

  // Set the function reference for external usage
  React.useEffect(() => {
    // When ToastProvider mounts, store the reference
    toastFn = showToastMessage; // Now global showToast can work
    // When ToastProvider unmounts, remove the reference
    return () => {
      toastFn = null;
    };
  }, [showToastMessage]);

  return (
    <ToastContext.Provider value={{ showToast: showToastMessage }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: TOASTCOLORS[toast.type || "info"],
            },
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
              top: top + 10,
            },
          ]}
        >
          <ToastMessage toast={toast} onClose={hideToast} />
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    padding: 16,
    zIndex: 9999,
    elevation: Platform.OS === "android" ? 9999 : undefined,
    backgroundColor: "red",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
