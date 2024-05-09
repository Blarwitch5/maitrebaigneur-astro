import { useEffect, useRef } from "react";

import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LevelsHelp: React.FC<React.PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && popupRef.current) {
      popupRef.current.focus();
    }
  }, [isOpen]);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "Tab") {
      const focusableElements = popupRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;
      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus();
        event.preventDefault();
      }
    }
  };

  return (
    <div
      className="dialog"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={popupRef}
      onKeyDown={handleKeyDown}
    >
      {isOpen && (
        <>
          <div className="dialog-overlay" aria-hidden="true" />
          <div className="dialog-content">
            <button type="button" onClick={onClose} className="btn-back">
              Retour
            </button>
            <div className="scrollable-content">{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default LevelsHelp;
