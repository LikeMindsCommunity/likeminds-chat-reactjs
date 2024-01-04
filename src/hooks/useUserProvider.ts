import LMChatClient from "@likeminds.community/chat-js-beta";
import { useEffect, useState } from "react";

interface UserProviderInterface {
  lmChatUser: unknown;
  lmChatUserMemberState: unknown;
  logoutUser: () => void;
  lmChatUserCurrentCommunity: unknown;
}

interface UseUserProviderParams {
  lmChatClient: LMChatClient;
}

export default function useUserProvider({
  lmChatClient,
}: UseUserProviderParams): UserProviderInterface {
  const [lmChatUser, setLmChatUser] = useState<unknown>(null);
  const [lmChatUserMemberState, setLmChatUserMemberState] =
    useState<unknown>(null);
  const [lmChatUserCurrentCommunity, setLmChatUserCurrentCommunity] =
    useState<unknown>(null);
  useEffect(() => {
    async function setUser() {
      try {
        const initiateUserCall = await lmChatClient.initiateUser({
          userUniqueId: "1234r",
          userName: "testUser1",
          isGuest: false,
        });
        const memberStateCall = await lmChatClient.getMemberState();
        console.log(memberStateCall);
        setLmChatUser(initiateUserCall.data.user);
        setLmChatUserCurrentCommunity(initiateUserCall.data.community);
      } catch (error) {
        console.log(error);
      }
    }
    setUser();
  }, [lmChatClient]);
  function logoutUser() {
    setLmChatUser(null);
    setLmChatUserMemberState(null);
  }
  return {
    lmChatUser,
    lmChatUserMemberState,
    logoutUser,
    lmChatUserCurrentCommunity,
  };
}
