import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { STARTUP_COMPLETED } from "@/constants/AsyncStorage";
import { SPACINGS } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function StartupScreen() {
  const setStartupCompleteToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem(STARTUP_COMPLETED, "completed");
      router.replace("/login");
    } catch (error) {
      console.error(
        "Error while setting startup status to async storage",
        error
      );
    }
  };
  return (
    <SafeAreaWrapper>
      <View
        style={{
          flex: 1,
          paddingHorizontal: SPACINGS.XL,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SvgIcon name="chat-illustration-icon" size={271} />
          <Typography
            style={{
              marginTop: 42,
            }}
            textAlign="center"
            fontFamily="MULISH_BOLD"
            fontSize="DISPLAY4"
          >
            Connect easily with your family and friends over countries
          </Typography>
        </View>
        <View
          style={{
            gap: 18,
            marginTop: 126,
          }}
        >
          <Typography
            fontFamily="MULISH_SEMIBOLD"
            fontSize="MD"
            textAlign="center"
          >
            Terms & Privacy Policy
          </Typography>
          <FilledButton
            title="Start Messaging"
            onPress={setStartupCompleteToAsyncStorage}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
