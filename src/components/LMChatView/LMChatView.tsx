import React, { PropsWithChildren, useContext } from "react";
import { LMChatViewProps } from "../../types/prop-types/LMChatViewProps";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import Loader from "../LMLoader/Loader";

import ChatroomDetailContext from "../../context/ChatroomDetailContext";
import MessageListContext from "../../context/MessageListContext";

import useChannelProvider from "../../hooks/useChannelProvider";
// import ScrollContainer from "../DualSidePagination/ScrollContainer";

const LMChatView: React.FC<PropsWithChildren<LMChatViewProps>> = (props) => {
  const { children } = props;
  const { loader } = useContext(LoaderContextProvider);

  const {
    chatroom,
    setChatroom,
    conversations,
    setConversations,
    getChatroomConversationsOnTopScroll,
  } = useChannelProvider();
  // Function to set the layout in case loader is false
  function setLayout() {
    return (
      <ChatroomDetailContext.Provider value={{ chatroom, setChatroom }}>
        <MessageListContext.Provider
          value={{
            conversations: conversations,
            setConversations,
            getChatroomConversationsOnTopScroll,
          }}
        >
          {children}
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
