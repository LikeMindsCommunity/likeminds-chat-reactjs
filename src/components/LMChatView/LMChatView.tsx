import React, { PropsWithChildren, useContext } from "react";
import { LMChatViewProps } from "../../types/prop-types/LMChatViewProps";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import Loader from "../LMLoader/Loader";
import MessageList from "../LMMessageList/MessageList";

const LMChatView: React.FC<PropsWithChildren<LMChatViewProps>> = (props) => {
  const {
    MessageComponent = null,
    // InputComponent = null,
    // HeaderComponent = null,
    LoaderComponent = null,
  } = props;
  const { loader } = useContext(LoaderContextProvider);
  function setLoaderComponent() {
    if (LoaderComponent) {
      return <LoaderComponent />;
    } else {
      return <Loader />;
    }
  }
  switch (loader) {
    case true:
      return setLoaderComponent();
    case false:
      return <>{MessageComponent ? <MessageComponent /> : <MessageList />}</>;
  }

  return <div></div>;
};

export default LMChatView;
