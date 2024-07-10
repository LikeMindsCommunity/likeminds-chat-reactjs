/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
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
interface Device {
  token: string;

  xDeviceId: string;

  xPlatformCode: string;
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
  const [deviceNotificationTrigger, setDeviceNotificationTrigger] =
    useState<boolean>(false);
  const currentBrowserId = useRef<string>("");
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

  useEffect(() => {
    async function notification() {
      try {
        if (deviceNotificationTrigger) {
          return;
        }
        const fingerprint = await getCurrentBrowserFingerPrint();
        currentBrowserId.current = fingerprint;
        const token = await generateToken();
        if (!token) {
          throw Error("Token not generated.");
        }
        const device: Device = {
          token: token,
          xDeviceId: currentBrowserId.current,
          xPlatformCode: "rt",
        };
        await client?.registerDevice(device);
        setDeviceNotificationTrigger(() => true);
      } catch (error) {
        console.log(error);
      }
    }
    if (!lmChatUser) {
      notification();
      return () => {
        setDeviceNotificationTrigger(() => false);
      };
    }
  }, [client, deviceNotificationTrigger, lmChatUser]);
  useEffect(() => {
    if (deviceNotificationTrigger) {
      return onMessage(messaging, (payload: any) => {
        console.log("Message received. ", payload);
        toast(payload?.notification?.body);
      });
    }
  }, [deviceNotificationTrigger]);
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
