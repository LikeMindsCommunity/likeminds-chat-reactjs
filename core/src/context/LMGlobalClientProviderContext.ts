import React from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import { CustomComponents } from "../types/prop-types/CustomComponents";
import { LMRoutes } from "../LMRoutes";

interface GlobalChatProviderContextInterface {
  lmChatClient: LMClient;
  userDetails: UserDetails;
  customComponents?: CustomComponents;
  routes?: LMRoutes;
}
export interface UserDetails {
  username?: string;
  uuid?: string;
  isGuest?: boolean;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
}
export default React.createContext<GlobalChatProviderContextInterface>(
  {} as GlobalChatProviderContextInterface,
);
