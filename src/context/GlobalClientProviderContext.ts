import React from "react";
import { LMClient } from "../types/DataLayerExportsTypes";

interface GlobalChatProviderContextInterface {
  lmChatclient: LMClient | null;
}

export default React.createContext<GlobalChatProviderContextInterface>({
  lmChatclient: null,
});
