import React, { useContext } from "react";
import { Utils } from "../../utils/helpers";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { useParticipants } from "../../hooks/useParticipants";

const LMParticipantList = () => {
  const { participants } = useParticipants();
  console.log(participants);
  //   const avatarContent = getAvatar({ imageUrl, name });

  return <div className="lm-chat-card">participant list</div>;
};

export default LMParticipantList;
