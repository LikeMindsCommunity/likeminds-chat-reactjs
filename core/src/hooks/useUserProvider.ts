import { useEffect, useState } from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import Member from "../types/models/member";
import { UserDetails } from "../context/GlobalClientProviderContext";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { onMessage } from "firebase/messaging";
import { generateToken, messaging } from "../notifications/firebase";
import toast, { Toaster } from "react-hot-toast";

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

  const [currentBrowserId, setCurrentBrowserId] = useState("");

  const device = {
    token:
      "cAEsVZ0VuGIQEIobeSVCFz:APA91bGoweEW1ddBkGHzoH_DJ6dKwxBe-IqkG7zqTPgShAxHNGLXrLuAwikFo4tDxmcufll7_B7EIidxQ2uRz87dexSJhvKvOVK6_ada87yGFE4vA64FuqgAL5X9hH8U2cS1QQj_GQQM",
    xDeviceId: currentBrowserId,
    xPlatformCode: "rt",
  };

  useEffect(() => {
    if (!lmChatUser) return;

    getCurrentBrowserFingerPrint().then((fingerprint) => {
      setCurrentBrowserId(fingerprint);
    });

    const registerDevice = client?.registerDevice(device);
    console.log(registerDevice);
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      toast(payload?.notification?.body);
    });
  }, [lmChatUser]);

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
