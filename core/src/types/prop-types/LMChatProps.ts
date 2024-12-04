import { LMCoreCallbacks } from "../../LMSDKCoreCallbacks";
import { LMChatCustomActions } from "../../context/LMChatCustomisationContext";
import { UserDetails } from "../../context/LMGlobalClientProviderContext";
import { LMInputAttachments } from "../../enums/lm-input-attachment-options";
import { LMClient } from "../DataLayerExportsTypes";
import { CustomComponents } from "./CustomComponents";

export interface LMChatProps {
  client: LMClient;
  userDetails: UserDetails;
  lmChatCoreCallbacks?: LMCoreCallbacks;
  attachmentOptions?: LMInputAttachments[];
  customComponents?: CustomComponents;
  customCallbacks?: LMChatCustomActions;
}
