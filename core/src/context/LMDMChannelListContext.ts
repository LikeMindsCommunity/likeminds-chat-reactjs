import React from "react";
import { UseDmChannelLists } from "../hooks/useDMChannelLists";

export interface LMDMChannelListContext extends UseDmChannelLists {}

export const LMDMChannelListContext =
  React.createContext<LMDMChannelListContext>({} as LMDMChannelListContext);
