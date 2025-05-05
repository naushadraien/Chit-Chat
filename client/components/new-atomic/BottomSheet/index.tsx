import { COLORS } from "@/theme";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface BottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;

  /**
   * Function to call when the bottom sheet should close
   */
  onClose: () => void;

  /**
   * Height of the bottom sheet (default: 300)
   */
  height?: number;

  /**
   * Whether to show a handle at the top of the sheet (default: true)
   */
  showHandle?: boolean;

  /**
   * Whether to show a backdrop behind the sheet (default: true)
   */
  showBackdrop?: boolean;

  /**
   * Opacity of the backdrop when fully visible (default: 0.5)
   */
  backdropOpacity?: number;

  /**
   * Additional styles for the bottom sheet container
   */
  containerStyle?: ViewStyle;

  /**
   * How much the sheet needs to be dragged down to dismiss (default: 100)
   */
  dismissThreshold?: number;

  /**
   * Children to render inside the bottom sheet
   */
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  height = 300,
  showHandle = true,
  showBackdrop = true,
  backdropOpacity = 0.5,
  containerStyle,
  dismissThreshold = 100,
  children,
}) => {
  const { height: screenHeight } = Dimensions.get("window");
  const animation = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(visible);

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsRendered(false);
      });
    }
  }, [visible, animation]);

  // Pan responder for drag gestures
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
          const newValue = 1 - Math.min(1, gestureState.dy / (height * 1.5));
          animation.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down far enough, dismiss
        if (gestureState.dy > dismissThreshold || gestureState.vy > 0.5) {
          onClose();
        } else {
          // Otherwise spring back
          Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  // Don't render anything if not visible and animation is at 0
  if (!isRendered) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Backdrop */}
      {showBackdrop && (
        <TouchableOpacity
          style={[
            styles.backdrop,
            {
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, backdropOpacity],
              }),
            },
          ]}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            height: height,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenHeight, 0],
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle */}
        {showHandle && (
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 10,
  },
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
    overflow: "hidden",
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.GREY200,
  },
  content: {
    flex: 1,
  },
});
