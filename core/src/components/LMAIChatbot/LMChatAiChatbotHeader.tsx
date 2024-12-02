import { useCallback, useContext, useMemo } from "react";

// icons

import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
// Icons
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import UserProviderContext from "../../context/LMUserProviderContext";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";

const LMChatAiChatbotHeader = () => {
  const { chatroomDetails } = useContext(LMChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);
  const getChatroomReciever = useCallback(() => {
    return Utils.getChatroomReciever(chatroomDetails, currentUser);
  }, [chatroomDetails, currentUser]);

  const chatroomAvatar = useMemo(() => {
    if (
      chatroomDetails?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM
    ) {
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
      const imageUrl = chatroomDetails?.chatroom.chatroomImageUrl;
      const name = chatroomDetails?.chatroom.header;
      const avatarContent = getAvatar({ imageUrl, name });
      return avatarContent;
    }
  }, [
    chatroomDetails?.chatroom.chatroomImageUrl,
    chatroomDetails?.chatroom.header,
    chatroomDetails?.chatroom.type,
    getChatroomReciever,
  ]);
  const chatroomTitle = useMemo(() => {
    return Utils.getChatroomTitle(chatroomDetails, getChatroomReciever());
  }, [chatroomDetails, getChatroomReciever]);

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
