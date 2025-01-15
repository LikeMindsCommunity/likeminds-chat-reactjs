import React, { useContext, useState } from "react";
import InputContext from "../../context/LMInputContext";
import { FileType } from "../../types/enums/Filetype";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

// Styles
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
// Icons

import pdfViewIcon from "../../assets/img/pdf-document.svg";
import crossIcon from "../../assets/img/carousel-cross-icon.svg";
import LMGlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";

const LMMediaCarousel = () => {
  const {
    imagesAndVideosMediaList,
    documentsMediaList,
    removeMediaFromDocumentList,
    removeMediaFromImageList,
  } = useContext(InputContext);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState<number>(0);

  const { customComponents } = useContext(LMGlobalClientProviderContext);

  // Custom component
  if (customComponents?.input?.chatroomInputAttachmentsMediaCarousel) {
    return <customComponents.input.chatroomInputAttachmentsMediaCarousel />;
  }
  // Default component

  // carousel for images
  if (imagesAndVideosMediaList && imagesAndVideosMediaList?.length) {
    return (
      <div className="lm-input-carousel">
        <div className="input-media-carousel-holder">
          <span className="remove-media-icon">
            <IconButton
              onClick={() => removeMediaFromImageList(currentSelectedIndex)}
            >
              <img src={crossIcon} alt="cancel" />
            </IconButton>
          </span>
          <Carousel
            showArrows={true}
            selectedItem={currentSelectedIndex}
            onChange={setCurrentSelectedIndex}
          >
            {imagesAndVideosMediaList.map((file, index) => {
              if (file.type.includes(FileType.image)) {
                return renderLocalImage(file, index);
              } else {
                return renderLocalVideo(file, index);
              }
            })}
          </Carousel>
        </div>
      </div>
    );
  } else if (documentsMediaList && documentsMediaList?.length) {
    return (
      <div className="lm-input-carousel white-background-carousel">
        <div className="input-media-carousel-holder">
          <span className="remove-media-icon">
            <IconButton
              onClick={() => removeMediaFromDocumentList(currentSelectedIndex)}
            >
              <CloseIcon fontSize="medium" style={{ color: "white" }} />
            </IconButton>
          </span>
          <Carousel
            showThumbs={false}
            showArrows={true}
            selectedItem={currentSelectedIndex}
            onChange={setCurrentSelectedIndex}
          >
            {documentsMediaList.map((file, index) => {
              return renderLocalDocument(file, index);
            })}
          </Carousel>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
function renderLocalImage(file: File, index: number) {
  return (
    <>
      <img
        key={file.name.concat(index.toString())}
        src={URL.createObjectURL(file)}
        alt={file.type}
        className="lm-input-carousel-image-element"
      />
    </>
  );
}
function renderLocalVideo(file: File, index: number) {
  return (
    <video
      key={file.name.concat(index.toString())}
      src={URL.createObjectURL(file)}
      className="lm-input-carousel-video-element"
    ></video>
  );
}
function renderLocalDocument(file: File, index: number) {
  return (
    <div
      className="lm-input-carousel-document-element"
      key={file.name.concat(index.toString())}
    >
      <img src={pdfViewIcon} alt="pdf-icon" />
      <div className="document-file-details">{file.name}</div>
    </div>
  );
}
export default LMMediaCarousel;
