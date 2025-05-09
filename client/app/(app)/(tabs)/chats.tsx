import { FilledButton } from "@/components/atomic/Button/FilledButton";
import { Divider } from "@/components/atomic/Divider";
import { SafeAreaWrapper } from "@/components/atomic/SafeAreaWrapper";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { Avatar } from "@/components/new-atomic/Avatar";
import { ChatContent } from "@/components/new-atomic/ChatContent";
import { ChatInputBox } from "@/components/new-atomic/ChatInpuBox";
import CodeInput from "@/components/new-atomic/CodeInput";
import CustomCountryPicker from "@/components/new-atomic/CustomCountryPicker";
import { Dot } from "@/components/new-atomic/Dot";
import { InputField } from "@/components/new-atomic/Input";
import { MenuItem } from "@/components/new-atomic/MenuItem";
import { MenuItemWithAvatar } from "@/components/new-atomic/MenuItemWithAvatar";
import ProfilePicUpload from "@/components/new-atomic/ProfilePicUpload";
import { TypingIndicator } from "@/components/new-atomic/TypingIndicator";
import { UploadStory } from "@/components/new-atomic/UploadStory";
import ChatCard from "@/components/ui/ChatCard";
import UploadStoryWithTitle from "@/components/ui/UserStories/UploadStoryWithTitle";
import UserStory from "@/components/ui/UserStories/UserStory";
import { mockChats } from "@/constants/chats/DummyData";
import { Header } from "@/Layout/Header";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const [countryCode, setCountryCode] = useState("+353");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { userDetails } = useAuth();

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
        <UploadStoryWithTitle />
        <UserStory
          firstName={userDetails?.firstName || ""}
          lastName={userDetails?.lastName || ""}
          imgUri={userDetails?.avatar || ""}
        />
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
        <CodeInput inputCount={6} handleCodeInput={(val) => {}} />
        <ProfilePicUpload isUploading={true} onImagePick={(imgUri) => {}} />
      </ScrollView>
      <ChatInputBox />
    </SafeAreaWrapper>
  );
}
