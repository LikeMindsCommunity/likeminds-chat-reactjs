import { useContext, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";

import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { ZeroArgVoidReturns } from "./useInput";
import { ViewParticipantsResponse } from "../types/api-responses/viewParticipants";
import Member from "../types/models/member";

export function useExploreFeed(): UseParticipantsReturns {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom } = useContext(LMChatChatroomContext);
  const [participantsList, setParticipantList] = useState<Member[]>([]);
  const participantListPageCount = useRef<number>(1);
  const [loadMoreParticipants, setLoadMoreParticipants] =
    useState<boolean>(true);
  const getMembers = async () => {
    try {
      const getMembersCall: ViewParticipantsResponse =
        await lmChatclient?.viewParticipants({
          chatroomId: chatroom?.chatroom.id || 0,
          isSecret: chatroom?.chatroom.isSecret || false,
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
  participantsList: Member[];
  loadMoreParticipants: boolean;
  getMembers: ZeroArgVoidReturns;
}
