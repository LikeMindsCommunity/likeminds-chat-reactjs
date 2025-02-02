import LMChatDMChannelList from "./LMDMChatChannels";
import LMChatGroupChannelList from "./LMGroupChatChannelList";
import { LMChatTheme } from "../../enums/lm-chat-theme";
import { LMChatChannelListToggle } from "./LMChatChannelToggle";

const LMChannelList = ({
  currentTheme,
  currentChatroomId,
}: LMChannelListProps) => {
  // Render the channel list based on the current theme
  switch (currentTheme) {
    case LMChatTheme.COMMUNITY_CHAT: {
      // Render code for the group chat channel list rendering
      return <LMChatGroupChannelList currentChatroomId={currentChatroomId} />;
    }
    case LMChatTheme.NETWORKING_CHAT: {
      // Render code for the direct message channel list rendering
      return <LMChatDMChannelList currentChatroomId={currentChatroomId} />;
    }
    case LMChatTheme.COMMUNITY_HYBRID_CHAT: {
      return <LMChatChannelListToggle />;
    }
  }
};

export interface LMChannelListProps {
  currentChatroomId?: number;
  // currentMode: LMChatCurrentMode;
  currentTheme: LMChatTheme;
}

export default LMChannelList;
