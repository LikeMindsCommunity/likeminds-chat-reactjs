import React, { useContext } from "react";
import { useMessageOptions } from "../../hooks/useMessageOptions";
import { useMenu } from "../../hooks/useMenu";
import { Dialog, Menu, MenuItem } from "@mui/material";
import LMMessageContext from "../../context/LMMessageContext";
import UserProviderContext from "../../context/LMUserProviderContext";
import { useDialog } from "../../hooks/useDialog";
import ReportTagsDialog from "./LMReportTags";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ConversationActions } from "../../enums/lm-message-options";
import { LMChatroomContext } from "../../context/LMChatChatroomContext";
import { ReplyDmQueries } from "../../enums/lm-reply-dm-queries";
import { MemberType } from "../../enums/lm-member-type";
import { ChatroomTypes } from "../../enums/lm-chatroom-types";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import { LMChatTheme } from "../../enums/lm-chat-theme";

function MessageOptions() {
  const { message } = useContext(LMMessageContext);
  const { lmChatTheme } = useContext(LMGlobalClientProviderContext);
  const { currentUser } = useContext(UserProviderContext);
  const { canUserReplyPrivately, chatroomDetails } =
    useContext(LMChatroomContext);
  const { onDelete, onSetTopic, onReport, onEdit, onReplyPrivately } =
    useMessageOptions();
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { openDialog, dialogOpen, closeDialog } = useDialog();

  const options = [
    {
      title: ConversationActions.SET_AS_CURRENT_TOPIC,
      clickFunction: () => {
        onSetTopic();
        closeMenu();
      },
    },
    {
      title: ConversationActions.REPLY_PRIVATELY_ON_MESSAGE,
      clickFunction: () => {
        onReplyPrivately(message.member.sdkClientInfo?.uuid || "");
        closeMenu();
      },
    },
    {
      title: ConversationActions.REPORT_MESSAGE,
      clickFunction: () => {
        openDialog();
        closeMenu();
      },
    },
    {
      title: ConversationActions.DELETE_MESSAGE,
      clickFunction: () => {
        onDelete();
        closeMenu();
      },
    },

    {
      title: ConversationActions.EDIT_MESSAGE,
      clickFunction: () => {
        onEdit();
        closeMenu();
      },
    },
  ];

  return (
    <div>
      <Dialog open={dialogOpen} onClose={closeDialog} aria-hidden="false">
        <ReportTagsDialog reportCallback={onReport} closeDialog={closeDialog} />
      </Dialog>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        {options.map((option) => {
          if (
            option.title === ConversationActions.SET_AS_CURRENT_TOPIC &&
            currentUser?.state !== MemberType.COMMUNITY_MANAGER
          ) {
            return null;
          }

          if (
            option.title === ConversationActions.REPORT_MESSAGE &&
            message!.member?.id.toString() === currentUser?.id.toString()
          ) {
            return null;
          }
          if (
            option.title === ConversationActions.DELETE_MESSAGE &&
            message!.member?.id.toString() !== currentUser?.id.toString()
          ) {
            return null;
          }

          if (
            option.title === ConversationActions.REPLY_PRIVATELY_ON_MESSAGE &&
            canUserReplyPrivately !== ReplyDmQueries.REPLY_PRIVATELY_NOT_ALLOWED
          ) {
            if (message.member.id.toString() === currentUser?.id.toString()) {
              return null;
            }
            if (
              chatroomDetails.chatroom.type ===
              ChatroomTypes.DIRECT_MESSAGE_CHATROOM
            ) {
              return null;
            }

            if (
              message.member.state === MemberType.MEMBER &&
              canUserReplyPrivately ===
                ReplyDmQueries.REPLY_PRIVATELY_ALLOWED_TO_COMMUNITY_MANAGERS
            ) {
              return null;
            }
            if (message.member.id.toString() === currentUser?.id.toString()) {
              return null;
            }
            if (lmChatTheme === LMChatTheme.NETWORKING_CHAT) {
              return null;
            }
          }
          if (option.title === ConversationActions.EDIT_MESSAGE) {
            if (
              message!.member?.id.toString() !== currentUser?.id.toString() ||
              message!.answer.length === 0
            ) {
              return null;
            }
          }
          return (
            <MenuItem
              key={option.title}
              onClick={option.clickFunction}
              sx={{
                padding: "10px 20px",
                color: "#323232",
                borderBottom: "1px solid #eeeeee",
                fontSize: "14px",
              }}
            >
              {option.title}
            </MenuItem>
          );
        })}
      </Menu>
      <span onClick={openMenu}>
        <MoreHorizIcon fontSize="small" />
      </span>
    </div>
  );
}

export default MessageOptions;
