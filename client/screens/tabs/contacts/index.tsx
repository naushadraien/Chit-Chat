import { Divider } from "@/components/atomic/Divider";
import { SearchInputWithoutDropdown } from "@/components/atomic/SearchInput/SearchInputWithoutDropdown";
import { SvgIcon } from "@/components/atomic/SvgIcon";
import Spacer from "@/components/new-atomic/Spacer";
import ChatCard from "@/components/ui/ChatCard";
import WithTitleAndRightComp from "@/components/ui/WithTitleAndRightComp";
import { useCustomSafeInsets } from "@/hooks/useCustomSafeInsets";
import withSafeAreaWrapperHOC from "@/lib/withSafeAreaWrapperHOC";
import React from "react";
import { FlatList, View } from "react-native";

const DUMMY_DATA = [
  {
    id: "1",
    name: "Sarah Johnson",
    isOnline: true,
    lastSeen: null,
  },
  {
    id: "2",
    name: "Michael Wong",
    isOnline: false,
    lastSeen: "2023-05-01T10:30:00Z",
  },
  {
    id: "3",
    name: "Jessica Patel",
    isOnline: true,
    lastSeen: null,
  },
  {
    id: "4",
    name: "David Kim",
    isOnline: false,
    lastSeen: "2023-05-01T09:45:00Z",
  },
  {
    id: "5",
    name: "Emma Rodriguez",
    isOnline: false,
    lastSeen: "2023-05-01T08:15:00Z",
  },
  {
    id: "6",
    name: "Raj Malhotra",
    isOnline: true,
    lastSeen: null,
  },
  {
    id: "7",
    name: "Olivia Chen",
    isOnline: false,
    lastSeen: "2023-04-30T22:10:00Z",
  },
  {
    id: "8",
    name: "James Wilson",
    isOnline: false,
    lastSeen: "2023-04-30T18:30:00Z",
  },
  {
    id: "9",
    name: "Aisha Mehta",
    isOnline: true,
    lastSeen: null,
  },
  {
    id: "10",
    name: "Carlos Gutierrez",
    isOnline: false,
    lastSeen: "2023-04-29T15:45:00Z",
  },
];

function ContactsScreen() {
  const { bottom } = useCustomSafeInsets();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        gap: 30,
      }}
    >
      <WithTitleAndRightComp
        title="Contacts"
        containerStyle={{
          paddingHorizontal: 8,
        }}
        rightComp={<SvgIcon name="plus-icon" size={20} />}
      />
      <View
        style={{
          gap: 16,
        }}
      >
        <SearchInputWithoutDropdown />
        <FlatList
          contentContainerStyle={{
            gap: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={DUMMY_DATA}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => {
            return (
              <ChatCard
                name={item.name}
                content={item.isOnline ? "Online" : item.lastSeen || ""}
                isOnline={item.isOnline}
              />
            );
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Divider />
            </View>
          )}
          ListFooterComponent={() => <Spacer size={250} />}
        />
      </View>
    </View>
  );
}

export default withSafeAreaWrapperHOC(ContactsScreen);
