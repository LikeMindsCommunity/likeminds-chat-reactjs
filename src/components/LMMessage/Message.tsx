import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";

const Message = () => {
  const { message } = useContext(MessageContext);
  return (
    <div className="lm-channel">
      {message?.toString()}
      dfsdf
    </div>
  );
};

export default Message;
