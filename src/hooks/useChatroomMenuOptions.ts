import { useContext } from "react";
import { ZeroArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import UserProviderContext from "../context/UserProviderContext";

function useChatroomMenuOptions(): UseChatroomMenuOptions {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  const { currentUser } = useContext(UserProviderContext);
  const onMute = async () => {
    try {
      const call = await lmChatclient?.muteChatroom({
        chatroomId: parseInt(chatroom!.chatroom!.id!.toString()),
        value: chatroom?.chatroom_actions.some((option) => option.id === 6)
          ? true
          : false,
      });
      console.log(call);
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
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };
  const onViewParticipants = async () => {
    try {
      //
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
