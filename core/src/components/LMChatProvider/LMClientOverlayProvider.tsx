/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren, useEffect, useState } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import LoaderContextProvider from "../../context/LMLoaderContextProvider";
import useUserProvider from "../../hooks/useUserProvider";
import { Snackbar } from "@mui/material";
import {
  LMCoreCallbacks,
  LMSDKCallbacksImplementations,
} from "../../LMSDKCoreCallbacks";
import { MemberType } from "../../enums/lm-member-type";
import { CustomisationContextProvider } from "../../context/LMChatCustomisationContext";
import { Toaster } from "react-hot-toast";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
  userDetails,
  lmChatCoreCallbacks = {} as LMCoreCallbacks,
  customCallbacks,
  customComponents,
  attachmentOptions,
  lmChatTheme,
}) => {
  const {
    lmChatUser,
    lmChatUserMemberState,
    logoutUser,
    lmChatUserCurrentCommunity,
    userNotLoadedErrorState,
  } = useUserProvider(client, userDetails);
  const [showSnackbarMessage, setShowSnackbarMessage] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (!client) return;

    const sdk = new LMSDKCallbacksImplementations(lmChatCoreCallbacks, client);
    client.setLMSDKCallbacks(sdk);
  }, [client, lmChatCoreCallbacks]);
  const openSnackbar = (message: string) => {
    setShowSnackbarMessage(() => {
      return message;
    });
  };
  const closeSnackbar = () => {
    setShowSnackbarMessage(() => null);
  };

  if (userNotLoadedErrorState) {
    if (customComponents?.userNotLoadedErrorScreen) {
      return <customComponents.userNotLoadedErrorScreen />;
    } else {
      return null;
    }
  }
  if (!lmChatUser) {
    if (customComponents?.userNotLoadedLoaderScreen) {
      return <customComponents.userNotLoadedLoaderScreen />;
    } else {
      return null;
    }
  }
  return (
    <GlobalClientProviderContext.Provider
      value={{
        lmChatClient: client,
        userDetails: userDetails,
        customComponents: customComponents,
        lmChatTheme: lmChatTheme,
      }}
    >
      <CustomisationContextProvider.Provider
        value={{ ...customCallbacks, attachmentOptions }}
      >
        <UserProviderContext.Provider
          value={{
            currentUser: lmChatUser!,
            memberState: lmChatUserMemberState || MemberType.MEMBER,
            logoutUser: logoutUser,
            currentCommunity: lmChatUserCurrentCommunity as unknown as any,
          }}
        >
          <LoaderContextProvider.Provider
            value={{
              loader: false,
              setLoader: null,
              openSnackbar: openSnackbar,
            }}
          >
            <Toaster position="top-right" />
            {children}
            <Snackbar
              open={showSnackbarMessage ? true : false}
              message={showSnackbarMessage || ""}
              onClose={closeSnackbar}
            />
          </LoaderContextProvider.Provider>
        </UserProviderContext.Provider>
      </CustomisationContextProvider.Provider>
    </GlobalClientProviderContext.Provider>
  );
};

export default LMClientOverlayProvider;
