import { COLORS } from "@/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const AudioRecorder = () => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} style={styles.micButton}>
        <FontAwesome5 name="microphone" size={20} color={COLORS.PRIMARYBLUE} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  micButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
