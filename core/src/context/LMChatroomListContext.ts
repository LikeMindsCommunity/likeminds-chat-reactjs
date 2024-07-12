import React from "react";
interface ChatroomListContextInterface {
  dmChatrooms: unknown[] | null;
  setDmChatrooms: unknown | null;
}
export default React.createContext<ChatroomListContextInterface>({
  dmChatrooms: null,
  setDmChatrooms: null,
});
