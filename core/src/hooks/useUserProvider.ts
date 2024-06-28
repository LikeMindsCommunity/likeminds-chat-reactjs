import { useEffect, useState } from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import Member from "../types/models/member";
import { UserDetails } from "../context/GlobalClientProviderContext";

interface UserProviderInterface {
  lmChatUser: null | Member;
  lmChatUserMemberState: unknown;
  logoutUser: () => void;
  lmChatUserCurrentCommunity: unknown;
}

export default function useUserProvider(
  client: LMClient | null,
  userDetails: UserDetails,
): UserProviderInterface {
  const lmChatclient = client;
  const [lmChatUser, setLmChatUser] = useState<null | Member>(null);
  const [lmChatUserMemberState, setLmChatUserMemberState] =
    useState<unknown>(null);
  const [lmChatUserCurrentCommunity, setLmChatUserCurrentCommunity] =
    useState<unknown>(null);
  useEffect(() => {
    console.log(lmChatclient);
    if (!lmChatclient) {
      return;
    }
    async function setUser() {
      try {
        const initiateUserCall = await lmChatclient?.initiateUser({
          userUniqueId: userDetails.uuid,
          userName: userDetails.username,
          isGuest: userDetails.isGuest,
        });
        const memberStateCall = await lmChatclient?.getMemberState();
        console.log(memberStateCall);
        const user = {
          ...initiateUserCall.data.user,
          state: memberStateCall.data.state,
          memberRights: memberStateCall.data.member_rights,
        };
        setLmChatUser(user);
        setLmChatUserCurrentCommunity(initiateUserCall.data.community);
      } catch (error) {
        console.log(error);
      }
    }
    setUser();
  }, [
    lmChatclient,
    userDetails.isGuest,
    userDetails.username,
    userDetails.uuid,
  ]);
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
