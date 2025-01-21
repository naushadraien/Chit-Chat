import { Typography } from "@/components/atomic/Typography";
import { MessageContent } from "./types";
import { Image, View } from "react-native";
import { RADII, SPACINGS } from "@/theme";
import { SvgIcon } from "@/components/atomic/SvgIcon";

export const renderContent = (
  message: MessageContent,
  isMe: boolean = false
) => {
  switch (message.type) {
    case "text":
      return (
        <Typography color={isMe ? "WHITE" : "TEXTCOLOR"}>
          {message.content}
        </Typography>
      );
    case "image":
      return (
        <Image
          source={{ uri: message.content }}
          style={{
            width: 200,
            height: 150,
            borderRadius: RADII.SM,
          }}
        />
      );
    case "video":
      return (
        <View>
          <Image
            source={{ uri: message.thumbnail }}
            style={{
              width: 200,
              height: 150,
              borderRadius: RADII.SM,
            }}
          />
        </View>
      );
    case "file":
      return (
        <View
          style={{
            flexDirection: "row",
            gap: SPACINGS.MD,
          }}
        >
          <SvgIcon
            name="file-icon"
            size={24}
            fill={isMe ? "WHITE" : "TEXTCOLOR"}
            style={{
              marginTop: 3,
            }}
          />
          <View>
            <Typography color={isMe ? "WHITE" : "TEXTCOLOR"}>
              {message.fileName}
            </Typography>
            <Typography fontSize="XS" color={isMe ? "WHITE" : "GREYADB5BD"}>
              {message.fileSize}
            </Typography>
          </View>
        </View>
      );
  }
};
