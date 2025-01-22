import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Divider } from "@/components/atomic/Divider";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { Avatar } from "@/components/new-atomic/Avatar";
import { ChatContent } from "@/components/new-atomic/ChatContent";
import { ChatInput } from "@/components/new-atomic/ChatInput";
import CustomCountryPicker from "@/components/new-atomic/CustomCountryPicker";
import { Dot } from "@/components/new-atomic/Dot";
import { InputField } from "@/components/new-atomic/Input";
import { MenuItem } from "@/components/new-atomic/MenuItem";
import { MenuItemWithAvatar } from "@/components/new-atomic/MenuItemWithAvatar";
import { TypingIndicator } from "@/components/new-atomic/TypingIndicator";
import { UploadStory } from "@/components/new-atomic/UploadStory";
import ChatCard from "@/components/ui/ChatCard";
import { mockChats } from "@/constants/chats/DummyData";
import { Header } from "@/Layout/Header";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const [countryCode, setCountryCode] = useState("+353");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
  };

  const handlePhoneNumberChange = (phone: string) => {
    setPhoneNumber(phone);
  };
  return (
    <SafeAreaWrapper bottomInset={0}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 19,
          paddingBottom: 100,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
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
        <Header variant="WithBackBTN" />
        <Header variant="WithTitle" title="Your Profile" />
        <Header variant="WithSearch" title="Athalia Putri" />
        {mockChats.map((item, idx) => {
          return (
            <ChatContent key={idx} isMe={item.isMe} message={item.message} />
          );
        })}
        <TypingIndicator
          isMe={true}
          // avatarUrl="https://example.com/avatar.jpg"
          userName="John"
        />
        <ChatCard
          name="Athalia Putri"
          content="Good morning, did you sleep well?"
          date="Today"
          messageUnreadCount={1}
        />
        <CustomCountryPicker
          defaultCountryCode={countryCode}
          defaultPhoneNumber={phoneNumber}
          onCountryCodeChange={handleCountryCodeChange}
          onPhoneNumberChange={handlePhoneNumberChange}
        />
      </ScrollView>
      <ChatInput />
    </SafeAreaWrapper>
  );
}
