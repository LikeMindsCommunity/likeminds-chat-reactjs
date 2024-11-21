/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LMMessageContext from "../context/LMMessageContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { CustomActions } from "../customActions";
import { Conversation } from "../types/models/conversations";
import { useLocation, useNavigate } from "react-router-dom";
// import { DM_CHANNEL_PATH } from "../shared/constants/lm.routes.constant";
import { LMMessageListCustomActionsContext } from "../context/LMMessageListCustomActionsContext";
import LMUserProviderContext from "../context/LMUserProviderContext";
import MessageListContext from "../context/LMMessageListContext";

export function useMessageOptions(): UseMessageOptionsReturn {
  const { lmChatclient, routes } = useContext(GlobalClientProviderContext);
  const { messageCustomActions = {} } = useContext(
    LMMessageListCustomActionsContext,
  );
  const {
    onReportCustom,
    onDeleteCustom,
    onSetTopicCustom,
    onEditCustom,
    onReplyCustom,
    putReactionCustom,
    onReplyPrivatelyCustom,
  } = messageCustomActions;
  const { currentCommunity, currentUser, logoutUser, memberState } = useContext(
    LMUserProviderContext,
  );

  const { setConversationToEdit, setConversationToReply } = useContext(
    LMChatChatroomContext,
  );
  const { message, deleteMessage, editMessageLocally } =
    useContext(LMMessageContext);

  const { chatroomTopic, setChatroomTopic, conversations } =
    useContext(MessageListContext);

  const navigate = useNavigate();
  const onReport = useCallback(
    async ({ id, reason }: { id: string | number; reason: string | null }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const reportCall = await lmChatclient?.pushReport({
          conversationId: parseInt(message!.id.toString()),
          tagId: parseInt(id.toString()),
          reason: reason ? reason : undefined,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatclient, message],
  );

  const onDelete = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deleteCall = await lmChatclient?.deleteConversation({
        conversationIds: [parseInt(message!.id.toString())],
        reason: "none",
      });
      if (chatroomTopic?.id.toString() === message.id.toString()) {
        setChatroomTopic(null);
      }
      deleteMessage();
    } catch (error) {
      console.log(error);
    }
  }, [
    chatroomTopic?.id,
    deleteMessage,
    lmChatclient,
    message,
    setChatroomTopic,
  ]);

  // Set Chatroom Topic
  const onSetTopic = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const setTopicCall = await lmChatclient?.setChatroomTopic({
        conversationId: parseInt(message!.id.toString()),
        chatroomId: parseInt(message?.cardId!.toString()),
      });
      const convo = conversations?.find(
        (convo) => convo.id.toString() === message.id.toString(),
      );
      if (convo) {
        setChatroomTopic(convo);
      }
    } catch (error) {
      console.log(error);
    }
  }, [conversations, lmChatclient, message, setChatroomTopic]);

  const onEdit = useCallback(async () => {
    try {
      setConversationToEdit(message);
    } catch (error) {
      console.log(error);
    }
  }, [message, setConversationToEdit]);

  const onReply = useCallback(async () => {
    try {
      setConversationToReply(message);
    } catch (error) {
      console.log(error);
    }
  }, [message, setConversationToReply]);

  const onReplyPrivately = useCallback(
    async (memberId: string | number) => {
      try {
        const checkDMLimitCall = await lmChatclient?.checkDMLimit({
          memberId: parseInt(memberId.toString()),
        });
        if (checkDMLimitCall.success) {
          const chatroomId = checkDMLimitCall.data.chatroomId;
          if (chatroomId) {
            // navigate to the chatroom
            navigate(`/${routes?.getDmChannelPath()}/${chatroomId}`);
            return;
          }
          const is_request_dm_limit_exceeded =
            checkDMLimitCall.data.is_request_dm_limit_exceeded;
          if (!is_request_dm_limit_exceeded) {
            const createDMChatroomCall = await lmChatclient?.createDMChatroom({
              memberId: parseInt(memberId.toString()),
            });
            if (createDMChatroomCall.success) {
              const newChatroomId = createDMChatroomCall.data.chatroom.id;
              navigate(`/${routes?.getDmChannelPath()}/${newChatroomId}`);
              // navigate to the chatroom
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatclient, navigate, routes],
  );

  const putReaction = useCallback(
    async (reaction: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const putReactionsCall = lmChatclient?.putReaction({
          conversationId: parseInt(message!.id.toString()),
          reaction: reaction,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatclient, message],
  );
  useEffect(() => {
    addEventListener(CustomActions.EDIT_ACTION_COMPLETED, (newEvent) => {
      const detail = (newEvent as CustomEvent).detail;
      editMessageLocally(detail as unknown as Conversation);
    });
  });
  const messageDefaultActions = useMemo(() => {
    return {
      onReport,
      onDelete,
      onEdit,
      onReply,
      putReaction,
      onReplyPrivately,
    };
  }, [onDelete, onEdit, onReply, onReplyPrivately, onReport, putReaction]);
  const location = useLocation();
  const router = useMemo(() => {
    return {
      location,
      navigate,
    };
  }, [location, navigate]);
  const applicationGeneralDataContext = useMemo(() => {
    return {
      currentCommunity,
      currentUser,
      logoutUser,
      memberState,
    };
  }, [currentCommunity, currentUser, logoutUser, memberState]);
  return {
    onReport: onReportCustom
      ? onReportCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onReport,
    onDelete: onDeleteCustom
      ? onDeleteCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onDelete,
    onSetTopic: onSetTopicCustom
      ? onSetTopicCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onSetTopic,
    onEdit: onEditCustom
      ? onEditCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onEdit,
    onReply: onReplyCustom
      ? onReplyCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onReply,
    putReaction: putReactionCustom
      ? putReactionCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : putReaction,
    onReplyPrivately: onReplyPrivatelyCustom
      ? onReplyPrivatelyCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
          router,
        )
      : onReplyPrivately,
  };
}
export interface UseMessageOptionsReturn {
  onReport: OneArgVoidReturns<{
    id: string | number;
    reason: string | null;
  }>;
  onDelete: ZeroArgVoidReturns;
  onSetTopic: ZeroArgVoidReturns;
  onEdit: ZeroArgVoidReturns;
  onReply: ZeroArgVoidReturns;
  putReaction: OneArgVoidReturns<string>;
  onReplyPrivately: OneArgVoidReturns<string | number>;
}

export interface MessageDefaultActions {
  onReport: OneArgVoidReturns<{
    id: string | number;
    reason: string | null;
  }>;
  onDelete: ZeroArgVoidReturns;
  // onSetTopic: ZeroArgVoidReturns;
  onEdit: ZeroArgVoidReturns;
  onReply: ZeroArgVoidReturns;
  putReaction: OneArgVoidReturns<string>;
  onReplyPrivately: OneArgVoidReturns<string | number>;
}
