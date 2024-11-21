import { useCallback, useContext, useMemo } from "react";

// icons

import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
// Icons
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import UserProviderContext from "../../context/LMUserProviderContext";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMChatAiChatbotHeader = () => {
  const { chatroom } = useContext(LMChatChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const getChatroomReciever = useCallback(() => {
    if (!chatroom) {
      return null;
    }
    if (chatroom.chatroom.type !== ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      return null;
    }
    const recieverUser =
      chatroom.chatroom.member.id.toString() === currentUser.id.toString()
        ? chatroom.chatroom.chatroomWithUser
        : chatroom.chatroom.member;
    return recieverUser;
  }, [chatroom, currentUser]);

  const chatroomAvatar = useMemo(() => {
    if (chatroom?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      const recieverUser = getChatroomReciever();
      if (recieverUser) {
        const imageUrl = recieverUser?.imageUrl;
        const name = recieverUser?.name;
        const avatarContent = getAvatar({ imageUrl, name });
        return avatarContent;
      } else {
        return null;
      }
    } else {
      const imageUrl = chatroom?.chatroom.chatroomImageUrl;
      const name = chatroom?.chatroom.header;
      const avatarContent = getAvatar({ imageUrl, name });
      return avatarContent;
    }
  }, [
    chatroom?.chatroom.chatroomImageUrl,
    chatroom?.chatroom.header,
    chatroom?.chatroom.type,
    getChatroomReciever,
  ]);
  const chatroomTitle = useMemo(() => {
    if (!chatroom) return "";
    const chatroomType = chatroom?.chatroom.type;

    if (chatroomType === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      const recieverUser = getChatroomReciever();
      if (recieverUser) {
        return recieverUser.name;
      } else {
        return "";
      }
    } else {
      return chatroom?.chatroom.header;
    }
  }, [chatroom, getChatroomReciever]);

  const renderHeaderComponents = () => {
    if (customComponents?.chatroomHeader)
      return <customComponents.chatroomHeader />;
    return (
      <>
        <div className="lm-channel-header">
          <div className="lm-header-left">
            <div className="lm-channel-img">{chatroomAvatar}</div>
            <div className="lm-channel-desc">
              <div className="lm-channel-title">{chatroomTitle}</div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return renderHeaderComponents();
};

export default LMChatAiChatbotHeader;
