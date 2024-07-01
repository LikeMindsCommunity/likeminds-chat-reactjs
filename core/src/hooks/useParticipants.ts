import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";

import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { ZeroArgVoidReturns } from "./useInput";
import {
  Participant,
  ViewParticipantsResponse,
} from "../types/api-responses/viewParticipants";
import { useNavigate, useParams } from "react-router-dom";
import { CHANNEL_PATH } from "../shared/constants/lm.routes.constant";

/**
 * Custom hook that provides functionality related to participants/members of a chatroom.
 * @returns {UseParticipantsReturns} An object containing the participants list, a flag indicating whether there are more participants to load, a function to fetch the members/participants of a chatroom, and a function to navigate back to the chatroom.
 */
export function useParticipants(): UseParticipantsReturns {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  const [participantsList, setParticipantList] = useState<Participant[]>([]);
  const participantListPageCount = useRef<number>(1);
  const [loadMoreParticipants, setLoadMoreParticipants] =
    useState<boolean>(true);
  const { id: chatroomId } = useParams();
  const navigate = useNavigate();
  /**
   * Navigates back to the chatroom.
   */
  const navigateBackToChatroom = useCallback(() => {
    navigate(`/${CHANNEL_PATH}/${chatroomId}`);
  }, [chatroomId, navigate]);
  /**
   * Fetches the members/participants of a chatroom.
   * @returns {Promise<void>} A promise that resolves when the members/participants are fetched.
   */
  const getMembers = useCallback(async () => {
    try {
      const getMembersCall: ViewParticipantsResponse =
        await lmChatclient?.viewParticipants({
          chatroomId: chatroom?.chatroom.id || 0,
          isSecret: chatroom?.chatroom.is_secret || false,
          page: participantListPageCount.current,
        });
      if (getMembersCall.success) {
        if (getMembersCall.data.participants.length) {
          participantListPageCount.current += 1;
          setParticipantList((currentParticipants) => {
            return [
              ...currentParticipants,
              ...getMembersCall.data.participants,
            ];
          });
        } else {
          setLoadMoreParticipants(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatroom?.chatroom.id, chatroom?.chatroom.is_secret, lmChatclient]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);
  return {
    participantsList,
    loadMoreParticipants,
    getMembers,
    navigateBackToChatroom,
  };
}

export interface UseParticipantsReturns {
  participantsList: Participant[];
  loadMoreParticipants: boolean;
  getMembers: ZeroArgVoidReturns;
  navigateBackToChatroom: ZeroArgVoidReturns;
}