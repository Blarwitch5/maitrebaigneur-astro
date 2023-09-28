import React, { useState, useEffect } from "react";

interface SubmissionStatusModalProps {
  isSuccess: boolean;
  onClose: () => void;
}

const SubmissionStatusModal: React.FC<SubmissionStatusModalProps> = ({
  isSuccess,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Open the modal when it receives props
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Close the modal when clicking outside it
  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close the modal when pressing the Escape key
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Listen for the Escape key press
  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div
      className={`submission-status-modal ${isVisible ? "visible" : ""}`}
      onClick={handleOutsideClick}
    >
      <div className="modal-content">
        {isSuccess ? (
          <>
            <h2>Form Submitted Successfully!</h2>
            <p>Your form submission was successful.</p>
          </>
        ) : (
          <>
            <h2>Form Submission Failed</h2>
            <p>There was an error with your form submission.</p>
          </>
        )}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default SubmissionStatusModal;
