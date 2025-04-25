import data from '../../assets/data/data.json' with { type: 'json' };
import pools from '../../assets/data/pools.ts';
console.log(pools)

const reservationLink = data.reservationLink;

import "./Form.scss";

const SwimmingInStationForm = () => {

  return (
    <fieldset className="form__section no-inputs" id="swimming-station">
      <legend>Cours de natation en bassin d'apprentissage</legend>

      <p>
        Pour vous inscrire aux cours de natation dans un de{" "}
        <a href="/bassins">nos bassins d'apprentissage</a>, utilisez notre
        nouveau système de réservation en ligne.
      </p>
      <a
        className="btn btn__regular"
        target="_blank"
        href={reservationLink}
        rel="noopener noreferrer"
      >
        Je réserve maintenant
      </a>
      <div className="pools">
        <h3>Nos bassins d'apprentissage</h3>
        <ul>
          {
          pools.map((item) => (
            <li key={item.name}>
              <a href={item.href}>
                <img loading="lazy" src={item.image.path.src} alt={item.image.alt} />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </fieldset>
  );
};

export default SwimmingInStationForm;
