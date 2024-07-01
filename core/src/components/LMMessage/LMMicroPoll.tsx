import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";

const LMMicroPoll = () => {
  const { message } = useContext(MessageContext);
  return (
    <div className="conversation sender">
      <div className="msg">{message?.answer}</div>
      <div className="time"></div>
    </div>
  );
};

export default LMMicroPoll;
