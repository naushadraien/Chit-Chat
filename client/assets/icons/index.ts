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
import SearchIcon from "./search-icon.svg";
import MenuIcon from "./menu-icon.svg";
import UploadPlusIcon from "./upload-plus-icon.svg";
import ChatIllustrationIcon from "./Illustration.svg";
import EyeCloseIcon from "./eye-close.svg";
import EyeOpenIcon from "./eye-open.svg";
import UsersIcon from "./users-icon.svg";
import ThreeDotIcon from "./three-dot-icon.svg";

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
  "search-icon": SearchIcon,
  "menu-icon": MenuIcon,
  "upload-plus-icon": UploadPlusIcon,
  "chat-illustration-icon": ChatIllustrationIcon,
  "eye-close-icon": EyeCloseIcon,
  "eye-open-icon": EyeOpenIcon,
  "users-icon": UsersIcon,
  "three-dot-icon": ThreeDotIcon,
} as const;

type IconNameType = keyof typeof Icons;

export { IconNameType, Icons };
