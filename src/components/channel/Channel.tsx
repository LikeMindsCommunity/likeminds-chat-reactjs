import ChannelBody from "./channel-body/ChannelBody";
import ChannelFooter from "./channel-footer/ChannelFooter";
import ChannelHeader from "./channel-header/ChannelHeader";

function Channel() {
  return (
    <div className="lm-channel">
      <ChannelHeader />
      <ChannelBody />
      <ChannelFooter />
    </div>
  );
}

export default Channel;
