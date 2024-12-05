import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { ZeroArgVoidReturns } from "./useInput";
import { ViewParticipantsResponse } from "../types/api-responses/viewParticipants";

import Member from "../types/models/member";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";
import {
  ChatroomDetails,
  GetChatroomResponse,
} from "../types/api-responses/getChatroomResponse";

/**
 * Custom hook that provides functionality related to participants/members of a chatroom.
 * @returns {UseParticipantsReturns} An object containing the participants list, a flag indicating whether there are more participants to load, a function to fetch the members/participants of a chatroom, and a function to navigate back to the chatroom.
 */
export function useParticipants(chatroomId: number): UseParticipantsReturns {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { participantsCustomActions = {} } = useContext(
    CustomisationContextProvider,
  );
  const {
    getMembersCustomCallback,
    navigateBackToChatroomCustomCallback,
    setSearchKeywordCustomCallback,
  } = participantsCustomActions;

  const [chatroomDetails, setChatroomDetails] =
    useState<ChatroomDetails | null>(null);
  const [participantsList, setParticipantList] = useState<Member[]>([]);
  const participantListPageCount = useRef<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const totalParticipantsCount = useRef<number>(0);
  const [loadMoreParticipants, setLoadMoreParticipants] =
    useState<boolean>(true);

  /**
   * Navigates back to the chatroom.
   */
  const navigateBackToChatroom = useCallback(() => {
    window.history.back();
  }, []);

  /**
   * Fetches the details of a chatroom using the provided chatroom ID.
   *
   * @param {number} chatroomId - The unique identifier of the chatroom to fetch details for.
   * @returns {Promise<GetChatroomResponse>} A promise that resolves to the chatroom details or logs an error if the call fails.
   */
  const getChatroomDetails = useCallback(
    async (chatroomId: number) => {
      try {
        const chatroomDetailsCall: GetChatroomResponse =
          await lmChatClient.getChatroom({
            chatroomId,
          });
        return chatroomDetailsCall?.data;
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatClient],
  );

  /**
   * Fetches the members/participants of a chatroom.
   * @returns {Promise<void>} A promise that resolves when the members/participants are fetched.
   */
  const getMembers = useCallback(async () => {
    try {
      const getMembersCall: ViewParticipantsResponse =
        await lmChatClient.viewParticipants({
          chatroomId: chatroomDetails?.chatroom.id || 0,
          isSecret: chatroomDetails?.chatroom.isSecret || false,
          page: participantListPageCount.current,
          participantName: searchKeyword,
          pageSize: 100,
        });
      if (getMembersCall.success) {
        if (getMembersCall?.data.participants.length) {
          if (participantListPageCount.current === 1) {
            totalParticipantsCount.current =
              getMembersCall?.data.totalParticipantsCount || 0;
          }
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
  }, [
    chatroomDetails?.chatroom.id,
    chatroomDetails?.chatroom.isSecret,
    lmChatClient,
    searchKeyword,
  ]);

  useEffect(() => {
    async function getChatroom() {
      if (chatroomId) {
        const newChatroom = await getChatroomDetails(chatroomId);
        if (newChatroom) {
          setChatroomDetails(newChatroom as ChatroomDetails);
        }
      }
    }

    getChatroom();

    return () => {
      participantListPageCount.current = 1;
      setParticipantList([]);
      setLoadMoreParticipants(true);
    };
  }, [chatroomId, getChatroomDetails]);

  useEffect(() => {
    const debouncedTimeout = setTimeout(() => {
      getMembers();
    }, 500);
    return () => {
      clearTimeout(debouncedTimeout);
      participantListPageCount.current = 1;
      setParticipantList([]);
      setLoadMoreParticipants(true);
    };
  }, [getMembers]);

  const participantsListDefaultActions: ParticipantsDefaultActions = {
    getMembers,
    navigateBackToChatroom,
    setSearchKeyword,
  };
  const participantsListDataStore: ParticipantsDataStore = {
    participantsList,
    searchKeyword,
    totalParticipantCount: totalParticipantsCount.current,
  };

  return {
    participantsList,
    loadMoreParticipants,
    getMembers: getMembersCustomCallback
      ? getMembersCustomCallback.bind(
          null,
          participantsListDefaultActions,
          participantsListDataStore,
        )
      : getMembers,
    navigateBackToChatroom: navigateBackToChatroomCustomCallback
      ? navigateBackToChatroomCustomCallback.bind(
          null,
          participantsListDefaultActions,
          participantsListDataStore,
        )
      : navigateBackToChatroom,
    searchKeyword,
    setSearchKeyword: setSearchKeywordCustomCallback
      ? setSearchKeywordCustomCallback.bind(
          null,
          participantsListDefaultActions,
          participantsListDataStore,
        )
      : setSearchKeyword,
    totalParticipantCount: totalParticipantsCount.current,
  };
}

export interface UseParticipantsReturns {
  participantsList: Member[];
  loadMoreParticipants: boolean;
  getMembers: ZeroArgVoidReturns;
  navigateBackToChatroom: ZeroArgVoidReturns;
  searchKeyword: string;
  setSearchKeyword: Dispatch<string>;
  totalParticipantCount: number;
}

export interface ParticipantsDefaultActions {
  getMembers: ZeroArgVoidReturns;
  navigateBackToChatroom: ZeroArgVoidReturns;
  setSearchKeyword: Dispatch<string>;
}

export interface ParticipantsDataStore {
  participantsList: Member[];
  searchKeyword: string;
  totalParticipantCount: number;
}
