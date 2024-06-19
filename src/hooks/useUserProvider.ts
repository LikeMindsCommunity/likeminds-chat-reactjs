import { useContext, useEffect, useState } from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";

interface UserProviderInterface {
  lmChatUser: unknown;
  lmChatUserMemberState: unknown;
  logoutUser: () => void;
  lmChatUserCurrentCommunity: unknown;
}

// interface UseUserProviderParams {
//   lmChatclient: LMClient;
// }

export default function useUserProvider(): UserProviderInterface {
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const [lmChatUser, setLmChatUser] = useState<null | LMClient>(null);
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
          userUniqueId: "6599d0a5-1fa6-4d40-8953-26cce1aad22d",
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
