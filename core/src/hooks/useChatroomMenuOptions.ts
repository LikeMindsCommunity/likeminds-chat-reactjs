import { useCallback, useContext, useMemo } from "react";
import { ZeroArgVoidReturns } from "./useInput";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import UserProviderContext from "../context/LMUserProviderContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomActions } from "../customActions";
// import {
//   PARTICIPANTS_PATH,
//   ROOT_PATH,
// } from "../shared/constants/lm.routes.constant";
import { ChatroomAction } from "../enums/lm-chatroom-actions";
import { ChatroomMenuCustomActions } from "../types/prop-types/CustomComponents";

function useChatroomMenuOptions(
  chatroomMenuCustomActions?: ChatroomMenuCustomActions,
): UseChatroomMenuOptions {
  const { lmChatclient, routes } = useContext(GlobalClientProviderContext);
  const { chatroom, setNewChatroom } = useContext(LMChatChatroomContext);
  const { currentUser, currentCommunity, memberState, logoutUser } =
    useContext(UserProviderContext);
  const {
    onMuteCustom,
    onViewParticipantsCustom,
    onBlockCustom,
    onLeaveChatroomCustom,
    onUnBlockCustom,
  } = chatroomMenuCustomActions || {};
  const navigate = useNavigate();
  const location = useLocation();
  const onMute = useCallback(async () => {
    try {
      const call = await lmChatclient?.muteChatroom({
        chatroomId: parseInt(chatroom!.chatroom!.id!.toString()),
        value: chatroom?.chatroom_actions.some((option) => option.id === 6)
          ? true
          : false,
      });
      if (call.success && chatroom) {
        const newChatroom = { ...chatroom };

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
        setNewChatroom(newChatroom);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroom, lmChatclient, setNewChatroom]);
  const onLeaveChatroom = useCallback(async () => {
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
        navigate(`${routes?.getRootPath()}`);
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroom, currentUser, lmChatclient, navigate, routes, setNewChatroom]);
  const onViewParticipants = useCallback(async () => {
    try {
      //
      navigate(`/${routes?.getParticipantsPath()}/${chatroom?.chatroom.id}`);
    } catch (error) {
      console.log(error);
    }
  }, [chatroom, navigate, routes]);
  const onUnBlock = useCallback(async () => {
    try {
      const unblockCall = await lmChatclient?.blockMember({
        status: 1,
        chatroomId: chatroom?.chatroom.id || 0,
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: unblockCall.data.conversation,
        }),
      );
      if (unblockCall.success && chatroom) {
        const newChatroom = { ...chatroom };
        newChatroom.chatroom.chat_request_state = 1;
        if (
          newChatroom?.chatroom_actions?.some(
            (option) => option.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM,
          )
        ) {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_UNBLOCK_CHATROOM) {
                return { id: 27, title: "Block" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
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
  }, [chatroom, lmChatclient, setNewChatroom]);
  const onBlock = useCallback(async () => {
    try {
      const blockCall = await lmChatclient?.blockMember({
        status: 0,
        chatroomId: chatroom?.chatroom.id || 0,
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: blockCall.data.conversation,
        }),
      );
      if (blockCall.success && chatroom) {
        const newChatroom = { ...chatroom };
        newChatroom.chatroom.chat_request_state = 2;
        if (
          newChatroom?.chatroom_actions?.some(
            (option) => option.id === ChatroomAction.ACTION_BLOCK_CHATROOM,
          )
        ) {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
            (options) => {
              if (options.id === ChatroomAction.ACTION_BLOCK_CHATROOM) {
                return { id: 28, title: "Unblock" };
              } else {
                return options;
              }
            },
          );
        } else {
          newChatroom!.chatroom_actions = newChatroom.chatroom_actions?.map(
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
  }, [chatroom, lmChatclient, setNewChatroom]);
  const chatroomMenuDefaultActions = useMemo(() => {
    return {
      onLeaveChatroom,
      onMute,
      onViewParticipants,
      onBlock,
      onUnBlock,
    };
  }, [onBlock, onLeaveChatroom, onMute, onUnBlock, onViewParticipants]);
  const router = useMemo(() => {
    return {
      location: location,
      navigate: navigate,
    };
  }, [location, navigate]);
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
          router,
        )
      : onLeaveChatroom,
    onMute: onMuteCustom
      ? onMuteCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onMute,

    onViewParticipants: onViewParticipantsCustom
      ? onViewParticipantsCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onViewParticipants,
    onBlock: onBlockCustom
      ? onBlockCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onBlock,
    onUnBlock: onUnBlockCustom
      ? onUnBlockCustom.bind(
          null,
          chatroomMenuDefaultActions,
          applicationGeneralDataContext,
          router,
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
