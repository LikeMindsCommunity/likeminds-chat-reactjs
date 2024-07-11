/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren, useState } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";
import UserProviderContext from "../../context/UserProviderContext";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import useUserProvider from "../../hooks/useUserProvider";
import { Snackbar } from "@mui/material";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
  userDetails,
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
