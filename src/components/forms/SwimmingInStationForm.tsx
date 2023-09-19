import data from "@assets/data/data.json";
import "./Form.scss";

interface Pool {
  name: string;
  href: string;
  thumb: {
    jpg: string;
    alt: string;
  };
}

interface SiteData {
  siteLinks: {
    pools?: Pool[];
  };
}

const { siteLinks } = data as SiteData;
const pools = siteLinks?.pools || [];

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
        href="https://user.clicrdv.com/maitre-baigneur"
        rel="noopener noreferrer"
      >
        Je réserve maintenant
      </a>
      <div className="pools">
        <h3>Nos bassins d'apprentissage</h3>
        <ul>
          {pools.map((item) => (
            <li key={item.name}>
              <a href={item.href}>
                <img loading="lazy" src={item.thumb.jpg} alt={item.thumb.alt} />
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
