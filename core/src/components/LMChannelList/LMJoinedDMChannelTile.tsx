import React, { useContext, useMemo } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { LMDMChannelListContext } from "../../context/DMChannelListContext";
import { DM_CHANNEL_PATH } from "../../shared/constants/lm.routes.constant";
import UserProviderContext from "../../context/UserProviderContext";
import { ChatroomData } from "../../types/api-responses/getChatroomSync";
import document from "../../assets/img/document.svg";
import { Utils } from "../../utils/helpers";
interface LMJoinedDMChannelTileProps {
  chatroom: ChatroomData;
}
const LMJoinedDMChannelTile = ({ chatroom }: LMJoinedDMChannelTileProps) => {
  const { id: chatroomId } = useParams();
  const navigate = useNavigate();
  const { markReadADMChatroom, usersData, conversationsData } = useContext(
    LMDMChannelListContext,
  );
  const { currentUser } = useContext(UserProviderContext);
  const {
    id,
    last_conversation_id,
    user_id,
    chatroom_with_user_id,
    unseen_count,
  } = chatroom;

  const lastConversation = conversationsData[last_conversation_id.toString()];
  const chatroomUser = useMemo(() => {
    if (user_id.toString() === currentUser?.id.toString()) {
      const chatroomUser = usersData[chatroom_with_user_id || ""];
      return chatroomUser;
    } else {
      const chatroomUser = usersData[user_id.toString()];
      return chatroomUser;
    }
  }, [chatroom_with_user_id, currentUser?.id, user_id, usersData]);
  const showLastConversationTime = () => {
    const presentDate = new Date();

    const lastConversationDate = new Date(lastConversation.date);

    if (lastConversationDate.getTime() === presentDate.getTime()) {
      return lastConversation.created_at;
    } else {
      return lastConversation.date;
    }
  };

  return (
    <div
      key={id.toString()}
      className={`channel-media ${chatroomId?.toString() === id.toString() ? "selected" : null}`}
      onClick={() => {
        markReadADMChatroom(id);
        navigate(`/${DM_CHANNEL_PATH}/${id}`);
      }}
    >
      <div className="channel-icon">
        {chatroomUser?.image_url ? (
          <>
            <img src={chatroomUser?.image_url || ""} alt="channel icon" />
          </>
        ) : (
          <>{chatroomUser?.name.charAt(0)}</>
        )}
      </div>
      <div className="channel-desc">
        <div className="channel-title">
          <div>{chatroomUser?.name}</div>
          <div className="time">{showLastConversationTime()}</div>
        </div>
        <div className="channel-info">
          <div className="channel-last-conversation">
            {lastConversation.user_id === currentUser.id
              ? "You"
              : chatroomUser.name.split(" ")[0]}
            :&nbsp;{" "}
            {lastConversation?.attachment_count ? (
              <>
                <img src={document} alt="document" />
              </>
            ) : null}
            {lastConversation
              ? Utils.parseAnser(lastConversation.answer)
              : null}
          </div>
        </div>

        {unseen_count > 0 ? (
          <div className="channel-unseen-convo-count">{unseen_count}</div>
        ) : null}
      </div>
    </div>
  );
};

export default LMJoinedDMChannelTile;
