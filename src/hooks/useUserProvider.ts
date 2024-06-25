import { useEffect, useState } from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import Member from "../types/models/member";

interface UserProviderInterface {
  lmChatUser: null | Member;
  lmChatUserMemberState: unknown;
  logoutUser: () => void;
  lmChatUserCurrentCommunity: unknown;
}

// interface UseUserProviderParams {
//   lmChatclient: LMClient;
// }

export default function useUserProvider(
  client: LMClient | null,
): UserProviderInterface {
  const lmChatclient = client;
  const [lmChatUser, setLmChatUser] = useState<null | Member>(null);
  const [lmChatUserMemberState, setLmChatUserMemberState] =
    useState<unknown>(null);
  const [lmChatUserCurrentCommunity, setLmChatUserCurrentCommunity] =
    useState<unknown>(null);
  useEffect(() => {
    if (!lmChatclient) {
      return;
    }
    async function setUser() {
      try {
        const initiateUserCall = await lmChatclient?.initiateUser({
          userUniqueId: "317326b1-7241-402d-840c-2fb156b24b8f",
          userName: "ishaan",
          isGuest: false,
        });
        const memberStateCall = await lmChatclient?.getMemberState();
        // console.log(memberStateCall);
        setLmChatUser(initiateUserCall.data.user);
        setLmChatUserCurrentCommunity(initiateUserCall.data.community);
      } catch (error) {
        console.log(error);
      }
    }
    setUser();
  }, [lmChatclient]);
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
