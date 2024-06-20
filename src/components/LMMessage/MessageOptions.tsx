import React, { useContext } from "react";
import { useMessageOptions } from "../../hooks/useMessageOptions";
import { useMenu } from "../../hooks/useMenu";
import { Dialog, Menu, MenuItem } from "@mui/material";
import LMMessageContext from "../../context/MessageContext";
import UserProviderContext from "../../context/UserProviderContext";
import { useDialog } from "../../hooks/useDialog";
import ReportTagsDialog from "./ReportTags";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function MessageOptions() {
  const { message } = useContext(LMMessageContext);
  const { currentUser } = useContext(UserProviderContext);
  const { onDelete, onReport, onEdit } = useMessageOptions();
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const { openDialog, dialogOpen, closeDialog } = useDialog();
  const options = [
    {
      title: "Reply",
      clickFunction: () => {
        // chatroomContext.setIsSelectedConversation(true);
        // chatroomContext.setSelectedConversation(convoObject);
      },
    },
    {
      title: "Report",
      clickFunction: () => {
        openDialog();
      },
    },
    {
      title: "Delete",
      clickFunction: () => {
        onDelete();
      },
    },

    {
      title: "Edit Message",
      clickFunction: () => {
        onEdit();
      },
    },
  ];
  return (
    <div>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <ReportTagsDialog reportCallback={onReport} />
      </Dialog>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        {options.map((option) => {
          if (
            option.title === "Report" &&
            message!.member?.id.toString() === currentUser?.id.toString()
          ) {
            return null;
          }
          if (
            option.title === "Delete" &&
            message!.member?.id.toString() !== currentUser?.id.toString()
          ) {
            return null;
          }
          // if (
          //   (option.title === "Reply Privately" &&
          //     generalContext.currentChatroom?.type !== 7 &&
          //     generalContext.currentChatroom?.type !== 0 &&
          //     chatroomContext.showReplyPrivately) ||
          //   (option.title === "Reply Privately" && mode === "direct-messages")
          // ) {
          //   return null;
          // }
          // if (option.title === "Reply Privately") {
          //   if (convoObject.member?.id === userContext.currentUser?.id) {
          //     return null;
          //   }
          //   if (
          //     chatroomContext.replyPrivatelyMode === 2 &&
          //     convoObject?.member?.state === 4
          //   ) {
          //     return null;
          //   }
          // }
          if (option.title === "Edit Message") {
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
