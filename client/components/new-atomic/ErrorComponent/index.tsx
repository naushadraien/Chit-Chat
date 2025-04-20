import { Typography } from "@/components/atomic/Typography";
import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  error: string;
};

export default function ErrorComponent({ error }: Props) {
  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorIconContainer}>
        <Ionicons name="alert-circle" size={14} color={COLORS.REDFF4D4F} />
      </View>
      <Typography
        fontFamily="MULISH_SEMIBOLD"
        fontSize="SM"
        color="REDFF4D4F"
        style={styles.errorText}
      >
        {error}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  errorIconContainer: {
    marginRight: 6,
  },
  errorText: {
    flex: 1,
  },
});
