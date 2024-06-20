import sendIcon from "./../../assets/img/send.svg";
import giffyIcon from "./../../assets/img/giffy.png";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/InputContext";
import LMChatTextArea from "./LMChatTextArea";
import Emojis from "./Emojis";
import { Slide } from "@mui/material";
import MediaCarousel from "./Carousel";
import AttachmentsSelector from "./AttachmentsSelector";

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

        <div className="lm-channel-footer">
          <div className="lm-channel-icon lm-cursor-pointer">
            <Emojis />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <AttachmentsSelector />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <img src={giffyIcon} alt="giffy" />
          </div>

          <LMChatTextArea />
          {/* <input type="text" placeholder="Type a message" /> */}
          <div className="lm-channel-icon send">
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
