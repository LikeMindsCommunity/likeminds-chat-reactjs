/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LoaderContextProvider from "../context/LMLoaderContextProvider";
import Conversation from "../types/models/conversations";
import {
  ChatroomCollabcard,
  GetChatroomResponse,
} from "../types/api-responses/getChatroomResponse";
import UserProviderContext from "../context/LMUserProviderContext";
import { useParams } from "react-router-dom";
import { ReplyDmQueries } from "../enums/lm-reply-dm-queries";

interface UseChatroom {
  chatroom: ChatroomCollabcard | null;
  setChatroom: React.Dispatch<ChatroomCollabcard | null>;
  conversationToReply: Conversation | null;
  conversationToedit: Conversation | null;
  setConversationToReply: React.Dispatch<Conversation | null>;
  setConversationToEdit: React.Dispatch<Conversation | null>;
  canUserReplyPrivately: ReplyDmQueries;
  searchedConversationId: number | null;
  setSearchedConversationId: React.Dispatch<number | null>;
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
  const [canUserReplyPrivately, setCanUserReplyPrivately] =
    useState<ReplyDmQueries>(ReplyDmQueries.REPLY_PRIVATELY_NOT_ALLOWED);
  const [searchedConversationId, setSearchedConversationId] = useState<
    number | null
  >(null);
  const checkDMStatus = useCallback(async () => {
    try {
      const checkDMStatusCall = await lmChatclient?.checkDMStatus({
        requestFrom: ReplyDmQueries.GROUP_CHANNEL,
      });
      if (checkDMStatusCall.success) {
        const showDM = checkDMStatusCall.data.show_dm;
        if (!showDM) {
          setCanUserReplyPrivately(ReplyDmQueries.REPLY_PRIVATELY_NOT_ALLOWED);
        } else {
          const cta = checkDMStatusCall.data.cta;
          const showList = new URL(cta).searchParams
            .get("show_list")
            ?.toString();
          switch (showList) {
            case ReplyDmQueries.REPLY_PRIVATELY_ALLOWED_TO_ALL_MEMBERS: {
              setCanUserReplyPrivately(
                ReplyDmQueries.REPLY_PRIVATELY_ALLOWED_TO_ALL_MEMBERS,
              );
              break;
            }
            case ReplyDmQueries.REPLY_PRIVATELY_ALLOWED_TO_COMMUNITY_MANAGERS: {
              setCanUserReplyPrivately(
                ReplyDmQueries.REPLY_PRIVATELY_ALLOWED_TO_COMMUNITY_MANAGERS,
              );
              break;
            }
          }
        }
      }
    } catch (error) {
      setCanUserReplyPrivately(ReplyDmQueries.REPLY_PRIVATELY_NOT_ALLOWED);
      console.log(error);
    }
  }, [lmChatclient]);

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
  }, [chatroomId, lmChatclient]);

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
  useEffect(() => {
    checkDMStatus();
  }, [checkDMStatus]);
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
    canUserReplyPrivately,
    searchedConversationId,
    setSearchedConversationId,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
