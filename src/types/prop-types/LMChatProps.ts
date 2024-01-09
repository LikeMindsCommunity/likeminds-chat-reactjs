import { Theme } from "../theme/Theme";
import { LMClient } from "../DataLayerExportsTypes";

export interface LMChatProps {
  client: LMClient | null;
  theme: Theme;
}
