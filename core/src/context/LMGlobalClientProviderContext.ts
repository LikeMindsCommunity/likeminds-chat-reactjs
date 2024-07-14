import React from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
import { CustomComponents } from "../types/prop-types/CustomComponents";

interface GlobalChatProviderContextInterface {
  lmChatclient: LMClient | null;
  userDetails: UserDetails;
  customComponents?: CustomComponents;
}
export interface UserDetails {
  username?: string;
  uuid?: string;
  isGuest?: boolean;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
}
export default React.createContext<GlobalChatProviderContextInterface>({
  lmChatclient: null,
  userDetails: {} as UserDetails,
});
