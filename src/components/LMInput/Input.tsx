import sendIcon from "./../../assets/img/send.svg";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/InputContext";
import LMChatTextArea from "./LMChatTextArea";
import Emojis from "./Emojis";
import { Slide } from "@mui/material";
import MediaCarousel from "./Carousel";
import AttachmentsSelector from "./AttachmentsSelector";
import giffyIcon from "./../../assets/img/giffy.png";
import GiSelector from "./GiSelector";
// import ReactGiphySearchbox from "react-giphy-searchbox";
// import GiphySearchBox from "react-giphy-searchbox";
// import GiSelector from "./GiSelector";

const Input = () => {
  const {
    inputBoxRef,
    inputWrapperRef,
    inputText,
    matchedTagMembersList,
    updateInputText,
    onTextInputKeydownHandler,
    fetchMoreTags,
    clearTaggingList,
    addEmojiToText,
    addDocumentsMedia,
    addImagesAndVideosMedia,
    imagesAndVideosMediaList,
    documentsMediaList,
    postMessage,
  } = useInput();
  return (
    // Defalut view
    <InputContext.Provider
      value={{
        inputBoxRef,
        inputWrapperRef,
        inputText,
        matchedTagMembersList,
        updateInputText,
        onTextInputKeydownHandler,
        fetchMoreTags,
        clearTaggingList,
        addEmojiToText,
        addDocumentsMedia,
        addImagesAndVideosMedia,
        imagesAndVideosMediaList,
        documentsMediaList,
        postMessage,
      }}
    >
      <div className="lm-channel-footer-wrapper">
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <div>
            <MediaCarousel />
          </div>
        </Slide>

        {/* Giphy */}
        {/* <div className="giphyContainer">
          <ReactGiphySearchbox
            apiKey="9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR"
            poweredByGiphy={false}
            searchPlaceholder="Search GIPHY"
            wrapperClassName={`gifContainer `}
            searchFormClassName="gifSearchBox"
            masonryConfig={[
              { columns: 2, imageWidth: 140, gutter: 10 },
              { mq: "600px", columns: 4, imageWidth: 200, gutter: 3 },
            ]}
          />
        </div> */}

        {/* <ReactGiphySearchbox
          apiKey="9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR"
          onSelect={(item) => console.log(item)}
          masonryConfig={[
            { columns: 2, imageWidth: 110, gutter: 5 },
            { mq: "700px", columns: 3, imageWidth: 120, gutter: 5 },
          ]}
        /> */}

        {/* <GiphySearchBox
          apiKey="9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR"
          onSelect={(item: any) => console.log("Selected GIF:", item)}
        /> */}
        {/* Giphy */}

        <div className="lm-channel-footer">
          <div className="lm-channel-icon lm-cursor-pointer">
            <Emojis />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <AttachmentsSelector />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            {/* <img src={giffyIcon} alt="giffy" /> */}
            <GiSelector />
          </div>

          <LMChatTextArea />
          {/* <input type="text" placeholder="Type a message" /> */}
          <div className="lm-channel-icon send lm-cursor-pointer">
            <img src={sendIcon} alt="sendIcon" onClick={postMessage} />
          </div>
        </div>
      </div>
    </InputContext.Provider>

    // Can't Respond
    // <div className="lm-channel-footer">
    //   <div className="disable-input">
    //     You can not respond to a rejected connection. Approve to send a message.
    //   </div>
    // </div>
  );
};

export default Input;
