import React, { PropsWithChildren } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";
import UserProviderContext from "../../context/UserProviderContext";
import ThemeProviderContext from "../../context/ThemeProviderContext";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import useUserProvider from "../../hooks/useUserProvider";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
  theme,
}) => {
  const {
    lmChatUser,
    lmChatUserMemberState,
    logoutUser,
    lmChatUserCurrentCommunity,
  } = useUserProvider();
  return (
    <GlobalClientProviderContext.Provider
      value={{
        lmChatclient: client,
      }}
    >
      <ThemeProviderContext.Provider
        value={{
          themeObject: theme,
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
            {children}
          </LoaderContextProvider.Provider>
        </UserProviderContext.Provider>
      </ThemeProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
};

export default LMClientOverlayProvider;
