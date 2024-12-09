import React, { SyntheticEvent, useState } from "react";
import { Carousel } from "react-bootstrap";
import crossIcon from "../../assets/img/carousel-cross-icon.svg";
import pdfIcon from "../../assets/img/pdf-document.svg";
import { Attachment } from "@likeminds.community/chat-js-beta";
import {
  SupportedDocumentMediaType,
  SupportedImageMediaType,
  SupportedVideoMediaType,
} from "../../types/enums/Filetype";
import { createPortal } from "react-dom";

const MediaRenderer = ({ attachments }: { attachments: Attachment[] }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShow = (index: number) => {
    setCurrentIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleError = (
    e: SyntheticEvent<HTMLImageElement | HTMLVideoElement>,
  ) => {
    e.currentTarget.src = "https://via.placeholder.com/100"; // Fallback image URL
    e.currentTarget.onerror = null; // Prevent infinite loop if the fallback also fails
  };

  const renderMedia = (
    attachment: Attachment,
    index: number,
    isThumbnail = false,
  ) => {
    if (!attachment || !attachment.fileUrl) {
      return null;
    }

    const fileType = attachment.fileUrl?.split(".")?.pop()?.toLowerCase();
    const fileTypeOther = fileType?.split("&")[0];
    const className = isThumbnail ? "thumbnail" : "carousel-media";

    if (
      SupportedImageMediaType.includes(fileType!) ||
      SupportedImageMediaType.includes(fileTypeOther!)
    ) {
      return (
        <img
          src={attachment.fileUrl}
          alt="img"
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        />
      );
    } else if (
      SupportedVideoMediaType.includes(fileType!) ||
      SupportedImageMediaType.includes(fileTypeOther!)
    ) {
      return (
        <video
          controls
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        >
          <source src={attachment.fileUrl} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (SupportedDocumentMediaType.includes(fileType!)) {
      return (
        <div key={index} className={className}>
          <a href={attachment.fileUrl} target="_blank" className="pdf">
            <img src={pdfIcon} alt="pdf" />
            {!isThumbnail && <div className="pdfName">{attachment.name}</div>}
          </a>
        </div>
      );
    } else {
      return null;
    }
  };

  const MediaRenderingModal = (
    <div className="lm-message-media-carousel-wrapper">
      <button className="lm-media-render-close-icon" onClick={handleClose}>
        <img src={crossIcon} alt="cancel" />
      </button>
      <div className="modal-content-wrapper">
        <Carousel
          activeIndex={currentIndex}
          onSelect={(selectedIndex) => setCurrentIndex(selectedIndex)}
          indicators={attachments.length > 1}
          controls={attachments.length > 1}
        >
          {attachments.map((attachment, index) => (
            <Carousel.Item key={index} className="lm-modal-media">
              {renderMedia(attachment, index)}
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
  const renderMediaCarousel = () => {
    if (show) {
      return createPortal(
        MediaRenderingModal,
        document.getElementById("lm-media-render-portal")!,
      );
    }
  };

  return (
    <div className="mediaBox">
      {attachments.length === 1 ? (
        renderMedia(attachments[0], 0)
      ) : (
        <div className="thumbnail-container">
          {attachments.slice(0, 4).map((attachment, index) => (
            <div key={index} className="thumbnail-wrapper">
              {renderMedia(attachment, index, true)}
              {index === 3 && attachments.length > 4 && (
                <div className="more-attachments-overlay">
                  +{attachments.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {renderMediaCarousel()}
    </div>
  );
};

export default MediaRenderer;
