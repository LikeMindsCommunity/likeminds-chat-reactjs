import React, { useContext, useState } from "react";
import { Modal, Carousel } from "react-bootstrap";
import LMMessageContext from "../../context/MessageContext";
import pdfIcon from "../../assets/img/pdf-document.svg";
import { getAvatar } from "./LMUserMedia";

const MediaRenderer = ({ attachments }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { message } = useContext(LMMessageContext);
  console.log(message);
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
    if (!attachment || !attachment.url) {
      console.error(`Invalid attachment at index ${index}:`, attachment);
      return null;
    }

    const fileType = attachment.url.split(".").pop().toLowerCase();
    const className = isThumbnail ? "thumbnail" : "carousel-media";

    // console.log(`Rendering attachment at index ${index}:`, attachment);

    if (
      ["jpeg", "jpg", "png", "gif", "bmp", "tiff", "tif"].includes(fileType)
    ) {
      return (
        <img
          src={attachment.url}
          alt="img"
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        />
      );
    } else if (["mp4", "mov", "avi", "mkv", "wmv", "flv"].includes(fileType)) {
      return (
        <video
          controls
          key={index}
          className={className}
          onClick={() => handleShow(index)}
          onError={handleError}
        >
          <source src={attachment.url} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType === "pdf") {
      return (
        <div>
          <a href={attachment.url} target="_blank" className="pdf">
            <img src={pdfIcon} alt="pdf" />
            <div className="pdfName">{attachment.name}</div>
          </a>
        </div>
        // <embed
        //   src={attachment.url}
        //   type="application/pdf"
        //   width="100"
        //   height="100"
        //   key={index}
        //   className={className}
        //   onClick={() => handleShow(index)}
        // />
      );
    } else {
      // console.log(message)
      console.error(`Unsupported file type at index ${index}: ${fileType}`);
      return null;
    }
  };

  return (
    <div className="">
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
        size="lg"
        backdrop={false}
        dialogClassName="lm-dialog-modal"
        contentClassName="lm-content-modal"
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MediaRenderer;
