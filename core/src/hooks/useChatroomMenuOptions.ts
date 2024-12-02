import { useCallback, useContext, useMemo } from "react";
import { ZeroArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { LMChatroomContext } from "../context/LMChatChatroomContext";
import UserProviderContext from "../context/LMUserProviderContext";

import { CustomActions } from "../customActions";
import { ChatroomAction } from "../enums/lm-chatroom-actions";
import { ChatroomMenuCustomActions } from "../types/prop-types/CustomComponents";

function useChatroomMenuOptions(
  chatroomMenuCustomActions?: ChatroomMenuCustomActions,
): UseChatroomMenuOptions {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroomDetails, setNewChatroom } = useContext(LMChatroomContext);
  const { currentUser, currentCommunity, memberState, logoutUser } =
    useContext(UserProviderContext);
  const {
    onMuteCustom,
    onViewParticipantsCustom,
    onBlockCustom,
    onLeaveChatroomCustom,
    onUnBlockCustom,
  } = chatroomMenuCustomActions || {};

  const onMute = useCallback(async () => {
    try {
      const call = await lmChatclient?.muteChatroom({
        chatroomId: parseInt(chatroomDetails!.chatroom!.id!.toString()),
        value: chatroomDetails?.chatroomActions.some(
          (option) => option.id === 6,
        )
          ? true
          : false,
      });
      if (call.success && chatroomDetails) {
        const newChatroom = { ...chatroomDetails };

        if (newChatroom?.chatroomActions?.some((option) => option.id === 6)) {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === 6) {
                return { id: 8, title: "Unmute notifications" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === 8) {
                return { id: 6, title: "Mute notifications" };
              } else {
                return options;
              }
            },
          );
        }
        setNewChatroom(newChatroom);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroomDetails, lmChatclient, setNewChatroom]);
  const onLeaveChatroom = useCallback(async () => {
    try {
      const call = await lmChatclient?.followChatroom({
        collabcardId: parseInt(
          chatroomDetails?.chatroom?.id?.toString() || "0",
        ),
        memberId: parseInt(currentUser?.id.toString() || "0"),
        value: false,
      });
      if (call.success) {
        setNewChatroom(null);
        dispatchEvent(
          new CustomEvent(CustomActions.CHATROOM_LEAVE_ACTION_COMPLETED, {
            detail: chatroomDetails?.chatroom.id,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroomDetails, currentUser, lmChatclient, setNewChatroom]);
  const onViewParticipants = useCallback(async () => {
    try {
      //
    } catch (error) {
      console.log(error);
    }
  }, []);
  const onUnBlock = useCallback(async () => {
    try {
      const unblockCall = await lmChatclient?.blockMember({
        status: 1,
        chatroomId: chatroomDetails!.chatroom.id,
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: unblockCall.data.conversation,
        }),
      );
      if (unblockCall.success && chatroomDetails) {
        const newChatroom = { ...chatroomDetails };
        newChatroom.chatroom.chatRequestState = 1;
        if (
          newChatroom?.chatroomActions?.some(
            (option) => option.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM,
          )
        ) {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM) {
                return { id: 27, title: "Block" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_BLOCK_CHATROOM) {
                return { id: 28, title: "Unblock" };
              } else {
                return options;
              }
            },
          );
        }
        setNewChatroom(newChatroom);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroomDetails, lmChatclient, setNewChatroom]);
  const onBlock = useCallback(async () => {
    try {
      const blockCall = await lmChatclient?.blockMember({
        status: 0,
        chatroomId: chatroomDetails!.chatroom.id,
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: blockCall.data.conversation,
        }),
      );
      if (blockCall.success && chatroomDetails) {
        const newChatroom = { ...chatroomDetails };
        newChatroom.chatroom.chatRequestState = 2;
        if (
          newChatroom?.chatroomActions?.some(
            (option) => option.id === ChatroomAction.ACTION_BLOCK_CHATROOM,
          )
        ) {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_BLOCK_CHATROOM) {
                return { id: 28, title: "Unblock" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroomActions = newChatroom.chatroomActions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM) {
                return { id: 27, title: "Block" };
              } else {
                return options;
              }
            },
          );
        }
        setNewChatroom(newChatroom);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroomDetails, lmChatclient, setNewChatroom]);
  const chatroomMenuDefaultActions = useMemo(() => {
    return {
      onLeaveChatroom,
      onMute,
      onViewParticipants,
      onBlock,
      onUnBlock,
    };
  }, [onBlock, onLeaveChatroom, onMute, onUnBlock, onViewParticipants]);

  const applicationGeneralDataContext = useMemo(() => {
    return {
      currentUser,
      currentCommunity,
      memberState,
      logoutUser,
    };
  }, [currentCommunity, currentUser, logoutUser, memberState]);
  return {
    onLeaveChatroom: onLeaveChatroomCustom
      ? onLeaveChatroomCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
        )
      : onLeaveChatroom,
    onMute: onMuteCustom
      ? onMuteCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
        )
      : onMute,

    onViewParticipants: onViewParticipantsCustom
      ? onViewParticipantsCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
        )
      : onViewParticipants,
    onBlock: onBlockCustom
      ? onBlockCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
        )
      : onBlock,
    onUnBlock: onUnBlockCustom
      ? onUnBlockCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
        )
      : onUnBlock,
  };
}

export default useChatroomMenuOptions;

export interface UseChatroomMenuOptions {
  onMute: ZeroArgVoidReturns;
  onViewParticipants: ZeroArgVoidReturns;
  onLeaveChatroom: ZeroArgVoidReturns;
  onBlock: ZeroArgVoidReturns;
  onUnBlock: ZeroArgVoidReturns;
}

export interface ChatroomMenuDefaultActions {
  onMute: ZeroArgVoidReturns;
  onViewParticipants: ZeroArgVoidReturns;
  onLeaveChatroom: ZeroArgVoidReturns;
  onBlock: ZeroArgVoidReturns;
  onUnBlock: ZeroArgVoidReturns;
}
