import data from '../../assets/data/data.json' with { type: 'json' };
const  reservationLink  = data.reservationLink;

const BabySwimmerForm = () => {
  return (
    <fieldset className="form__section no-inputs" id="baby">
      <legend>Cours bébé nageur</legend>

      <p>
        Pour vous inscrire aux cours de bébé nageur, utilisez notre nouveau
        système de réservation en ligne.
      </p>
      <a
        className="btn btn__regular"
        target="_blank"
        href={reservationLink}
        rel="noopener noreferrer"
      >
        Je réserve maintenant
      </a>
    </fieldset>
  );
};

export default BabySwimmerForm;
