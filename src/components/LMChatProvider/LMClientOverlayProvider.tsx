import React, { PropsWithChildren, useState } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";
import UserProviderContext from "../../context/UserProviderContext";
import ThemeProviderContext from "../../context/ThemeProviderContext";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
  theme,
}) => {
  // State Variables
  const [lmChatUser, setLmChatUser] = useState<unknown>(null);
  const [lmChatUserMemberState, setLmChatUserMemberState] =
    useState<unknown>(null);

  // common functions
  function logoutUser() {
    setLmChatUser(null);
    setLmChatUserMemberState(null);
  }
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
          {children}
        </UserProviderContext.Provider>
      </ThemeProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
};

export default LMClientOverlayProvider;
