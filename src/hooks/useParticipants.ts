import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";

import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { ZeroArgVoidReturns } from "./useInput";
import {
  Participant,
  ViewParticipantsResponse,
} from "../types/api-responses/viewParticipants";
import { useNavigate, useParams } from "react-router-dom";

export function useParticipants(): UseParticipantsReturns {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  const [participantsList, setParticipantList] = useState<Participant[]>([]);
  const participantListPageCount = useRef<number>(1);
  const [loadMoreParticipants, setLoadMoreParticipants] =
    useState<boolean>(true);
  const { id: chatroomId } = useParams();
  const navigate = useNavigate();
  const navigateBackToChatroom = useCallback(() => {
    navigate(`/chat/${chatroomId}`);
  }, [chatroomId, navigate]);
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
