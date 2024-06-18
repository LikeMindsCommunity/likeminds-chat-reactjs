import React, { useContext } from "react";

import InputContext from "../../context/InputContext";
import { FileType } from "../../types/enums/Filetype";
import { Carousel } from "react-responsive-carousel";
const MediaCarousel = () => {
  const { imagesAndVideosMediaList, documentsMediaList } =
    useContext(InputContext);
  // carousel for images
  if (imagesAndVideosMediaList) {
    return (
      <div className="lm-input-carousel">
        <Carousel>
          {imagesAndVideosMediaList.map((file) => {
            if (file.type.includes(FileType.image)) {
              return renderLocalImage(file);
            } else {
              return renderLocalVideo(file);
            }
          })}
        </Carousel>
      </div>
    );
  } else if (documentsMediaList) {
    <Carousel>
      {documentsMediaList.map((file) => {
        return renderLocalDocument(file);
      })}
    </Carousel>;
  } else {
    return null;
  }
};
function renderLocalImage(file: File) {
  return (
    <img
      src={URL.createObjectURL(file)}
      alt={file.type}
      className="lm-input-carousel-image-element"
    />
  );
}
function renderLocalVideo(file: File) {
  return (
    <video
      src={URL.createObjectURL(file)}
      className="lm-input-carousel-video-element"
    ></video>
  );
}
function renderLocalDocument(file: File) {
  return (
    <div className="lm-input-carousel-document-element">
      Some PDF here by the name : {file.name}
    </div>
  );
}
export default MediaCarousel;
