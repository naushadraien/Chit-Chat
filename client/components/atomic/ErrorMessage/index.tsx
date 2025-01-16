import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import { COLORS } from "@/theme";

type Props = {
  error: string | string[];
  touched: boolean;
};

export const ErrorMessage = ({ error, touched }: Props) => {
  return (
    <>
      {error && touched ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert" size={15} color={COLORS.REDFF4D4F} />
          </View>
          <Typography
            fontFamily="MULISH_SEMIBOLD"
            fontSize="MD"
            color="REDFF4D4F"
          >
            {error}
          </Typography>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 6,
  },
  errorIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: COLORS.REDFFA39E,
  },
});
