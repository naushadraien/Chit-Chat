import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { Typography } from "@/components/atomic/Typography";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
  return (
    <SafeAreaWrapper
      style={{ alignItems: "center", justifyContent: "center", gap: 20 }}
    >
      <View style={{ flexDirection: "row", gap: 20 }}>
        <FontAwesome6 name="4" size={34} color="black" />
        <FontAwesome6 name="0" size={34} color="black" />
        <FontAwesome6 name="4" size={34} color="black" />
      </View>
      <Typography textAlign="center">
        The Screen you are trying to navigate doesnot exists!!!
      </Typography>

      <FilledButton title="Go Back To Home" onPress={() => router.push("/")} />
    </SafeAreaWrapper>
  );
}
