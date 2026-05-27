import { useState, useEffect, useCallback, useRef } from 'react';

import './SubmissionStatusModal.scss';

import iconSuccess from '../../../assets/images/icons/fun.svg';
import iconError from '../../../assets/images/icons/error.svg';

interface SubmissionStatusModalProps {
  isSuccess: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SubmissionStatusModal: React.FC<SubmissionStatusModalProps> = ({ isSuccess, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsVisible(true);
    closeBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, []);

  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      modalContentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('keydown', handleFocusTrap);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('keydown', handleFocusTrap);
    };
  }, [handleEscapeKey, handleFocusTrap]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const headingId = isSuccess ? 'modal-success-title' : 'modal-error-title';

  return (
    <div
      className={`submission-status-modal ${isVisible ? 'visible' : ''} ${isSuccess ? 'success' : 'error'}`}
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="submission-status-modal-overlay" aria-hidden="true" />
      <div className="submission-status-modal-content" ref={modalContentRef}>
        <button type="button" onClick={onClose} className="btn-back" ref={closeBtnRef}>
          Retour
        </button>
        {isSuccess ? (
          <>
            <img src={iconSuccess.src} width="128" height="128" alt="Petit baigneur satisfait" />
            <h2 id={headingId}>Formulaire envoyé avec succès !</h2>
            <p>
              Votre formulaire a bien été soumis. Nous vous remercions et nous nous efforcerons de
              vous répondre dans les plus brefs délais.
            </p>
          </>
        ) : (
          <>
            <img src={iconError.src} width="128" height="128" alt="Petit baigneur mécontent" />
            <h2 id={headingId}>Oops ! Quelque chose s'est mal passé…</h2>
            <p>
              Nous rencontrons des difficultés pour traiter votre formulaire. Veuillez réessayer
              ultérieurement ou contacter notre{' '}
              <a href="mailto:contact@maitrebaigneur.com">équipe d'assistance</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionStatusModal;
