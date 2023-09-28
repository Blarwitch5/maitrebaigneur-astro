import React, { useState, useEffect } from "react";
// import AnimatedIcon from "./AnimatedIcon"; // Remplacez par votre icône animée ou image

interface SubmissionStatusModalProps {
  isSuccess: boolean;
  onClose: () => void;
}

const SubmissionStatusModal: React.FC<SubmissionStatusModalProps> = ({
  isSuccess,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Ouvrir la modal lorsque des propriétés sont reçues
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fermer la modal en cliquant à l'extérieur
  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Fermer la modal en appuyant sur la touche Échap
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Écouter la touche Échap
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
        {/* <CompanyLogo /> */}
        {isSuccess ? (
          <>
            <h2>Formulaire Envoyé Avec Succès!</h2>
            <p>Bravo! Votre formulaire a bien été expédié.</p>
            <p>
              Merci pour votre message, nous nous efforçons de vous répondre
              dans les plus brefs délais.
            </p>
          </>
        ) : (
          <>
            <h2>Oops! Quelque Chose A Mal Tourné...</h2>
            <p>
              Oh non! Il semble y avoir eu une petite erreur
              <a href="mailto:support@maitrebaigneur.com">le webmaster</a>nvoi
              de votre formulaire.
            </p>
            <p>
              Si l'erreur se reproduit, veuillez contacter le webmaster du site
            </p>
          </>
        )}
        <button className="close-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
};

export default SubmissionStatusModal;
