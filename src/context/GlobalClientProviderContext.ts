import React from "react";

interface GlobalChatProviderContextInterface {
  lmChatclient: unknown;
}

export default React.createContext<GlobalChatProviderContextInterface>({
  lmChatclient: null,
});
