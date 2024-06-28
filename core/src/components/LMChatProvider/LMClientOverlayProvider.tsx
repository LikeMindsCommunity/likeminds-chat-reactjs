import React, { PropsWithChildren } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";
import UserProviderContext from "../../context/UserProviderContext";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import useUserProvider from "../../hooks/useUserProvider";

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
          currentCommunity: lmChatUserCurrentCommunity,
        }}
      >
        <LoaderContextProvider.Provider
          value={{
            loader: false,
            setLoader: null,
          }}
        >
          {lmChatUser ? children : null}
        </LoaderContextProvider.Provider>
      </UserProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
};

export default LMClientOverlayProvider;
