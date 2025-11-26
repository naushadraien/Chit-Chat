import { Divider } from "@/components/atomic/Divider";
import { MenuItem } from "@/components/new-atomic/MenuItem";
import { MenuItemWithAvatar } from "@/components/new-atomic/MenuItemWithAvatar";
import WithTitleAndRightComp from "@/components/ui/WithTitleAndRightComp";
import withSafeAreaWrapperHOC from "@/lib/withSafeAreaWrapperHOC";
import { useAuth } from "@/providers/AuthProvider";
import { extractPhoneParts } from "@/utils/textHelpers";
import React from "react";
import { View } from "react-native";

const MenuScreen = () => {
  const { userDetails, onLogout, isLoading } = useAuth();

  const handleLogout = () =>
    onLogout({
      sessionId: userDetails?.sessionId ?? "",
    });

  return (
    <View
      style={{
        paddingHorizontal: 16,
        gap: 30,
      }}
    >
      <WithTitleAndRightComp
        title="More"
        containerStyle={{
          paddingHorizontal: 8,
        }}
      />
      <View
        style={{
          gap: 20,
        }}
      >
        <MenuItemWithAvatar
          phone={extractPhoneParts(userDetails?.phoneNumber || "").formatted}
          userName={userDetails?.firstName + " " + userDetails?.lastName}
          imgUri={userDetails?.avatar || ""}
        />

        <MenuItem iconName="user-icon" title="Account" />
        <MenuItem iconName="chat-icon" title="Chats" />
        <MenuItem iconName="appearance-icon" title="Appearance" />
        <MenuItem iconName="notification-icon" title="Notification" />
        <MenuItem iconName="privacy-icon" title="Privacy" />
        <MenuItem iconName="file-icon" title="Data Usage" />
        <Divider />
        <MenuItem iconName="help-icon" title="Help" />
        <MenuItem iconName="email-icon" title="Invite Your Friends" />
        <Divider />
        <MenuItem
          ionIcon="exit-outline"
          title="Log out"
          size={22}
          onPress={handleLogout}
          isLoading={isLoading}
          loadingText="Signing Out..."
        />
      </View>
    </View>
  );
};

export default withSafeAreaWrapperHOC(MenuScreen);
