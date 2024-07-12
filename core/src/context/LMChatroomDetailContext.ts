import React from "react";

interface ChatroomDetailContextInterface {
  chatroom: unknown;
  setChatroom: React.Dispatch<unknown> | null;
}

export default React.createContext<ChatroomDetailContextInterface>({
  chatroom: null,
  setChatroom: null,
});
