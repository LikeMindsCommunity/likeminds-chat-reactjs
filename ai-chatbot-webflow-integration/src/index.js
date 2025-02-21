
import { createRoot } from 'react-dom/client'
import { useState } from 'react';
import {
  LMChatAIButton,
  LMChatTheme,
  initiateLMClient
} from "@likeminds.community/likeminds-chat-reactjs-beta";

const App = ({apiKey, username}) => {
  const [userDetails, setUserDetails] = useState({
    apiKey: apiKey,
    uuid: "",
    username: username,
  });
   
  const lmChatClient = initiateLMClient()
     
      return (
        <LMChatAIButton
        isClearChatOptionEnabled={true}
        client={lmChatClient}
        userDetails={userDetails}
        customCallbacks={{
          userProviderCustomActions: {
            logOutCustomCallback: (defaultActions, _dataStore) => {
              defaultActions.logoutUser();
              localStorage.removeItem("chatroomIdWithAIChatbot");
              localStorage.removeItem("LOCAL_ACCESS_TOKEN");
              localStorage.removeItem("LOCAL_REFRESH_TOKEN");
              setUserDetails((a) => ({ ...a }));
            },
          },
        }}
        lmChatTheme={LMChatTheme.NETWORKING_CHAT}
        customComponents={{
          input: {
            chatroomInputAttachmentsSelector: () => null,
          },
        }}
      />
      );
};

const targetElement = document.getElementById('react-target')
const apiKey = targetElement.getAttribute('api-key') 
const username = targetElement.getAttribute('username')

const root = createRoot(targetElement)

root.render(<App apiKey={apiKey} username={username}/>)