/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import LMMessageContext from "../context/MessageContext";
import { OneArgVoidReturns, ZeroArgVoidReturns } from "./useInput";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";

export function useMessageOptions(): UseMessageOptionsReturn {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setConversationToEdit } = useContext(LMChatChatroomContext);
  const { message } = useContext(LMMessageContext);
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
      console.log(reportCall);
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
      console.log(deleteCall);
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
  //   const getReportTags = async () => {
  //     try {
  //       const getReportTags = await lmChatclient?.getReportTags({
  //         type: 0,
  //       });
  //       console.log(getReportTags);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  const putReaction = async (reaction: string) => {
    try {
      const putReactionsCall = lmChatclient?.putReaction({
        conversationId: parseInt(message!.id.toString()),
        reaction: reaction,
      });
      console.log(putReactionsCall);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    onReport,
    onDelete,
    onEdit,
    putReaction,
  };
}
export interface UseMessageOptionsReturn {
  onReport: OneArgVoidReturns<{
    id: string | number;
    reason: string | null;
  }>;
  onDelete: ZeroArgVoidReturns;
  onEdit: ZeroArgVoidReturns;
  putReaction: OneArgVoidReturns<string>;
}
