import { LMCoreCallbacks } from "../../LMSDKCoreCallbacks";
import { UserDetails } from "../../context/LMGlobalClientProviderContext";
import { LMClient } from "../DataLayerExportsTypes";

export interface LMChatProps {
  client: LMClient | null;
  userDetails: UserDetails;
  lmChatCoreCallbacks: LMCoreCallbacks;
}
