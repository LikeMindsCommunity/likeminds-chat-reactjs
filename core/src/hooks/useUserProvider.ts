/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import Member from "../types/models/member";
import { UserDetails } from "../context/LMGlobalClientProviderContext";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { onMessage } from "firebase/messaging";
import { generateToken, messaging } from "../notifications/firebase";
import toast from "react-hot-toast";
import { CustomActions } from "../customActions";

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
    const { accessToken, refreshToken, username, uuid, isGuest, apiKey } =
      userDetails;

    if (!lmChatclient) {
      return;
    }
    function setTokensInLocalStorage(
      accessToken: string,
      refreshToken: string,
    ) {
      lmChatclient?.setAccessTokenInLocalStorage(accessToken);
      lmChatclient?.setRefreshTokenInLocalStorage(refreshToken);
    }
    async function validateChatUser(
      localAccessToken: string,
      localRefreshToken: string,
    ) {
      try {
        setTokensInLocalStorage(localAccessToken, localRefreshToken);
        const validateUserCall = await lmChatclient?.validateUser({
          accessToken: localAccessToken,
          refreshToken: localRefreshToken,
        });
        if (validateUserCall.success) {
          // Setting tokens in local storage
          setTokensInLocalStorage(localAccessToken, localRefreshToken);
          lmChatclient?.setUserInLocalStorage(
            JSON.stringify(validateUserCall.data?.user),
          );
        }
        const memberStateCall = await lmChatclient?.getMemberState();
        if (validateUserCall && memberStateCall?.success) {
          const user = {
            ...validateUserCall.data?.user,
          };
          user.state = memberStateCall.data.state;
          user.memberRights = memberStateCall.data.member_rights;
          setLmChatUser(user || null);
          setLmChatUserCurrentCommunity(
            validateUserCall?.data?.community || null,
          );
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    }

    async function initiateFeedUser(
      apiKey: string,
      uuid: string,
      username: string,
      isGuest: boolean,
    ) {
      try {
        // TODO Fix the initiateUser model
        if (!(apiKey && uuid && username)) {
          throw Error("Either API key or UUID or Username not provided");
        }

        const initiateUserCall = await lmChatclient?.initiateUser({
          userUniqueId: uuid,
          userName: username,
          isGuest: isGuest,
          apiKey: apiKey,
        });
        if (initiateUserCall.success) {
          // Setting the tokens, API key and User in local storage

          setTokensInLocalStorage(
            initiateUserCall.data?.access_token || "",
            initiateUserCall.data?.refresh_token || "",
          );
          lmChatclient?.setApiKeyInLocalStorage(apiKey);
          lmChatclient?.setUserInLocalStorage(
            JSON.stringify(initiateUserCall.data?.user),
          );
        }
        const memberStateCall = await lmChatclient?.getMemberState();
        if (initiateUserCall.success && memberStateCall.success) {
          const user = {
            ...initiateUserCall.data?.user,
          };
          user.state = memberStateCall.data.state;
          user.memberRights = memberStateCall.data.member_rights;
          setLmChatUser(user || null);
          setLmChatUserCurrentCommunity(
            initiateUserCall?.data?.community || null,
          );
          return {
            accessToken: initiateUserCall.data?.access_token,
            refreshToken: initiateUserCall.data?.refresh_token,
          };
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    // document.addEventListener(
    //   CustomActions.TRIGGER_SET_USER,
    //   (event) => {
    //     const { user, community } = (event as CustomEvent).detail;
    //     setLmFeedUser(user || null);
    //     setLmFeedUserCurrentCommunity(community || null);
    //   },
    // );

    // calling initiateuser and memberstate apis and setting the user details
    // TODO add a check for tokens

    async function setUser() {
      try {
        if (apiKey && username && uuid) {
          const localAccessToken =
            lmChatclient?.getAccessTokenFromLocalStorage();
          const localRefreshToken =
            lmChatclient?.getRefreshTokenFromLocalStorage();

          if (
            localAccessToken &&
            localRefreshToken &&
            localAccessToken.length &&
            localRefreshToken.length
          ) {
            await validateChatUser(localAccessToken, localRefreshToken);
          } else {
            await initiateFeedUser(apiKey, uuid, username, isGuest || false);
          }
        } else if (accessToken && refreshToken) {
          await validateChatUser(accessToken, refreshToken);
        } else {
          throw Error("Neither API key nor Tokens provided");
        }
      } catch (error) {
        console.log(error);
      }
    }

    document.addEventListener(
      CustomActions.TRIGGER_SET_USER,
      // setUser,
      () => {
        setUser();
      },
    );
    setUser();
    return () => {
      document.removeEventListener(CustomActions.TRIGGER_SET_USER, () => {
        setUser();
      });
    };
  }, [lmChatclient, userDetails]);

  //
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
