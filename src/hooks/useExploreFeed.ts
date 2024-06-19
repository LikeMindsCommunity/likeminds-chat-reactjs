import { useContext, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";

import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { ZeroArgVoidReturns } from "./useInput";
import {
  Participant,
  ViewParticipantsResponse,
} from "../types/api-responses/viewParticipants";

export function useExploreFeed(): UseParticipantsReturns {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  const [participantsList, setParticipantList] = useState<Participant[]>([]);
  const participantListPageCount = useRef<number>(1);
  const [loadMoreParticipants, setLoadMoreParticipants] =
    useState<boolean>(true);
  const getMembers = async () => {
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
  };

  return {
    participantsList,
    loadMoreParticipants,
    getMembers,
  };
}

export interface UseParticipantsReturns {
  participantsList: Participant[];
  loadMoreParticipants: boolean;
  getMembers: ZeroArgVoidReturns;
}
