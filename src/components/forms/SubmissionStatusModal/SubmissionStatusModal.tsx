import { useState, useEffect, useCallback } from 'react';

import './SubmissionStatusModal.scss';

import iconSuccess from '../../../assets/images/icons/fun.svg';
import iconError from '../../../assets/images/icons/error.svg';

// import AnimatedIcon from "./AnimatedIcon"; // Remplacez par votre icône animée ou image

interface SubmissionStatusModalProps {
  isSuccess: boolean;
  onClose: () => void;
}

const SubmissionStatusModal: React.FC<SubmissionStatusModalProps> = ({ isSuccess, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Ouvrir la modal lorsque des propriétés sont reçues
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fermer la modal en cliquant à l'extérieur
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  return (
    <div
      className={`submission-status-modal ${isVisible ? 'visible' : ''} ${
        isSuccess ? 'success' : 'error'
      }`}
      onClick={handleOutsideClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div className="submission-status-modal-overlay" aria-hidden="true" />
      <div className="submission-status-modal-content">
        <button type="button" onClick={onClose} className="btn-back ">
          Retour
        </button>
        {isSuccess ? (
          <>
            <img src={iconSuccess.src} width="128" height="128" alt="Petit baigneur satisfait" />
            <h2>Formulaire envoyé avec succès!</h2>
            <p>
              Félicitations ! Votre formulaire a bien été soumis. Nous vous remercions pour votre
              message et nous nous efforcerons de vous répondre dans les plus brefs délais.
            </p>
          </>
        ) : (
          <>
            <img src={iconError.src} width="128" height="128" alt="Petit baigneur mécontent" />
            <h2>Oops! Quelque chose s'est mal passé...</h2>

            <p>
              Nous rencontrons actuellement des difficultés pour traiter votre formulaire. Veuillez
              réessayer ultérieurement ou contacter notre{' '}
              <a href="mailto:support@maitrebaigneur.com">équipe d'assistance technique</a>. Nous
              nous excusons pour les désagréments occasionnés.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionStatusModal;
