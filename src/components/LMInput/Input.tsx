import LinkOffIcon from "@mui/icons-material/LinkOff";
import ClearIcon from "@mui/icons-material/Clear";

import sendIcon from "./../../assets/img/send.svg";
import { useInput } from "../../hooks/useInput";
import InputContext from "../../context/InputContext";
import LMChatTextArea from "./LMChatTextArea";
import Emojis from "./Emojis";
import { Collapse, IconButton } from "@mui/material";
import MediaCarousel from "./Carousel";
import AttachmentsSelector from "./AttachmentsSelector";
import giffyIcon from "./../../assets/img/giffy.png";
// import GiphySearch from "./GiphySearch";

import GiphySearch from "./GiphySearch";

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
    removeOgTag,
    getTaggingMembers,
    ogTag,
    gifs,
    loadingGifs,
    errorOnGifs,
    gifSearchQuery,
    openGifCollapse,
    setOpenGifCollapse,
    fetchGifs,
    handleGifSearch,
    gifQuery,
    setGifMedia,
    gifMedia,
    removeMediaFromImageList,
    removeMediaFromDocumentList,
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
        getTaggingMembers,
        removeOgTag,
        ogTag,
        gifMedia,
        gifs,
        loadingGifs,
        errorOnGifs,
        gifSearchQuery,
        openGifCollapse,
        setOpenGifCollapse,
        fetchGifs,
        handleGifSearch,
        gifQuery,
        setGifMedia,
        removeMediaFromImageList,
        removeMediaFromDocumentList,
      }}
    >
      <div className="lm-channel-footer-wrapper">
        {/* OG Tags */}
        <Collapse
          in={Boolean(ogTag)}
          sx={{
            background: "#D0D8E3",
          }}
        >
          <div className="og-tag-wrapper">
            <div className="og-tag-container">
              <div className="og-tag-icon">
                {ogTag?.image && ogTag?.image.length ? (
                  <img src={ogTag?.image} alt="icon" />
                ) : (
                  <LinkOffIcon
                    fontSize="medium"
                    sx={{
                      color: "white",
                    }}
                  />
                )}
              </div>
              <div className="og-tag-data">
                <div className="og-tag-data-header">{ogTag?.title}</div>
                <div className="og-tag-data-description">
                  {ogTag?.description}
                </div>
                <div className="og-tag-data-url">{ogTag?.url}</div>
              </div>
            </div>
            <div className="remove-og-tag-button">
              <IconButton onClick={removeOgTag}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </Collapse>

        {/* OG Tags */}
        {/* Gif Collapse */}
        <Collapse in={openGifCollapse}>
          <div className="lm-giphy-container">
            <GiphySearch />

            {/* <ReactGiffySearchComponent /> */}
          </div>
        </Collapse>
        {/* Media Carousel */}

        {/* <Slide direction="up" in={true} mountOnEnter unmountOnExit> */}
        <div>
          <MediaCarousel />
        </div>
        {/* </Slide> */}

        {/* <div className="lm-giphy-container">
          <GiphySearch />
          <GiSelector />
        </div> */}

        <div className="lm-channel-footer">
          <div className="lm-channel-icon lm-cursor-pointer">
            <Emojis />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <AttachmentsSelector />
          </div>
          <div className="lm-channel-icon lm-cursor-pointer">
            <img
              src={giffyIcon}
              alt="giffy"
              onClick={() => {
                setOpenGifCollapse(!openGifCollapse);
              }}
            />
            {/* <GiSelector /> */}
          </div>

          <LMChatTextArea />

          <div className="lm-channel-icon send lm-cursor-pointer">
            <IconButton onClick={postMessage}>
              <img src={sendIcon} alt="sendIcon" />
            </IconButton>
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
