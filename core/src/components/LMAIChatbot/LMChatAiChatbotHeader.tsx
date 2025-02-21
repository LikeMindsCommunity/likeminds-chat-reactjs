import { FC, useCallback, useContext, useMemo } from "react";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import UserProviderContext from "../../context/LMUserProviderContext";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { Utils } from "../../utils/helpers";
import { ArrowClockwise, X } from "@phosphor-icons/react";
export interface LMChatAIChatbotHeaderInterface {
  closeAIChatbot?: () => void;
  isClearChatOptionEnabled: boolean;
}

const LMChatAIChatbotHeader: FC<LMChatAIChatbotHeaderInterface> = ({
  closeAIChatbot,
  isClearChatOptionEnabled,
}) => {
  const { chatroomDetails } = useContext(LMChatroomContext);
  const { currentUser, logoutUser } = useContext(UserProviderContext);
  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Function for retrieve the Other user in Chatroom
  const getChatroomReciever = useCallback(() => {
    return Utils.getChatroomReciever(chatroomDetails, currentUser);
  }, [chatroomDetails, currentUser]);

  // Function to create chatroom avatar
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

  // Function to retrieve the Title for the chatroom
  const chatroomTitle = useMemo(() => {
    return Utils.getChatroomTitle(chatroomDetails, getChatroomReciever());
  }, [chatroomDetails, getChatroomReciever]);

  // Function to render the Header UI or custom header component
  const renderHeaderComponents = () => {
    if (customComponents?.chatroomHeader)
      return <customComponents.chatroomHeader />;
    return (
      <div className="lm-channel-header">
        <div className="lm-header-left">
          <div className="lm-channel-img">{chatroomAvatar}</div>
          <div className="lm-channel-desc">
            <div className="lm-channel-title">{chatroomTitle}</div>
          </div>
          {isClearChatOptionEnabled ? (
            <span
              className="refresh-ai-bot icon"
              onClick={() => {
                if (logoutUser) {
                  logoutUser();
                }
              }}
            >
              <ArrowClockwise size={24} />
            </span>
          ) : null}
          <span className="close-ai-chatbot" onClick={closeAIChatbot}>
            <X size={24} />
          </span>
        </div>
      </div>
    );
  };

  return renderHeaderComponents();
};

export default LMChatAIChatbotHeader;
