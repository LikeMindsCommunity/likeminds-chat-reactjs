import React, { useContext } from "react";

import LMDMChatChannels from "./LMDMChatChannels";
import LMGroupChatChannelList from "./LMGroupChatChannelList";
import { PARTICIPANTS_PATH } from "../../shared/constants/lm.routes.constant";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMChannelList = () => {
  const { routes } = useContext(LMGlobalClientProviderContext);
  const { pathname } = window.location;
  const switcher = () => {
    if (
      pathname.includes(routes?.getChannelPath() || "") ||
      pathname.includes(PARTICIPANTS_PATH)
    ) {
      return <LMGroupChatChannelList />;
    } else if (pathname.includes(routes?.getDmChannelPath() || "")) {
      return <LMDMChatChannels />;
    }
  };
  return switcher();
};

export default LMChannelList;
