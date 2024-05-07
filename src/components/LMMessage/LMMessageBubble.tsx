import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";

const LMMessageBubble = () => {
  const messageContext = useContext(MessageContext);
  console.log(messageContext);
  return <div>{""}</div>;
};

export default LMMessageBubble;
