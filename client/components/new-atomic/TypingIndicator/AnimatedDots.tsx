import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { COLORS, ColorsType, SPACINGS } from "@/theme";

interface AnimatedDotsProps {
  color: ColorsType;
}

export const AnimatedDots: React.FC<AnimatedDotsProps> = ({ color }) => {
  const fadeAnimations = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    const animations = fadeAnimations.map((animation, index) => {
      return Animated.sequence([
        Animated.delay(index * 200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(animation, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    });

    Animated.parallel(animations).start();

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: SPACINGS.XS }}>
      {fadeAnimations.map((animation, index) => (
        <Animated.View
          key={index}
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS[color],
            opacity: animation,
          }}
        />
      ))}
    </View>
  );
};
