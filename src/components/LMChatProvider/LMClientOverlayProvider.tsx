import React, { PropsWithChildren } from "react";
import { LMChatProps } from "../../types/prop-types/LMChatProps";
import GlobalClientProviderContext from "../../context/GlobalClientProviderContext";

const LMClientOverlayProvider: React.FC<PropsWithChildren<LMChatProps>> = ({
  client,
  children,
}) => {
  return (
    <div>
      <GlobalClientProviderContext.Provider
        value={{
          lmChatclient: client,
        }}
      >
        {children}
      </GlobalClientProviderContext.Provider>
    </div>
  );
};

export default LMClientOverlayProvider;
