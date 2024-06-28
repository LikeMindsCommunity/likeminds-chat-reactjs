import { UserDetails } from "../../context/GlobalClientProviderContext";
import { LMClient } from "../DataLayerExportsTypes";

export interface LMChatProps {
  client: LMClient | null;
  userDetails: UserDetails;
}
