import React from "react";
import Conversation from "../types/models/conversations";

interface MessageContextInterface {
  message: Conversation | null;
}

export default React.createContext<MessageContextInterface>({
  message: null,
});
