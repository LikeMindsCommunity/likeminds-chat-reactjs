import { useEffect, useState } from "react";
import {
  LMClientOverlayProvider,
  LMChannel,
  initiateLMClient,
  LMChatTheme,
  LMParticipantList,
  LMChatroomDetailContext,
} from "@likeminds.community/likeminds-chat-reactjs";

import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const App = () => {
  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({});

  const lmChatClient = initiateLMClient();

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const apiKey = params.get("apiKey");
    const uuid = params.get("uuid");
    const username = params.get("username");
    setUserDetails({
      apiKey: apiKey || "",
      uuid: uuid || "",
      username: username || "",
    });
  }, []);
  const navigate = useNavigate();
  return (
    <LMClientOverlayProvider
      client={lmChatClient}
      userDetails={userDetails}
      customCallbacks={{
        chatroomMenuCustomActions: {
          onViewParticipantsCustom: (b, a, id) => {
            console.log("n");
            console.log(id);
            navigate(`/participants/${id}`);
          },
        },
      }}
      lmChatTheme={LMChatTheme.COMMUNITY_HYBRID_CHAT}
    >
      <Routes>
        <Route path="/" element={<LMChannel />} />
        <Route path="/participants/:id" element={<SampleParticipants />} />
      </Routes>
    </LMClientOverlayProvider>
  );
};
function SampleParticipants() {
  const { id } = useParams();
  const [chatroomId, setChatroomId] = useState<string | undefined>("");
  useEffect(() => {
    setChatroomId(id);
  }, [id]);
  if (!chatroomId) {
    return null;
  }
  return <LMParticipantList chatroomId={parseInt(chatroomId)} />;
}
export default App;
