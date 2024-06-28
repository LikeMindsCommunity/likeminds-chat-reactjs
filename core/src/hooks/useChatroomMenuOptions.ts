import { useContext } from "react";
import { ZeroArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import UserProviderContext from "../context/UserProviderContext";
import { useNavigate } from "react-router-dom";
import { CustomActions } from "../customActions";
import {
  PARTICIPANTS_PATH,
  ROOT_PATH,
} from "../shared/constants/lm.routes.constant";

function useChatroomMenuOptions(): UseChatroomMenuOptions {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom, setNewChatroom } = useContext(LMChatChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const navigate = useNavigate();
  const onMute = async () => {
    try {
      const call = await lmChatclient?.muteChatroom({
        chatroomId: parseInt(chatroom!.chatroom!.id!.toString()),
        value: chatroom?.chatroom_actions.some((option) => option.id === 6)
          ? true
          : false,
      });
      if (call.success && chatroom) {
        const newChatroom = { ...chatroom };
        setNewChatroom(newChatroom);
        if (newChatroom?.chatroom_actions?.some((option) => option.id === 6)) {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
            (options) => {
              if (options.id === 6) {
                return { id: 8, title: "Unmute notifications" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
            (options) => {
              if (options.id === 8) {
                return { id: 6, title: "Mute notifications" };
              } else {
                return options;
              }
            },
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onLeaveChatroom = async () => {
    try {
      const call = await lmChatclient?.followChatroom({
        collabcardId: parseInt(chatroom?.chatroom?.id?.toString() || "0"),
        memberId: parseInt(currentUser?.id.toString() || "0"),
        value: false,
      });
      if (call.success) {
        setNewChatroom(null);
        dispatchEvent(
          new CustomEvent(CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED, {
            detail: chatroom?.chatroom.id,
          }),
        );
        navigate(ROOT_PATH);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onViewParticipants = async () => {
    try {
      //
      navigate(`/${PARTICIPANTS_PATH}/${chatroom?.chatroom.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    onLeaveChatroom,
    onMute,
    onViewParticipants,
  };
}

export default useChatroomMenuOptions;

export interface UseChatroomMenuOptions {
  onMute: ZeroArgVoidReturns;
  onViewParticipants: ZeroArgVoidReturns;
  onLeaveChatroom: ZeroArgVoidReturns;
}
