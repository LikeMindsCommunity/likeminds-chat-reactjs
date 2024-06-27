import React, { useContext, useMemo, useState } from "react";
import LMMessageContext from "../../context/MessageContext";
import { Reaction } from "../../types/models/conversations";
import { useDialog } from "../../hooks/useDialog";
import { Dialog, Tab, Tabs } from "@mui/material";

const MessageReactionHolder = () => {
  const { message } = useContext(LMMessageContext);
  const { openDialog, closeDialog, dialogOpen } = useDialog();
  const [selectedReaction, setSelectedReaction] = useState<string>("");
  const messageReactionMap = useMemo(() => {
    const messageReactions = message?.reactions;
    const messageReactionsMap: Record<string, Reaction[]> = {};
    messageReactions?.forEach((reactionObject) => {
      const reactionString = reactionObject.reaction.toString();
      if (messageReactionsMap[reactionString]) {
        messageReactionsMap[reactionString].push(reactionObject);
      } else {
        messageReactionsMap[reactionString] = [reactionObject];
      }
    });
    return messageReactionsMap;
  }, [message?.reactions]);
  if (!message) {
    return null;
  }
  return (
    <div className="lm-chat-message-reactions-holder">
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        className="reactions-dialog"
      >
        <div className="message-reactions-members-list">
          <div className="reactionHeader">
            Reactions({Object.keys(messageReactionMap).length})
          </div>

          <Tabs
            value={selectedReaction}
            onChange={(_, newValue) => {
              setSelectedReaction(newValue);
            }}
          >
            <div className="reactions-selection-tabs">
              <Tab value={""} label={"All"} />

              {Object.keys(messageReactionMap).map((reaction) => {
                return <Tab value={reaction} label={reaction} />;
              })}
            </div>
          </Tabs>

          <div className="reaction-users-list">
            {selectedReaction.length !== 0
              ? messageReactionMap[selectedReaction].map((reactions) => {
                  return (
                    <div className="reactionUser">
                      <div className="userImg">
                        {reactions.member.imageUrl ? (
                          <img src={reactions.member.imageUrl} alt="image" />
                        ) : (
                          <div>{reactions.member.name[0]}</div>
                        )}
                      </div>
                      <div className="userName">{reactions.member.name}</div>
                    </div>
                  );
                })
              : message.reactions.map((reactions) => {
                  return (
                    <div className="reactionUser">{reactions.member.name}</div>
                  );
                })}
          </div>
        </div>
      </Dialog>

      {Object.keys(messageReactionMap).map((reaction) => {
        const reactionObject = messageReactionMap[reaction];
        return (
          <div
            className="lm-chat-message-reaction"
            key={reaction}
            onClick={() => {
              setSelectedReaction(reaction);
              openDialog();
            }}
          >
            <span className="reaction-con">{reaction}</span>
            <span className="reaction-count">{reactionObject.length}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MessageReactionHolder;