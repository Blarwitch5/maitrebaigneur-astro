import data from '../../assets/data/data.json';
import "./Form.scss";

interface PoolItem {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

const reservationLink = data.reservationLink;

const SwimmingInStationForm = ({ poolsList = [] }: { poolsList?: PoolItem[] }) => {
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
      {poolsList.length > 0 && (
        <div className="pools">
          <h3>Nos bassins d'apprentissage</h3>
          <ul>
            {poolsList.map((item) => (
              <li key={item.name}>
                <a href={item.href}>
                  <img loading="lazy" src={item.imageSrc} alt={item.imageAlt} />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </fieldset>
  );
};

export default SwimmingInStationForm;
