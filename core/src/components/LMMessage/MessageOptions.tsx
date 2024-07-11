import React, { useContext } from "react";
import { useMessageOptions } from "../../hooks/useMessageOptions";
import { useMenu } from "../../hooks/useMenu";
import { Dialog, Menu, MenuItem } from "@mui/material";
import LMMessageContext from "../../context/MessageContext";
import UserProviderContext from "../../context/UserProviderContext";
import { useDialog } from "../../hooks/useDialog";
import ReportTagsDialog from "./ReportTags";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ConversationActions } from "../../enums/message-options";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
import { ReplyDmQueries } from "../../enums/reply-dm-queries";
import { MemberType } from "../../enums/member-type";
import { ChatroomTypes } from "../../enums/chatroom-types";

function MessageOptions() {
  const { message } = useContext(LMMessageContext);
  const { currentUser } = useContext(UserProviderContext);
  const { canUserReplyPrivately, chatroom } = useContext(LMChatChatroomContext);
  const { onDelete, onReport, onEdit, onReply, onReplyPrivately } =
    useMessageOptions();
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { openDialog, dialogOpen, closeDialog } = useDialog();

  const options = [
    // {
    //   title: ConversationActions.REPLY_ON_MESSAGE,
    //   clickFunction: () => {
    //     onReply();
    //     closeMenu();
    //   },
    // },
    {
      title: ConversationActions.REPLY_PRIVATELY_ON_MESSAGE,
      clickFunction: () => {
        onReplyPrivately(message.member.id);
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
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <ReportTagsDialog reportCallback={onReport} closeDialog={closeDialog} />
      </Dialog>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        {options.map((option) => {
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
            message.member.id.toString() === currentUser?.id.toString() &&
            canUserReplyPrivately !==
              ReplyDmQueries.REPLY_PRIVATELY_NOT_ALLOWED &&
            chatroom?.chatroom.type.toString() !==
              ChatroomTypes.DIRECT_MESSAGE_CHATROOM.toString()
          ) {
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
