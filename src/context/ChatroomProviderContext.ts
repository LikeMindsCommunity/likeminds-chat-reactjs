import React from "react";
interface ChatroomProviderContextInterface {
  chatroomId: string | number | null;
  setChatroom: (() => void) | null;
}
export default React.createContext<ChatroomProviderContextInterface>({
  chatroomId: 24591,
  setChatroom: null,
});
