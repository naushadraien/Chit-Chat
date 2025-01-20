import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Divider } from "@/components/atomic/Divider";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { Avatar } from "@/components/new-atomic/Avatar";
import { ChatInput } from "@/components/new-atomic/ChatInput";
import { Dot } from "@/components/new-atomic/Dot";
import { InputField } from "@/components/new-atomic/Input";
import { MenuItem } from "@/components/new-atomic/MenuItem";
import { MenuItemWithAvatar } from "@/components/new-atomic/MenuItemWithAvatar";
import { UploadStory } from "@/components/new-atomic/UploadStory";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaWrapper bottomInset={0}>
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
        <Avatar variant="WithoutImage" enableGradient />
        <Avatar variant="Image" enableGradient isOnline />
        <UploadStory />
        <Dot enableBorderColor />
        <InputField placeholder="Test" />
        <FilledButton title="Test123" />
        <MenuItem iconName="user-icon" title="Account" />
        <MenuItemWithAvatar
          phone="+62 1309 - 1710 - 1920"
          userName="Almayra Zamzamy"
        />
        <ChatInput />
      </View>
    </SafeAreaWrapper>
  );
}
