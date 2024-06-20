import React, { useContext } from "react";
import { Utils } from "../../utils/helpers";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { useParticipants } from "../../hooks/useParticipants";

const LMParticipantList = () => {
  const { participants } = useParticipants();
  console.log(participants);
  //   const avatarContent = getAvatar({ imageUrl, name });

  return (
    <div className="lm-participant-wrapper">
      <div className="lm-participant-header">
        <div className="heading">Participants</div>
        <div className="counts">7 Participants</div>
      </div>
      <div className="lm-participant-body">
        <div className="lm-participant-card">
          <div className="lm-participant-card-user">user image</div>
          <div className="lm-participant-card-detail">
            <div className="name">Gaurav Rajput</div>
            <div className="desc">
              lskdfj lksdjf lskdjfl skjflskjf lskjdf lskjflskjflkjsf
            </div>
          </div>
        </div>
        <div className="lm-participant-card">
          <div className="lm-participant-card-user">user image</div>
          <div className="lm-participant-card-detail">
            <div className="name">user name</div>
            <div className="desc">sldfjlskdjf</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMParticipantList;
