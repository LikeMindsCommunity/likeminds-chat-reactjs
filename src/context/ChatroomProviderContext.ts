import React from "react";
interface ChatroomProviderContextInterface {
  chatroomId: string | number | null;
  setChatroom: (() => void) | null;
}
export default React.createContext<ChatroomProviderContextInterface>({
  chatroomId: 94621,
  setChatroom: null,
});
