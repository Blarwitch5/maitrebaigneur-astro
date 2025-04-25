import type { ImageMetadata } from 'astro';


import kabanonImg from '../images/pools/kabanon.jpg';
import aquabecoolImg from '../images/pools/fallback.jpg';
import kinemouvImg from '../images/pools/kinemouv.jpg';
import planformImg from '../images/pools/planform.jpg';
import lesTerrassesDuSunImg from '../images/pools/les-terrasses-du-sun.jpg';
import leCarreDOImg from '../images/pools/le-carre-d-o.jpg';
import saintMaximinImg from '../images/pools/saint-maximin.jpg';
import saintMaximinBalneoImg from '../images/pools/saint-maximin-balneo.jpg';
import domicileImg from '../images/pools/domicile.jpg';
import hygieSportSanteImg from '../images/pools/hygie-sport-sante.jpg';


interface Pool {
  name: string;
  href: string;
  image: {
    path: ImageMetadata;
    alt: string;
  };
  period: string;
  location: string;
  address: string;
  
}

const pools: Pool[] = [
  {
    "name": "Kabanon",
    "href": "/bassins/kabanon",
    "image": {
      "path": kabanonImg,
      "alt": "Bassin du Kabanon des écuries de l'aube"
    },
    "period": "Summer",
    "location": "Saint-Marc-Jaumegarde",
    "address": "Route du Plan de Lorgue, 13100 Saint-Marc-Jaumegarde",
   
  },
  {
    "name": "Aquabecool",
    "href": "/bassins/aquabecool",
    "image": {
      "path": aquabecoolImg,
      "alt": "Bassin de Aquabecool"
    },
    "period": "All year",
    "location": "Aix Sud",
    "address": "Chemin de la Blaque, 13090 Aix-en-Provence",
    
  },

  {
    "name": "Kinémouv'",
    "href": "/bassins/kinemouv",
    "image": {
      "path": kinemouvImg,
      "alt": "Bassin de Kinémouv"
    },
    "period": "All year",
    "location": "Pertuis",
    "address": "434 Chemin de Saint-Martin, 84120 Pertuis",
   
  },
  {
    "name": "Plan Form",
    "href": "/bassins/plan-form",
    "image": {
      "path": planformImg,
      "alt": "Bassin de Plan Form"
    },
    "period": "All year",
    "location": "Cabriès",
    "address": "Parc Club de L´Arbois, Route de Calas, 13480 Cabriès",
    
  },
  {
    "name": "Les Terrasses du Sun",
    "href": "/bassins/les-terrasses-du-sun",
    "image": {
      "path": lesTerrassesDuSunImg,
      "alt": "Bassin des Terrasses du Sun"
    },
    "period": "Summer",
    "location": "Aix Sud Ouest",
    "address": "165 Chem. de la Valette, 13290 Aix-en-Provence",
    
  },
  {
    "name": "Le Carré d'Ô",
    "href": "/bassins/le-carre-d-o",
    "image": {
      "path": leCarreDOImg,
      "alt": "Bassin du Carré d'Ô"
    },
    "period": "All year",
    "location": "Aix Centre",
    "address": "23 avenue de la Sainte Victoire 13100 Aix-en-Provence",
    
  },
  {
    "name": "Saint-Maximin été",
    "href": "/bassins/saint-maximin-ete",
    "image": {
      "path": saintMaximinImg,
      "alt": "Bassin à Saint-Maximin"
    },
    "period": "Summer",
    "location": "Saint-Maximin",
    "address": "Saint-Maximin",
    
  },
  {
    "name": "Saint-Maximin Balnéo",
    "href": "/bassins/saint-maximin-balneo",
    "image": {
      "path": saintMaximinBalneoImg,
      "alt": "Bassin balnéothérapie à Saint-Maximin"
    },
    "period": "All year",
    "location": "Saint-Maximin",
    "address": "Saint-Maximin",
    
  },
  {
    "name": "Hygie Sport Santé",
    "href": "/bassins/hygie-sport-sante",
    "image": {
      "path": hygieSportSanteImg,
      "alt": "Bassin à Bouc-Bel-Air"
    },
    "period": "All year",
    "location": "Bouc-Bel-Air",
    "address": "55 Chemin de le pinède, 13320 Bouc-Bel-Air"
    },
  {
    "name": "Domicile",
    "href": "/bassins/domicile",
    "image": {
      "path": domicileImg,
      "alt": "Bassin à domicile"
    },
    "period": "All year",
    "location": "",
    "address": ""
    }
  
];

export default pools;