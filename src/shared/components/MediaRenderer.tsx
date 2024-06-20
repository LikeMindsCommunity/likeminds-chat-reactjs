import React, { useState } from "react";
import { Modal, Carousel } from "react-bootstrap";

const MediaRenderer = ({ attachments }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShow = (index) => {
    setCurrentIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const renderMedia = (attachment, index, isThumbnail = false) => {
    const fileType = attachment.url.split(".").pop().toLowerCase();
    const className = isThumbnail ? "thumbnail" : "carousel-media";

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
        />
      );
    } else if (["mp4", "mov", "avi", "mkv", "wmv", "flv"].includes(fileType)) {
      return (
        <video
          controls
          key={index}
          className={className}
          onClick={() => handleShow(index)}
        >
          <source src={attachment.url} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType === "pdf") {
      return (
        <embed
          src={attachment.url}
          type="application/pdf"
          width="100"
          height="100"
          key={index}
          className={className}
          onClick={() => handleShow(index)}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <div className="lm-media">
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

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          {/* <Modal.Title>Attachments</Modal.Title> */}
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
