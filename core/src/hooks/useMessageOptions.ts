/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LMMessageContext from "../context/LMMessageContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { CustomActions } from "../customActions";
import Conversation from "../types/models/conversations";
import { useNavigate } from "react-router-dom";
import { DM_CHANNEL_PATH } from "../shared/constants/lm.routes.constant";

export function useMessageOptions(): UseMessageOptionsReturn {
  const { lmChatclient } = useContext(GlobalClientProviderContext);

  const { setConversationToEdit, setConversationToReply } = useContext(
    LMChatChatroomContext,
  );
  const { message, deleteMessage, editMessageLocally } =
    useContext(LMMessageContext);

  const navigate = useNavigate();
  const onReport = async ({
    id,
    reason,
  }: {
    id: string | number;
    reason: string | null;
  }) => {
    try {
      // TODO handle this
      const reportCall = await lmChatclient?.pushReport({
        conversationId: parseInt(message!.id.toString()),
        tagId: parseInt(id.toString()),
        reason: reason ? reason : undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onDelete = async () => {
    try {
      const deleteCall = await lmChatclient?.deleteConversation({
        conversationIds: [parseInt(message!.id.toString())],
        reason: "none",
      });

      deleteMessage();
    } catch (error) {
      console.log(error);
    }
  };
  const onEdit = async () => {
    try {
      setConversationToEdit(message);
    } catch (error) {
      console.log(error);
    }
  };
  const onReply = async () => {
    try {
      setConversationToReply(message);
    } catch (error) {
      console.log(error);
    }
  };
  const onReplyPrivately = async (memberId: string | number) => {
    try {
      const checkDMLimitCall = await lmChatclient?.checkDMLimit({
        memberId: parseInt(memberId.toString()),
      });
      if (checkDMLimitCall.success) {
        const chatroomId = checkDMLimitCall.data.chatroom_id;
        if (chatroomId) {
          // navigate to the chatroom
          navigate(`/${DM_CHANNEL_PATH}/${chatroomId}`);
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
            navigate(`/${DM_CHANNEL_PATH}/${newChatroomId}`);
            // navigate to the chatroom
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const putReaction = async (reaction: string) => {
    try {
      const putReactionsCall = lmChatclient?.putReaction({
        conversationId: parseInt(message!.id.toString()),
        reaction: reaction,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    addEventListener(CustomActions.EDIT_ACTION_COMPLETED, (newEvent) => {
      const detail = (newEvent as CustomEvent).detail;
      editMessageLocally(detail as unknown as Conversation);
    });
  });
  return {
    onReport,
    onDelete,
    onEdit,
    onReply,
    putReaction,
    onReplyPrivately,
  };
}
export interface UseMessageOptionsReturn {
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
