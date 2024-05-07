import Header from "../Header/Header";
import LMChannelList from "../LMChannelList/LMChannelList";
import Input from "../LMInput/Input";
import MessageList from "../LMMessageList/MessageList";

const Channel = () => {
  return (
    <div className="d-flex">
      <div className="lm-left-panel">
        <LMChannelList />
      </div>
      <div className="lm-right-panel d-flex flex-direction">
        <Header />
        <MessageList />
        <Input />
      </div>
    </div>
  );
};

export default Channel;
