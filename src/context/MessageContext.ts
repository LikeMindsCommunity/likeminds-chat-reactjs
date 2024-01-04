import React from "react";

interface MessageContextInterface {
  message: unknown;
}

export default React.createContext<MessageContextInterface>({
  message: null,
});
