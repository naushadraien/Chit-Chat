import BackBTN from "./back-btn.svg";
import CloseBTN from "./fi-rr-cross.svg";
import EmailIcon from "./EmailIcon.svg";
import PlusIcon from "./plus-icon.svg";

const Icons = {
  "back-btn": BackBTN,
  "close-btn": CloseBTN,
  "email-icon": EmailIcon,
  "plus-icon": PlusIcon,
} as const;

type IconNameType = keyof typeof Icons;

export { IconNameType, Icons };
