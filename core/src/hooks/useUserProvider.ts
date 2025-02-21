/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import Member from "../types/models/member";
import { UserDetails } from "../context/LMGlobalClientProviderContext";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { onMessage } from "firebase/messaging";
import { generateToken, messaging } from "../notifications/firebase";
import toast from "react-hot-toast";
import { CustomActions } from "../customActions";
import { Community } from "../types/models/Community";
import LMLoaderContextProvider from "../context/LMLoaderContextProvider";
import { LMChatCustomActions } from "../context/LMChatCustomisationContext";

interface UserProviderInterface {
  lmChatUser: null | Member;
  lmChatUserMemberState: number | null;
  logoutUser: () => void;
  lmChatUserCurrentCommunity: Community | null;
  userNotLoadedErrorState: boolean;
}
interface Device {
  token: string;

  xDeviceId: string;

  xPlatformCode: string;
}
export default function useUserProvider(
  client: LMClient,
  userDetails: UserDetails,
  customCallbacks: LMChatCustomActions
): UserProviderInterface {
  const lmChatClient = client;
  const { openSnackbar } = useContext(LMLoaderContextProvider)
  const { userProviderCustomActions } = customCallbacks
  const [lmChatUser, setLmChatUser] = useState<null | Member>(null);
  const [lmChatUserMemberState, setLmChatUserMemberState] = useState<
    number | null
  >(null);
  const [lmChatUserCurrentCommunity, setLmChatUserCurrentCommunity] =
    useState<Community | null>(null);
  const [deviceNotificationTrigger, setDeviceNotificationTrigger] =
    useState<boolean>(false);
  const [userNotLoadedErrorState, setUserNotLoadedErrorState] =
    useState<boolean>(false);
  const currentBrowserId = useRef<string>("");

  useEffect(() => {
    const { accessToken, refreshToken, username, uuid, isGuest, apiKey } =
      userDetails;

    if (!lmChatClient) {
      return;
    }
    function setTokensInLocalStorage(
      accessToken: string,
      refreshToken: string,
    ) {
      lmChatClient.setAccessTokenInLocalStorage(accessToken);
      lmChatClient.setRefreshTokenInLocalStorage(refreshToken);
    }
    async function validateChatUser(
      localAccessToken: string,
      localRefreshToken: string,
    ) {
      try {
        setTokensInLocalStorage(localAccessToken, localRefreshToken);
        const validateUserCall = await lmChatClient.validateUser({
          accessToken: localAccessToken,
          refreshToken: localRefreshToken,
        });
        if (validateUserCall?.success) {
          lmChatClient.setUserInLocalStorage(
            JSON.stringify(validateUserCall?.data?.user),
          );
        }
        const memberStateCall = await lmChatClient.getMemberState();
        if (validateUserCall && memberStateCall?.success) {
          const user: Member = {
            ...validateUserCall?.data?.user,
          };
          user.state = memberStateCall?.data.state;
          user.memberRights = memberStateCall?.data.memberRights;
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
        if (!(apiKey && username)) {
          throw Error("Either API key or UUID or Username not provided");
        }

        const initiateUserCall = await lmChatClient.initiateUser({
          userUniqueId: uuid,
          userName: username,
          isGuest: isGuest,
          apiKey: apiKey,
        });
        if (initiateUserCall.success) {
          // Setting the tokens, API key and User in local storage
          setTokensInLocalStorage(
            initiateUserCall?.data?.accessToken || "",
            initiateUserCall?.data?.refreshToken || "",
          );

        }
        const memberStateCall = await lmChatClient.getMemberState();
        if (initiateUserCall.success && memberStateCall.success) {
          const user: Member = {
            ...initiateUserCall?.data?.user,
          };
          user.state = memberStateCall?.data.state;
          user.memberRights = memberStateCall?.data.memberRights;
          setLmChatUser(user || null);
          setLmChatUserCurrentCommunity(
            initiateUserCall?.data?.community || null,
          );
          lmChatClient.setApiKeyInLocalStorage(apiKey);
          lmChatClient.setUserInLocalStorage(
            JSON.stringify(user),
          );
          return {
            accessToken: initiateUserCall?.data?.accessToken,
            refreshToken: initiateUserCall?.data?.refreshToken,
          };
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    }

    async function setUser() {
      try {
        if (apiKey && username) {
          // if (apiKey && username && uuid) {
          const localAccessToken =
            lmChatClient.getAccessTokenFromLocalStorage();
          const localRefreshToken =
            lmChatClient.getRefreshTokenFromLocalStorage();

          if (
            localAccessToken &&
            localRefreshToken &&
            localAccessToken.length &&
            localRefreshToken.length
          ) {
            await validateChatUser(localAccessToken, localRefreshToken);
            setUserNotLoadedErrorState(false);
          } else {
            await initiateFeedUser(apiKey, uuid || "", username, isGuest || false);
            setUserNotLoadedErrorState(false);
          }
        } else if (accessToken && refreshToken) {
          await validateChatUser(accessToken, refreshToken);
          setUserNotLoadedErrorState(false);
        } else {
          throw Error("Neither API key nor Tokens provided");
        }
      } catch (error) {
        console.log(error);
        setUserNotLoadedErrorState(true);
      }
    }

    document.addEventListener(CustomActions.TRIGGER_SET_USER, () => {
      setUser();
    });
    setUser();
    return () => {
      document.removeEventListener(CustomActions.TRIGGER_SET_USER, () => {
        setUser();
      });
    };
  }, [lmChatClient, userDetails]);

  //
  useEffect(() => {
    async function notification() {
      try {
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
    if (lmChatUser) {
      notification();
      return () => {
        setDeviceNotificationTrigger(() => false);
      };
    }
  }, [client, lmChatUser]);
  useEffect(() => {
    if (deviceNotificationTrigger) {
      return onMessage(messaging, (payload: any) => {
        toast(payload?.notification?.body);
        const NEW_NOTIFICATIONS_RECIEVED = new CustomEvent(
          CustomActions.NEW_NOTIFICATIONS_RECIEVED,
        );
        dispatchEvent(NEW_NOTIFICATIONS_RECIEVED);
      });
    }
  }, [deviceNotificationTrigger]);

  async function logOut() {
    try {
      const logOutCall = await lmChatClient.logout({
        deviceId: currentBrowserId.current
      })
      if (!logOutCall.success) {
        if (openSnackbar) {
          openSnackbar(logOutCall.errorMessage || `Error logging out`)
        }

      }
    } catch (error) {
      console.log(error)
    }
  }

  function logoutUser() {
    logOut()
    setLmChatUser(null);
    setLmChatUserMemberState(null);
  }

  const userProviderDataStore: UserProviderDataStore = {
    lmChatUser,
    lmChatUserCurrentCommunity,
    lmChatUserMemberState,
    userNotLoadedErrorState
  }
  const userProviderDefaultActions: UserProviderDefaultActions = {
    logoutUser: logoutUser
  }

  return {
    lmChatUser,
    lmChatUserMemberState,
    logoutUser: userProviderCustomActions?.logOutCustomCallback ? userProviderCustomActions.logOutCustomCallback.bind(null, userProviderDefaultActions, userProviderDataStore) : logoutUser,
    lmChatUserCurrentCommunity,
    userNotLoadedErrorState,
  };
}

export interface UserProviderDefaultActions {
  logoutUser: () => void;
}

export interface UserProviderDataStore {
  lmChatUser: null | Member;
  lmChatUserMemberState: number | null;
  lmChatUserCurrentCommunity: Community | null;
  userNotLoadedErrorState: boolean;
}
