import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";

const Message = () => {
  const { message } = useContext(MessageContext);
  return <div>{message?.toString()}</div>;
};

export default Message;
