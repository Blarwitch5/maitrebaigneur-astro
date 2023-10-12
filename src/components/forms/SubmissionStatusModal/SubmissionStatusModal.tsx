import { useState, useEffect } from "react";

import "./SubmissionStatusModal.scss";

import iconSuccess from "../../../icons/fun.svg";
import iconError from "../../../icons/error.svg";

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
      className={`submission-status-modal ${isVisible ? "visible" : ""} ${
        isSuccess ? "success" : "error"
      }`}
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="submission-status-modal-overlay" aria-hidden="true"></div>
      <div className="submission-status-modal-content">
        <button onClick={onClose} className="btn-back ">
          Retour
        </button>
        {isSuccess ? (
          <>
            <img
              src={iconSuccess.src}
              width="128"
              height="128"
              alt="Petit baigneur satisfait"
            />
            <h2>Formulaire envoyé avec succès!</h2>
            <p>
              Félicitations ! Votre formulaire a bien été soumis. Nous vous
              remercions pour votre message et nous nous efforcerons de vous
              répondre dans les plus brefs délais.
            </p>
          </>
        ) : (
          <>
            <img
              src={iconError.src}
              width="128"
              height="128"
              alt="Petit baigneur mécontent"
            />
            <h2>Oops! Quelque chose s'est mal passé...</h2>

            <p>
              Nous rencontrons actuellement des difficultés pour traiter votre
              formulaire. Veuillez réessayer ultérieurement ou contacter notre
              <a href="mailto:support@maitrebaigneur.com">
                équipe d'assistance technique
              </a>
              . Nous nous excusons pour les désagréments occasionnés.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionStatusModal;
