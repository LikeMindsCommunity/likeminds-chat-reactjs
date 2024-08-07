import React, { useContext, useState } from "react";
import { Modal, Carousel } from "react-bootstrap";
import LMMessageContext from "../../context/LMMessageContext";
import pdfIcon from "../../assets/img/pdf-document.svg";
import { getAvatar } from "./LMUserMedia";
import MessageListContext from "../../context/LMMessageListContext";

const MediaRenderer = ({ attachments }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { message } = useContext(LMMessageContext);
  const { messageListContainerRef } = useContext(MessageListContext);
  const handleShow = (index) => {
    setCurrentIndex(index);
    setShow(true);
  };
  const imageUrl = message?.member.imageUrl;
  const name = message?.member.name;
  const avatarContent = getAvatar({ imageUrl, name });

  const handleClose = () => setShow(false);

  const handleError = (e) => {
    e.target.src = "https://via.placeholder.com/100"; // Fallback image URL
    e.target.onerror = null; // Prevent infinite loop if the fallback also fails
  };

  const renderMedia = (attachment, index, isThumbnail = false) => {
    if (!attachment || !attachment.file_url) {
      console.error(`Invalid attachment at index ${index}:`, attachment);
      return null;
    }

    const fileType = attachment.file_url.split(".").pop().toLowerCase();
    const fileTypeOther = fileType.split("&")[0];
    const className = isThumbnail ? "thumbnail" : "carousel-media";

    if (
      ["jpeg", "jpg", "png", "gif", "bmp", "tiff", "tif"].includes(fileType) ||
      ["jpeg", "jpg", "png", "gif", "bmp", "tiff", "tif"].includes(
        fileTypeOther,
      )
    ) {
      return (
        <img
          src={attachment.file_url}
          alt="img"
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        />
      );
    } else if (
      ["mp4", "mov", "avi", "mkv", "wmv", "flv"].includes(fileType) ||
      ["mp4", "mov", "avi", "mkv", "wmv", "flv"].includes(fileTypeOther)
    ) {
      return (
        <video
          controls
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        >
          <source src={attachment.file_url} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType === "pdf") {
      return (
        <div key={index} className={className}>
          <a href={attachment.file_url} target="_blank" className="pdf">
            <img src={pdfIcon} alt="pdf" />
            {!isThumbnail && <div className="pdfName">{attachment.name}</div>}
          </a>
        </div>
      );
    } else {
      console.error(`Unsupported file type at index ${index}: ${fileType}`);
      return null;
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

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop={false}
        dialogClassName="lm-dialog-modal"
        contentClassName="lm-dialog-content-modal"
        container={messageListContainerRef.current}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="lm-carousel-header">
              <div className="lm-profile">{avatarContent}</div>
              <div className="lm-profile-info">
                <div className="lm-name">{message?.member.name}</div>
                <div className="lm-desc">
                  {message?.date} at {message?.created_at}
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MediaRenderer;
