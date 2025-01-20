import AppearanceIcon from "./appearance.svg";
import BackBTN from "./back-btn.svg";
import ChatIcon from "./chat.svg";
import ChevronRightIcon from "./chevron-right.svg";
import EmailIcon from "./EmailIcon.svg";
import CloseBTN from "./fi-rr-cross.svg";
import FileIcon from "./file.svg";
import HelpIcon from "./help.svg";
import NotificationIcon from "./notification.svg";
import PlusIcon from "./plus-icon.svg";
import PrivacyIcon from "./privacy.svg";
import UserIcon from "./user.svg";
import SendIcon from "./send.svg";

const Icons = {
  "back-btn": BackBTN,
  "close-btn": CloseBTN,
  "email-icon": EmailIcon,
  "plus-icon": PlusIcon,
  "appearance-icon": AppearanceIcon,
  "chat-icon": ChatIcon,
  "chevron-right-icon": ChevronRightIcon,
  "file-icon": FileIcon,
  "help-icon": HelpIcon,
  "notification-icon": NotificationIcon,
  "privacy-icon": PrivacyIcon,
  "user-icon": UserIcon,
  "send-icon": SendIcon,
} as const;

type IconNameType = keyof typeof Icons;

export { IconNameType, Icons };
