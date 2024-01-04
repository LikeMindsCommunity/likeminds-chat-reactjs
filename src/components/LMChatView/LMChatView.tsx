import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { LMChatViewProps } from "../../types/prop-types/LMChatViewProps";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import Loader from "../LMLoader/Loader";

import ChatroomProviderContext from "../../context/ChatroomProviderContext";
import ChatroomDetailContext from "../../context/ChatroomDetailContext";
import MessageListContext from "../../context/MessageListContext";

const LMChatView: React.FC<PropsWithChildren<LMChatViewProps>> = (props) => {
  const { children } = props;
  const { loader } = useContext(LoaderContextProvider);
  const { chatroomId } = useContext(ChatroomProviderContext);

  // state variables and functions
  const [chatroom, setChatroom] = useState<unknown>(null);
  const [conversations, setConversations] = useState<string[]>(["hello", "hi"]);

  useEffect(() => {
    async function fetchChannel() {
      try {
        // get the chatroom details
        // get the chatroom conversations
        // set the loader to false
      } catch (error) {
        // console.log the error
      }
    }
    fetchChannel();
  }, [chatroomId]);

  // Function to set the layout in case loader is false
  function setLayout() {
    return (
      <ChatroomDetailContext.Provider value={{ chatroom, setChatroom }}>
        <MessageListContext.Provider
          value={{
            conversations: conversations,
            setConversations,
          }}
        >
          {conversations.length > 0 ? children : <div>0 conversations</div>}
        </MessageListContext.Provider>
      </ChatroomDetailContext.Provider>
    );
  }

  switch (loader) {
    case true:
      return <Loader />;
    case false:
      return setLayout();
  }
};

export default LMChatView;

// Function to set the loader component provided by the user or render the default one
//  function setLoaderComponent() {
//   if (LoaderComponent) {
//     return <LoaderComponent />;
//   } else {
//     return <Loader />;
//   }
// }

// Function to set the Header component provided by the user or render the default one
// function setHeaderComponent() {
//   if (HeaderComponent) {
//     return <HeaderComponent />;
//   } else {
//     return <Header />;
//   }
// }

// Function to set the MessageList component provided by the user of render the default one
// function setMessageList() {
//   if (MessageComponent) {
//     return <MessageComponent />;
//   } else {
//     return <MessageList />;
//   }
// }

// Function to set the Input component provided by the user of render the default one
// function setInputComponent() {
//   if (InputComponent) {
//     return <InputComponent />;
//   } else {
//     return <Input />;
//   }
// }
