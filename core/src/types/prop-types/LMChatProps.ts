import { LMRoutes } from "../../LMRoutes";
import { LMCoreCallbacks } from "../../LMSDKCoreCallbacks";
import { UserDetails } from "../../context/LMGlobalClientProviderContext";
import { LMClient } from "../DataLayerExportsTypes";
import { CustomComponents } from "./CustomComponents";

export interface LMChatProps {
  client: LMClient | null;
  userDetails: UserDetails;
  lmChatCoreCallbacks: LMCoreCallbacks;
  routes?: LMRoutes;
  customComponents?: CustomComponents;
}
