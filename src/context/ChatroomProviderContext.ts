import React from "react";
interface ChatroomProviderContextInterface {
  chatroomId: unknown | null;
  setChatroom: (() => void) | null;
}
export default React.createContext<ChatroomProviderContextInterface>({
  chatroomId: null,
  setChatroom: null,
});
