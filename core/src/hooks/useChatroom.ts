/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import LoaderContextProvider from "../context/LMLoaderContextProvider";
import { Conversation } from "../types/models/conversations";
import {
  ChatroomDetails,
  GetChatroomResponse,
} from "../types/api-responses/getChatroomResponse";
import { ReplyDmQueries } from "../enums/lm-reply-dm-queries";
import { CustomActions } from "../customActions";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";

interface UseChatroom {
  chatroomDetails: ChatroomDetails | null;
  setChatroom: React.Dispatch<ChatroomDetails | null>;
  conversationToReply: Conversation | null;
  conversationToedit: Conversation | null;
  setConversationToReply: React.Dispatch<Conversation | null>;
  setConversationToEdit: React.Dispatch<Conversation | null>;
  canUserReplyPrivately: ReplyDmQueries;
  searchedConversationId: number | null;
  setSearchedConversationId: React.Dispatch<number | null>;
}

export interface ChatroomDefaultActions {
  setChatroom: React.Dispatch<ChatroomDetails | null>;
  setConversationToReply: React.Dispatch<Conversation | null>;
  setConversationToEdit: React.Dispatch<Conversation | null>;
  setSearchedConversationId: React.Dispatch<number | null>;
}

export interface ChatroomDataStore {
  chatroomDetails: ChatroomDetails | null;
  conversationToReply: Conversation | null;
  conversationToedit: Conversation | null;
  canUserReplyPrivately: ReplyDmQueries;
  searchedConversationId: number | null;
}

export default function useChatroom(chatroomId: string): UseChatroom {
  const { chatroomCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const {
    setChatroomCustomCallback,
    setConversationToEditCustomCallback,
    setConversationToReplyCustomCallback,
    setSearchedConversationIdCustomCallback,
  } = chatroomCustomActions;
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { setLoader } = useContext(LoaderContextProvider);
  const [chatroomDetails, setChatroomDetails] =
    useState<ChatroomDetails | null>(null);
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

  const getChatroomDetails = useCallback(
    async (chatroomId: string) => {
      try {
        const chatroomDetailsCall: GetChatroomResponse =
          await lmChatclient?.getChatroom({
            chatroomId,
          });
        return chatroomDetailsCall.data;
      } catch (error) {
        return logError(error);
      }
    },
    [lmChatclient],
  );
  const fetchChannel = useCallback(
    async (chatroomId: string) => {
      try {
        // get the chatroom details
        if (!chatroomId) return;
        const newChatroom = await getChatroomDetails(chatroomId);
        if (newChatroom) {
          setChatroomDetails(newChatroom as ChatroomDetails);
        }
        // set the loader to false
        if (setLoader) {
          setLoader(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [getChatroomDetails, setLoader],
  );

  useEffect(() => {
    fetchChannel(chatroomId);
    return () => {
      resetChatroom();
    };
  }, [chatroomId, fetchChannel]);

  useEffect(() => {
    const handleNewChatroomSelected = (eventObject: Event) => {
      const chatroomId = (eventObject as CustomEvent).detail.chatroomId;
      fetchChannel(chatroomId);
    };

    document.addEventListener(
      CustomActions.NEW_CHATROOM_SELECTED,
      handleNewChatroomSelected,
    );

    return () => {
      document.removeEventListener(
        CustomActions.NEW_CHATROOM_SELECTED,
        handleNewChatroomSelected,
      );
    };
  });

  useEffect(() => {
    checkDMStatus();
  }, [checkDMStatus]);
  function resetChatroom() {
    setChatroomDetails(null);
  }
  const chatroomDefaultActions: ChatroomDefaultActions = {
    setChatroom: setChatroomDetails,
    setConversationToReply: setConversationToReply,
    setConversationToEdit: setConversationToEdit,
    setSearchedConversationId: setSearchedConversationId,
  };
  const chatroomDataStore: ChatroomDataStore = {
    chatroomDetails: chatroomDetails,
    conversationToReply: conversationToReply,
    conversationToedit: conversationToedit,
    canUserReplyPrivately: canUserReplyPrivately,
    searchedConversationId: searchedConversationId,
  };

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
    chatroomDetails: chatroomDetails,
    setChatroom: setChatroomCustomCallback
      ? setChatroomCustomCallback.bind(
          null,
          chatroomDefaultActions,
          chatroomDataStore,
        )
      : setChatroomDetails,
    conversationToedit,
    conversationToReply,
    setConversationToEdit: setConversationToEditCustomCallback
      ? setConversationToEditCustomCallback.bind(
          null,
          chatroomDefaultActions,
          chatroomDataStore,
        )
      : setConversationToEdit,
    setConversationToReply: setConversationToReplyCustomCallback
      ? setConversationToReplyCustomCallback.bind(
          null,
          chatroomDefaultActions,
          chatroomDataStore,
        )
      : setConversationToReply,
    canUserReplyPrivately,
    searchedConversationId,
    setSearchedConversationId: setSearchedConversationIdCustomCallback
      ? setSearchedConversationIdCustomCallback.bind(
          null,
          chatroomDefaultActions,
          chatroomDataStore,
        )
      : setSearchedConversationId,
  };
}
export type UnknownReturnFunction = (...props: unknown[]) => unknown;
export type UnknownGetConversationFunction = any;
