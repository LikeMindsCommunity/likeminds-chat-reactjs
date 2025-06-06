/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LMMessageContext from "../context/LMMessageContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { LMChatroomContext } from "../context/LMChatChatroomContext";
import { CustomActions } from "../customActions";
import { Conversation } from "../types/models/conversations";
import { LMMessageListCustomActionsContext } from "../context/LMMessageListCustomActionsContext";
import LMUserProviderContext from "../context/LMUserProviderContext";
import MessageListContext from "../context/LMMessageListContext";

export function useMessageOptions(): UseMessageOptionsReturn {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
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

  const { setConversationToEdit, setConversationToReply } =
    useContext(LMChatroomContext);
  const { message, deleteMessage, editMessageLocally } =
    useContext(LMMessageContext);

  const { chatroomTopic, setChatroomTopic, conversations } =
    useContext(MessageListContext);

  const onReport = useCallback(
    async ({ id, reason }: { id: string | number; reason: string | null }) => {
      try {
        await lmChatClient.pushReport({
          conversationId: parseInt(message!.id.toString()),
          tagId: parseInt(id.toString()),
          reason: reason ? reason : undefined,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatClient, message],
  );

  const onDelete = useCallback(async () => {
    try {
      await lmChatClient.deleteConversation({
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
    lmChatClient,
    message,
    setChatroomTopic,
  ]);

  // Set Chatroom Topic
  const onSetTopic = useCallback(async () => {
    try {
      await lmChatClient.setChatroomTopic({
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
  }, [conversations, lmChatClient, message, setChatroomTopic]);

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
        const checkDMLimitCall = await lmChatClient.checkDMLimitWithUuid({
          uuid: memberId,
        });
        if (checkDMLimitCall.success) {
          const chatroomId = checkDMLimitCall.data.chatroomId;
          if (chatroomId) {
            const NEW_CHATROOM_SELECTED = new CustomEvent(
              CustomActions.NEW_CHATROOM_SELECTED,
              {
                detail: {
                  chatroomId: chatroomId,
                },
              },
            );
            document.dispatchEvent(NEW_CHATROOM_SELECTED);
            return;
          }
          const isRequestDmLimitExceeded =
            checkDMLimitCall?.data.isRequestDmLimitExceeded;
          if (!isRequestDmLimitExceeded) {
            const createDMChatroomCall =
              await lmChatClient.createDMChatroomWithUuid({
                uuid: memberId,
              });
            if (createDMChatroomCall.success) {
              const newChatroomId = createDMChatroomCall?.data.chatroom.id;

              const NEW_CHATROOM_SELECTED = new CustomEvent(
                CustomActions.NEW_CHATROOM_SELECTED,
                {
                  detail: {
                    chatroomId: newChatroomId,
                  },
                },
              );
              document.dispatchEvent(NEW_CHATROOM_SELECTED);
              return;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatClient],
  );

  const putReaction = useCallback(
    async (reaction: string) => {
      try {
        lmChatClient.putReaction({
          conversationId: parseInt(message!.id.toString()),
          reaction: reaction,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatClient, message],
  );

  useEffect(() => {
    const handleEditComplete = (newEvent: Event) => {
      const detail = (newEvent as CustomEvent).detail;
      editMessageLocally(detail as unknown as Conversation);
    };

    document.addEventListener(
      CustomActions.EDIT_ACTION_COMPLETED,
      handleEditComplete,
    );

    return () => {
      document.removeEventListener(
        CustomActions.EDIT_ACTION_COMPLETED,
        handleEditComplete,
      );
    };
  }, [editMessageLocally]);
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
        )
      : onReport,
    onDelete: onDeleteCustom
      ? onDeleteCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
        )
      : onDelete,
    onSetTopic: onSetTopicCustom
      ? onSetTopicCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
        )
      : onSetTopic,
    onEdit: onEditCustom
      ? onEditCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
        )
      : onEdit,
    onReply: onReplyCustom
      ? onReplyCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
        )
      : onReply,
    putReaction: putReactionCustom
      ? putReactionCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
        )
      : putReaction,
    onReplyPrivately: onReplyPrivatelyCustom
      ? onReplyPrivatelyCustom.bind(
          null,
          messageDefaultActions,
          applicationGeneralDataContext,
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
  onEdit: ZeroArgVoidReturns;
  onReply: ZeroArgVoidReturns;
  putReaction: OneArgVoidReturns<string>;
  onReplyPrivately: OneArgVoidReturns<string | number>;
}
