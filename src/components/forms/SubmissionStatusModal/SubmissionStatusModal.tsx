import { useState, useEffect, useCallback, useRef } from 'react';

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
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsVisible(true);
    // Déplace le focus dans la modale à l'ouverture
    closeBtnRef.current?.focus();
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

  const headingId = isSuccess ? 'modal-success-title' : 'modal-error-title';

  return (
    <div
      className={`submission-status-modal ${isVisible ? 'visible' : ''} ${
        isSuccess ? 'success' : 'error'
      }`}
      onClick={handleOutsideClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="submission-status-modal-overlay" aria-hidden="true" />
      <div className="submission-status-modal-content">
        <button type="button" onClick={onClose} className="btn-back" ref={closeBtnRef}>
          Retour
        </button>
        {isSuccess ? (
          <>
            <img src={iconSuccess.src} width="128" height="128" alt="Petit baigneur satisfait" />
            <h2 id={headingId}>Formulaire envoyé avec succès!</h2>
            <p>
              Félicitations ! Votre formulaire a bien été soumis. Nous vous remercions pour votre
              message et nous nous efforcerons de vous répondre dans les plus brefs délais.
            </p>
          </>
        ) : (
          <>
            <img src={iconError.src} width="128" height="128" alt="Petit baigneur mécontent" />
            <h2 id={headingId}>Oops! Quelque chose s'est mal passé...</h2>

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
