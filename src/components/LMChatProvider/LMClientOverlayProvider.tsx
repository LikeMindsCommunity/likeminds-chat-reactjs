import React, { PropsWithChildren } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";
import UserProviderContext from "../../context/UserProviderContext";
import ThemeProviderContext from "../../context/ThemeProviderContext";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import useUserProvider from "../../hooks/useUserProvider";
import LMChatClient from "@likeminds.community/chat-js-beta";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
  theme,
}) => {
  // State Variables
  // const [lmChatUser, setLmChatUser] = useState<unknown>(null);
  // const [lmChatUserMemberState, setLmChatUserMemberState] =
  //   useState<unknown>(null);

  // common functions
  // function logoutUser() {
  //   setLmChatUser(null);
  //   setLmChatUserMemberState(null);
  // }
  const { lmChatUser, lmChatUserMemberState, logoutUser } = useUserProvider({
    lmChatClient: client as LMChatClient,
  });
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
