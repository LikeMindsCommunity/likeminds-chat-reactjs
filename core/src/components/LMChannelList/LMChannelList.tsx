import React from "react";
import { useLocation } from "react-router-dom";
import LMDMChatChannels from "./LMDMChatChannels";
import LMGroupChatChannelList from "./LMGroupChatChannelList";
import {
  CHANNEL_PATH,
  DM_CHANNEL_PATH,
} from "../../shared/constants/lm.routes.constant";

const LMChannelList = () => {
  const { pathname } = useLocation();
  const switcher = () => {
    if (pathname.includes(CHANNEL_PATH)) {
      return <LMGroupChatChannelList />;
    } else if (pathname.includes(DM_CHANNEL_PATH)) {
      return <LMDMChatChannels />;
    }
  };
  return switcher();
};

export default LMChannelList;
