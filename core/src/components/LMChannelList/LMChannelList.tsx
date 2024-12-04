import LMChatDMChannelList from "./LMDMChatChannels";
import LMChatGroupChannelList from "./LMGroupChatChannelList";
import { LMChatCurrentMode } from "../../enums/lm-chat-modes";

const LMChannelList = ({
  currentMode,
  currentChatroomId,
}: LMChannelListProps) => {
  const switcher = () => {
    if (currentMode === LMChatCurrentMode.GROUP_CHAT) {
      return <LMChatGroupChannelList currentChatroomId={currentChatroomId} />;
    } else if (currentMode === LMChatCurrentMode.DIRECT_MESSAGE) {
      return <LMChatDMChannelList currentChatroomId={currentChatroomId} />;
    }
  };
  return switcher();
};

export interface LMChannelListProps {
  currentChatroomId?: number;
  currentMode: LMChatCurrentMode;
}

export default LMChannelList;
