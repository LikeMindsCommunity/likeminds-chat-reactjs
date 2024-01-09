import React, { useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import ChatroomProviderContext from "../context/ChatroomProviderContext";
import { CONVERSATIONS_PAGINATE_BY } from "../constants/Constants";
import LoaderContextProvider from "../context/LoaderContextProvider";
import useUserProvider from "./useUserProvider";
import Conversation from "../types/models/conversations";

interface ChannelProviderInterface {
  chatroom: unknown;
  setChatroom: React.Dispatch<unknown | null>;
  conversations: Conversation[] | null;
  setConversations: React.Dispatch<Conversation[] | null>;

  getNewConversations: unknown;
}

// interface UseChannelProviderParams {
//   client: LMClient;
// }

export default function useChannelProvider(): ChannelProviderInterface {
  const { chatroomId } = useContext(ChatroomProviderContext);
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { lmChatUser } = useUserProvider();
  const [chatroom, setChatroom] = useState<unknown>(null);
  const [conversations, setConversations] = useState<Conversation[] | null>([]);

  useEffect(() => {
    async function fetchChannel() {
      try {
        // get the chatroom details
        const newChatroom = await getChatroomDetails();
        setChatroom(newChatroom);

        // get the chatroom conversations
        const newConversations = await getChatroomConversations(
          undefined,
          false
        );
        setConversations(newConversations);

        // set the loader to false
        setLoader!(false);
      } catch (error) {
        // console.log the error
      }
    }
    fetchChannel();
    return () => {
      resetChannel();
    };
  }, [chatroomId, lmChatUser]);

  async function getChatroomDetails() {
    try {
      const chatroomDetailsCall = await lmChatclient?.getChatroom({
        chatroomId,
      });
      return chatroomDetailsCall.data.chatroom;
    } catch (error) {
      return logError(error);
    }
  }
  async function getChatroomConversations(
    conversationId: number | string | undefined,
    topNavigation: boolean | undefined
  ) {
    try {
      const chatroomConversationsCall = await lmChatclient?.getConversation({
        chatroomID: parseInt(chatroomId!.toString()),
        paginateBy: CONVERSATIONS_PAGINATE_BY,
        topNavigate: topNavigation,
        // conversationID: parseInt(conversationId?.toString()),
        include: false,
      });
      return chatroomConversationsCall.data.conversations;
    } catch (error) {
      return logError(error);
    }
  }

  function resetChannel() {
    setChatroom(null);
    setConversations(null);
  }

  function logError(error: unknown): null {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error("Error:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      // If it's not an Error instance, log a generic message
      console.error("An unknown error occurred:", error);
    }

    return null;
  }
  return {
    chatroom,
    setChatroom,
    conversations,
    setConversations,

    getNewConversations: getChatroomConversations,
  };
}
