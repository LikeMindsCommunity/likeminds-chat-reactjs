import React from "react";
import { MessageCustomActions } from "../types/prop-types/CustomComponents";

export const LMMessageListCustomActionsContext =
  React.createContext<LMMessageListCustomActionsContextInterface>({});
interface LMMessageListCustomActionsContextInterface {
  messageCustomActions?: MessageCustomActions;
}
