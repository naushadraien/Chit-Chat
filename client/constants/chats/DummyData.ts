import { MessageContent } from "@/components/new-atomic/ChatContent/types";

export const mockChats: Array<{ isMe: boolean; message: MessageContent }> = [
  {
    isMe: true,
    message: {
      type: "text",
      content: "Hey, how are you?",
      time: "09:30 AM",
    },
  },
  {
    isMe: false,
    message: {
      type: "text",
      content: "I'm good, thanks! How about you?",
      time: "09:31 AM",
    },
  },
  {
    isMe: true,
    message: {
      type: "image",
      content:
        "https://fastly.picsum.photos/id/872/200/300.jpg?hmac=ZO8BvamVelLddwqo7mHSnq6o6uXwPb9r41i4KuJTVdo",
      time: "09:32 AM",
    },
  },
  {
    isMe: false,
    message: {
      type: "video",
      content: "http://example.com/video.mp4",
      thumbnail:
        "https://fastly.picsum.photos/id/872/200/300.jpg?hmac=ZO8BvamVelLddwqo7mHSnq6o6uXwPb9r41i4KuJTVdo",
      time: "09:33 AM",
    },
  },
  {
    isMe: true,
    message: {
      type: "file",
      content: "http://example.com/doc.pdf",
      fileName: "Presentation.pdf",
      fileSize: "2.5 MB",
      time: "09:34 AM",
    },
  },
];
