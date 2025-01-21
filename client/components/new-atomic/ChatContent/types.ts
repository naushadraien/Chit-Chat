type MessageType = "text" | "image" | "video" | "file";

export interface MessageContent {
  type: MessageType;
  content: string;
  time: string;
  fileName?: string;
  fileSize?: string;
  thumbnail?: string;
}

export interface ChatContentProps {
  isMe?: boolean;
  message: MessageContent;
}
