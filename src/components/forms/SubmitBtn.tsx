import "./SubmitBtn.scss";

interface SubmitBtnProps {
  isSubmitting?: boolean;
}

const SubmitBtn = ({ isSubmitting = false }: SubmitBtnProps) => {
  return (
    <button
      className="btn btn__regular"
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? 'Envoi en cours…' : 'Envoyer'}
    </button>
  );
};
export default SubmitBtn;
