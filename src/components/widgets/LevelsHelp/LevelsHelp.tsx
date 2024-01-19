import React from "react";
import { useEffect, useRef } from "react";

import "./LevelsHelp.scss";

interface LevelsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const LevelsHelp: React.FC<React.PropsWithChildren<LevelsHelpProps>> = ({
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

  return (
    <div
      className="dialog"
      role="dialog"
      aria-modal="true"
      aria-describedby="dialog-description"
    >
      {isOpen && (
        <>
          <div className="dialog-overlay" aria-hidden="true" />
          <div className="dialog-content">
            <button type="button" onClick={onClose} className="btn-back ">
              Retour au formulaire
            </button>
            <div className="scrollable-content">{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default LevelsHelp;
