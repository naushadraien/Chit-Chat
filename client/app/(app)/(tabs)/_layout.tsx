// TabLayout.tsx
import { IconNameType } from "@/assets/icons";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import { HapticTab } from "@/components/new-atomic/Tabs/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCustomSafeInsets } from "@/hooks/useCustomSafeInsets";
import { COLORS, FONTFAMILIES, FONTSIZES } from "@/theme";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// CustomTabBar component
const CustomTabBar = ({
  focused,
  color,
  title,
  iconName,
}: {
  focused: boolean;
  color: string;
  title: string;
  iconName: IconNameType;
}) => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={`${title} tab`}
      accessibilityHint={`Switch to ${title} tab`}
    >
      {focused ? (
        // Active tab: show text and dot
        <View style={styles.activeTabContainer}>
          <Text style={[styles.label, { color }]}>{title}</Text>
          <View style={[styles.dot, { backgroundColor: color }]} />
        </View>
      ) : (
        // Inactive tab: show icon
        <SvgIcon name={iconName} size={24} color={color} />
      )}
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useCustomSafeInsets();
  const activeColor = COLORS.INPUTTEXTCOLOR;
  const inactiveColor = COLORS.INPUTTEXTCOLOR;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View
            style={[
              styles.tabBar,
              {
                backgroundColor:
                  colorScheme === "dark" ? "#1C1C1E" : COLORS.WHITE,
              },
            ]}
          />
        ),
        tabBarStyle: {
          ...Platform.select({
            ios: {
              elevation: 0,
              borderTopWidth: 0,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: 8,
              borderTopWidth: 0,
            },
          }),
          height: 65,
          paddingBottom: Math.max(insets.bottom, 10),
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Contacts",
          tabBarIcon: ({ focused, color }) => (
            <CustomTabBar
              focused={focused}
              color={color}
              title="Contacts"
              iconName="users-icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ focused, color }) => (
            <CustomTabBar
              focused={focused}
              color={color}
              title="Chats"
              iconName="chat-icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ focused, color }) => (
            <CustomTabBar
              focused={focused}
              color={color}
              title="More"
              iconName="three-dot-icon"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  activeTabContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: FONTSIZES.MD,
    width: "100%",
    fontFamily: FONTFAMILIES.MULISH_SEMIBOLD,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
});
