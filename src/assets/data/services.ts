import type { ImageMetadata } from 'astro';

import natationPageTitle from '@assets/images/page-title/page_natation.jpg';
import bebeNageurPageTitle from '@assets/images/page-title/page_bebenageur.jpg';
import aquaversairePageTitle from '@assets/images/page-title/page_aquaversaire.jpg';
import surveillancePageTitle from '@assets/images/page-title/page_surveillance.jpg';
import aquafitnessPageTitle from '@assets/images/page-title/page_aquafitness.jpg';

import natationImg from '@assets/images/services/natation.jpg';
import bebeNageurImg from '@assets/images/services/bebe-nageur.jpg';
import aquaversaireImg from '@assets/images/services/aquaversaire.jpg';
import surveillanceImg from '@assets/images/services/surveillance.jpg';
import aquafitnessImg from '@assets/images/services/aquafitness.jpg';

interface Services {
  name: string;
  href: string;
  image: {
    path: ImageMetadata;
    alt: string;
  };
  icon: string;
  pageTitleImage: {
    path: ImageMetadata;
    alt: string;
  };
}

const services: Services[] = [
  {
    name: 'Cours de natation',
    href: '/prestations/cours-de-natation',
    image: {
      path: natationImg,
      alt: "Fillette nageant sous l'eau en souriant",
    },
    icon: 'swimmer',

    pageTitleImage: {
      path: natationPageTitle,
      alt: "Fillette nageant sous l'eau en souriant",
    },
  },
  {
    name: 'Cours bébé nageur',
    href: '/prestations/cours-bebe-nageur',
    image: {
      path: bebeNageurImg,
      alt: "Bébé nageur sous l'eau",
    },
    icon: 'baby',
    pageTitleImage: {
      path: bebeNageurPageTitle,
      alt: "Bébé nageur sous l'eau",
    },
  },
  {
    name: 'Aquaversaire',
    href: '/prestations/aquaversaire',
    image: {
      path: aquaversaireImg,
      alt: "Groupes d'enfants s'amusant dans une piscine",
    },
    icon: 'aquaversaire',
    pageTitleImage: {
      path: aquaversairePageTitle,
      alt: "Groupes d'enfants s'amusant dans une piscine",
    },
  },
  {
    name: 'Surveillance',
    href: '/prestations/evenement-securite',
    image: {
      path: surveillanceImg,
      alt: 'Couple de jeunes mariés se jetant dans une piscine habillés',
    },
    icon: 'event',
    pageTitleImage: {
      path: surveillancePageTitle,
      alt: 'Couple de jeunes mariés se jetant dans une piscine habillés',
    },
  },
  {
    name: 'Aquafitness',
    href: '/prestations/aquafitness',
    image: {
      path: aquafitnessImg,
      alt: "Personnes participant à un cours d'aquafitness",
    },
    icon: 'fitness',
    pageTitleImage: {
      path: aquafitnessPageTitle,
      alt: "Personnes participant à un cours d'aquafitness",
    },
  },
];

export default services;
