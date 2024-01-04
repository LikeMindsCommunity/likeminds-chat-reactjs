import React from "react";

const Header = () => {
  return (
    <div className="lm-channel-header">
      <div className="lm-header-left">
        <div className="lm-channel-img">
          <img src="https://placehold.co/400" alt="chaneel img" />
        </div>
        <div className="lm-channel-desc">
          <div className="lm-channel-title">LikeMinds Channel Title</div>
          <div className="lm-channel-participants">388 Participants</div>
        </div>
      </div>
      <div className="lm-header-right">
        <div className="lm-channel-search">
          <img src="https://placehold.co/400" alt="chaneel img" />
        </div>
      </div>
    </div>
  );
};

export default Header;
