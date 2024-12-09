import { useContext, useRef, useState } from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";

import { LMChatroomContext } from "../context/LMChatChatroomContext";
import { ZeroArgVoidReturns } from "./useInput";
import { ViewParticipantsResponse } from "../types/api-responses/viewParticipants";
import Member from "../types/models/member";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";

export function useExploreFeed(): useExploreFeed {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { chatroomDetails } = useContext(LMChatroomContext);
  const { exploreFeedCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const { getMembersCustomCallback } = exploreFeedCustomActions;
  const [participantsList, setParticipantList] = useState<Member[]>([]);
  const participantListPageCount = useRef<number>(1);
  const [loadMoreParticipants, setLoadMoreParticipants] =
    useState<boolean>(true);
  const getMembers = async () => {
    try {
      const getMembersCall: ViewParticipantsResponse =
        await lmChatClient.viewParticipants({
          chatroomId: chatroomDetails?.chatroom.id || 0,
          isSecret: chatroomDetails?.chatroom.isSecret || false,
          page: participantListPageCount.current,
        });
      if (getMembersCall.success) {
        if (getMembersCall?.data.participants.length) {
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
  const exploreFeedDefaultActions: ExploreFeedDefaultActions = {
    getMembers,
  };
  const exploreFeedDataStore: ExploreFeedDataStore = {
    participantsList,
    loadMoreParticipants,
  };

  return {
    participantsList,
    loadMoreParticipants,
    getMembers: getMembersCustomCallback
      ? getMembersCustomCallback.bind(
          null,
          exploreFeedDefaultActions,
          exploreFeedDataStore,
        )
      : getMembers,
  };
}

export interface useExploreFeed {
  participantsList: Member[];
  loadMoreParticipants: boolean;
  getMembers: ZeroArgVoidReturns;
}

export interface ExploreFeedDefaultActions {
  getMembers: ZeroArgVoidReturns;
}

export interface ExploreFeedDataStore {
  participantsList: Member[];
  loadMoreParticipants: boolean;
}
