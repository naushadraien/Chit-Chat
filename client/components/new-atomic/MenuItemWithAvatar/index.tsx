import { SvgIcon } from "@/components/atomic/SvgIcon";
import { Typography } from "@/components/atomic/Typography";
import { COLORS, RADII } from "@/theme";
import React from "react";
import { Pressable, View } from "react-native";
import { Avatar } from "../Avatar";

type Props = {
  userName: string;
  phone: string;
  imgUri?: string;
  onPress?: () => {};
};

export function MenuItemWithAvatar({
  phone,
  userName,
  imgUri,
  onPress,
}: Props) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
        }}
      >
        {!imgUri ? (
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: RADII.PILL,
              backgroundColor: COLORS.GREYEDEDED,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgIcon name="user-icon" size={19} />
          </View>
        ) : (
          <Avatar variant="Image" imgUri={imgUri} borderType="rounded" />
        )}
        <View
          style={{
            gap: 2,
          }}
        >
          <Typography
            fontFamily="MULISH_SEMIBOLD"
            fontSize="MD"
            lineHeight="MD"
          >
            {userName}
          </Typography>
          <Typography
            fontFamily="MULISH_REGULAR"
            fontSize="SM"
            lineHeight="SM"
            color="GREYA4A4A4"
          >
            {phone}
          </Typography>
        </View>
      </View>
      <SvgIcon name="chevron-right-icon" size={12} />
    </Pressable>
  );
}
