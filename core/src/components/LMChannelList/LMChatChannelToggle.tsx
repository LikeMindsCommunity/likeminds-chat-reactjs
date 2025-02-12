import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import LMChatGroupChannelList from "./LMGroupChatChannelList";
import LMChatDMChannelList from "./LMDMChatChannels";

enum CurrentTab {
  DM,
  GROUPCHAT,
}

export const LMChatChannelListToggle = () => {
  const [currentTab, setCurrentTab] = useState<CurrentTab>(
    CurrentTab.GROUPCHAT,
  );

  const renderChannelList = () => {
    switch (currentTab) {
      case CurrentTab.GROUPCHAT: {
        // Render code for the direct message channel list rendering
        return <LMChatGroupChannelList />;
      }
      case CurrentTab.DM: {
        // Render code for the group chat channel list rendering
        return <LMChatDMChannelList />;
      }
    }
  };

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        className="lm-chat-channel-toggle"
      >
        <Tab
          label={<span>DM</span>}
          value={CurrentTab.DM}
          sx={{
            textTransform: "none",
          }}
        />
        <Tab
          label={<span>Groups</span>}
          value={CurrentTab.GROUPCHAT}
          sx={{
            textTransform: "none",
          }}
        />
      </Tabs>
      {renderChannelList()}
    </>
  );
};
