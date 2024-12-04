import React, { useContext, useMemo } from "react";
import { LMDMChannelListContext } from "../../context/LMDMChannelListContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import document from "../../assets/img/document.svg";
import { Utils } from "../../utils/helpers";
import { Chatroom } from "../../types/models/Chatroom";
interface LMJoinedDMChannelTileProps {
  chatroom: Chatroom;
}
const LMChatJoinedChannelTile = ({ chatroom }: LMJoinedDMChannelTileProps) => {
  const {
    usersData,
    conversationsData,
    selectNewChatroom,
    currentSelectedChatroomId,
  } = useContext(LMDMChannelListContext);

  const { currentUser } = useContext(UserProviderContext);
  const {
    id,
    lastConversationId,
    userId = "",
    chatroomWithUserId,
    unseenCount = 0,
  } = chatroom;

  const lastConversation =
    conversationsData[lastConversationId?.toString() || ""];
  const chatroomUser = useMemo(() => {
    if (userId.toString() === currentUser?.id.toString()) {
      const chatroomUser = usersData[chatroomWithUserId || ""];
      return chatroomUser;
    } else {
      const chatroomUser = usersData[userId.toString()];
      return chatroomUser;
    }
  }, [chatroomWithUserId, currentUser?.id, userId, usersData]);
  const showLastConversationTime = () => {
    const presentDate = new Date();

    const lastConversationDate = new Date(lastConversation.date!);

    if (lastConversationDate.getTime() === presentDate.getTime()) {
      return lastConversation.createdAt;
    } else {
      return lastConversation.date;
    }
  };

  return (
    <div
      key={id.toString()}
      className={`channel-media ${currentSelectedChatroomId?.toString() === id.toString() ? "selected" : null}`}
      onClick={() => {
        selectNewChatroom(id);
      }}
    >
      <div className="channel-icon">
        {chatroomUser?.imageUrl ? (
          <>
            <img src={chatroomUser?.imageUrl || ""} alt="channel icon" />
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
            {lastConversation.userId?.toString() === currentUser.id.toString()
              ? "You"
              : chatroomUser.name.split(" ")[0]}
            :&nbsp;{" "}
            {lastConversation?.attachmentCount ? (
              <>
                <img src={document} alt="document" />
              </>
            ) : null}
            {lastConversation
              ? Utils.parseAnser(lastConversation.answer)
              : null}
          </div>
        </div>

        {unseenCount > 0 ? (
          <div className="channel-unseen-convo-count">{unseenCount}</div>
        ) : null}
      </div>
    </div>
  );
};

export default LMChatJoinedChannelTile;
