import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import crossIcon from "../../assets/img/carousel-cross-icon.svg";

import pdfIcon from "../../assets/img/pdf-document.svg";

import {
  SupportedDocumentMediaType,
  SupportedImageMediaType,
  SupportedVideoMediaType,
} from "../../types/enums/Filetype";
import { createPortal } from "react-dom";

const MediaRendererLocal = ({ attachments }: { attachments: File[] }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShow = (index: number) => {
    setCurrentIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (e: any) => {
    e.target.src = "https://via.placeholder.com/100"; // Fallback image URL
    e.target.onerror = null; // Prevent infinite loop if the fallback also fails
  };

  const renderMedia = (
    attachment: File,
    index: number,
    isThumbnail = false,
  ) => {
    const fileType = attachment.type?.split(".")?.pop()?.toLowerCase();
    const fileTypeOther = fileType?.split("&")[0];
    const className = isThumbnail ? "thumbnail" : "carousel-media";

    if (
      SupportedImageMediaType.includes(fileType!) ||
      SupportedImageMediaType.includes(fileTypeOther!) ||
      fileType?.includes("image")
    ) {
      return (
        <img
          src={URL.createObjectURL(attachment)}
          alt="img"
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        />
      );
    } else if (
      SupportedVideoMediaType.includes(fileType!) ||
      SupportedVideoMediaType.includes(fileTypeOther!) ||
      fileType?.includes("video")
    ) {
      return (
        <video
          controls
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        >
          <source
            src={URL.createObjectURL(attachment)}
            type={`video/${fileType}`}
          />
          Your browser does not support the video tag.
        </video>
      );
    } else if (SupportedDocumentMediaType.includes(fileType!)) {
      return (
        <div key={index} className={className}>
          <a
            href={URL.createObjectURL(attachment)}
            target="_blank"
            className="pdf"
          >
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

export default MediaRendererLocal;
