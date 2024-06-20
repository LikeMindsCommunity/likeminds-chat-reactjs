/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import LoaderContextProvider from "../context/LoaderContextProvider";
import Conversation from "../types/models/conversations";
import {
  ChatroomCollabcard,
  GetChatroomResponse,
} from "../types/api-responses/getChatroomResponse";
import UserProviderContext from "../context/UserProviderContext";
import { useParams } from "react-router-dom";

interface UseChatroom {
  chatroom: ChatroomCollabcard | null;
  setChatroom: React.Dispatch<ChatroomCollabcard | null>;
  conversationToReply: Conversation | null;
  conversationToedit: Conversation | null;
  setConversationToReply: React.Dispatch<Conversation | null>;
  setConversationToEdit: React.Dispatch<Conversation | null>;
}

export default function useChatroom(): UseChatroom {
  // const { chatroomId } = useContext(ChatroomProviderContext);
  const { id: chatroomId } = useParams();
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const { currentUser } = useContext(UserProviderContext);
  const [chatroom, setChatroom] = useState<ChatroomCollabcard | null>(null);
  const [conversationToReply, setConversationToReply] =
    useState<Conversation | null>(null);
  const [conversationToedit, setConversationToEdit] =
    useState<Conversation | null>(null);

  const getChatroomDetails = useCallback(async () => {
    try {
      const chatroomDetailsCall: GetChatroomResponse =
        await lmChatclient?.getChatroom({
          chatroomId,
        });
      return chatroomDetailsCall.data;
    } catch (error) {
      return logError(error);
    }
  }, [lmChatclient]);

  useEffect(() => {
    async function fetchChannel() {
      try {
        // get the chatroom details
        const newChatroom = await getChatroomDetails();
        setChatroom(newChatroom);

        // set the loader to false
        setLoader!(false);
      } catch (error) {
        // console.log the error
      }
    }
    fetchChannel();
    return () => {
      resetChatroom();
    };
  }, [chatroomId, getChatroomDetails, currentUser, setLoader]);

  function resetChatroom() {
    setChatroom(null);
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
    conversationToedit,
    conversationToReply,
    setConversationToEdit,
    setConversationToReply,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
