import LMChatDMChannelList from "./LMDMChatChannels";
import LMGroupChatChannelList from "./LMGroupChatChannelList";
import { LMChatCurrentMode } from "../../enums/lm-chat-modes";

const LMChannelList = ({
  currentMode,
  currentChatroomId,
}: LMChannelListProps) => {
  const switcher = () => {
    if (currentMode === LMChatCurrentMode.GROUP_CHAT) {
      return <LMGroupChatChannelList currentChatroomId={currentChatroomId} />;
    } else if (currentMode === LMChatCurrentMode.DIRECT_MESSAGE) {
      return <LMChatDMChannelList currentChatroomId={currentChatroomId} />;
    }
  };
  return switcher();
};

export interface LMChannelListProps {
  currentChatroomId?: string;
  currentMode: LMChatCurrentMode;
}

export default LMChannelList;
