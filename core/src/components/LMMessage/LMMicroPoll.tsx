import React, { useContext } from "react";
import MessageContext from "../../context/MessageContext";
import pollIcon from "../../assets/img/poll-icon.svg";
const LMMicroPoll = () => {
  const { message } = useContext(MessageContext);
  return (
    <div className="conversation reciever">
      {/* <div className="msg">{message?.answer}</div> */}
      <div className="lm-poll">
        <div className="user-profile">
          <div className="name">Sachin</div>
          <div className="info">Instant poll * Open voting</div>
        </div>
        <div className="poll-header">
          <div className="poll-icon">
            <img src={pollIcon} alt="Poll Icon" />
          </div>
          <button className="ends">Ends in 1 day</button>
        </div>
        <div className="poll-title">
          What percentage of the indian population has hair fall issue?
        </div>
        <div className="pollOptions">
          <div className="pollOption bg">
            <div className="option">Sketch</div>
          </div>
          <div className="votes"> 5 votes </div>
        </div>
        <div className="pollOptions text-grey">
          <div className="pollOption bg-grey">
            <div className="option">Sketch</div>
          </div>
          <div className="votes text-grey"> 3 votes </div>
        </div>
        <div className="pollOptions text-grey">
          <div className="pollOption bg-grey">
            <div className="option">Sketch</div>
          </div>
          <div className="votes text-grey"> 2 votes </div>
        </div>
        <div className="totalVotes">You and 15 others voted.</div>
      </div>
    </div>
  );
};

export default LMMicroPoll;
