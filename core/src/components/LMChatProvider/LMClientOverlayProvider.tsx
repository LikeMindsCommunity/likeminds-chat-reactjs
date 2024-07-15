/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren, useEffect, useState } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import LoaderContextProvider from "../../context/LMLoaderContextProvider";
import useUserProvider from "../../hooks/useUserProvider";
import { Snackbar } from "@mui/material";
import { LMSDKCallbacksImplementations } from "../../LMSDKCoreCallbacks";
import { LMRoutes } from "../../LMRoutes";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
  userDetails,
  lmChatCoreCallbacks,
  routes,
}) => {
  const {
    lmChatUser,
    lmChatUserMemberState,
    logoutUser,
    lmChatUserCurrentCommunity,
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
  if (!lmChatUser) {
    return null;
  }

  return (
    <GlobalClientProviderContext.Provider
      value={{
        lmChatclient: client,
        userDetails: userDetails,
        routes: routes || new LMRoutes(),
      }}
    >
      <UserProviderContext.Provider
        value={{
          currentUser: lmChatUser,
          memberState: lmChatUserMemberState,
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
          {lmChatUser ? children : null}
          <Snackbar
            open={showSnackbarMessage ? true : false}
            message={showSnackbarMessage || ""}
            onClose={closeSnackbar}
          />
        </LoaderContextProvider.Provider>
      </UserProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
};

export default LMClientOverlayProvider;
