import { Avatar } from "@/components/atomic/Avatar";
import { Divider } from "@/components/atomic/Divider";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaWrapper>
      <View
        style={{
          flexGrow: 1,
          paddingHorizontal: 19,
          gap: 10,
        }}
      >
        <SvgIcon name="email-icon" fill="REDFF4D4F" />
        <Typography>Hello I am testing</Typography>
        <Divider />
        <Avatar />
      </View>
    </SafeAreaWrapper>
  );
}
