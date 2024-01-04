// Icons
import smileyIcon from "./../../assets/img/smiley.svg";
import attachmentIcon from "./../../assets/img/attachment.svg";
import sendIcon from "./../../assets/img/send.svg";

const Input = () => {
  return (
    // Defalut view
    <div className="lm-channel-footer">
      <div className="lm-channel-icon">
        <img src={smileyIcon} alt="smileyIcon" />
      </div>
      <div className="lm-channel-icon">
        <img src={attachmentIcon} alt="attachment" />
      </div>
      <input type="text" placeholder="Type a message" />
      <div className="lm-channel-icon send">
        <img src={sendIcon} alt="sendIcon" />
      </div>
    </div>

    // Can't Respond
    // <div className="lm-channel-footer">
    //   <div className="disable-input">
    //     You can not respond to a rejected connection. Approve to send a message.
    //   </div>
    // </div>
  );
};

export default Input;
