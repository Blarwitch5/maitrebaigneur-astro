import type { ImageMetadata } from 'astro';

import endouceurImg from '../images/niveaux/0_endouceur-baigneurs.jpg';
import miniBaigneurImg from '../images/niveaux/1_mini-baigneurs.jpg';
import petitBaigneurImg from '../images/niveaux/2_petits-baigneurs.jpg';
import moyenBaigneurImg from '../images/niveaux/3_moyens-baigneurs.jpg';
import grandBaigneurImg from '../images/niveaux/4_grands-baigneurs.jpg';
import adulteImg from '../images/niveaux/5_adultes.jpg';



interface Levels {
  name: string;
  image: {
    path: ImageMetadata;
    alt: string;
  };
  desc: string;
  hints: string[];
}

const levels: Levels[] = [
  {
    "name": "Baigneur en douceur",
    "image": {
      "path": endouceurImg,
      "alt": "Petit baigneur reposant sa tête sur ses mains aux bord de la piscine et portant ses lunettes sur la tête"
    },

    "desc": "Découverte du milieu aquatique dès l'âge de 3 ans !",
    "hints": [
      "Mon enfant a peur de la piscine?",
      "Mon enfant ne mets pas la tête dans l’eau ?"
    ]
  },
  {
    "name": "Mini Baigneur",
    "image": {
      "path": miniBaigneurImg,
      "alt": "Petit baigneur avec ses lunettes sur la tête tout sourire accroché au bord de la piscine"
    },

    "desc": "Pour les premiers “ploufs” des Mini-Baigneurs, dites <span>« au revoir aux brassards » !</span>. Dès 3 ans, nous vous proposons les réflexes anti-noyade avec <span>« Savoir Se Sauver ! »</span>.",
    "hints": [
      "Mon enfant nage avec les brassards ?",
      "Mon enfant ne met pas la tête dans l’eau ?"
    ]
  },
  {
    "name": "Petit Baigneur",
    "image": {
      "path": petitBaigneurImg,
      "alt": "Enfant de dos s'apprêtant à sauter dans la piscine"
    },
    "desc": "<span>« Le sourire des enfants »</span> restera toujours notre priorité ! Nous pensons qu’apprendre à nager c’est bien, mais apprendre en s’amusant c’est mieux !",
    "hints": [
      "Mon enfant est à l’aise dans l’eau ?",
      "Mon enfant saute seul dans la piscine ?",
      "Mon enfant met la tête sous l’eau ?"
    ]
  },
  {
    "name": "Moyen Baigneur",
    "image": {
      "path": moyenBaigneurImg,
      "alt": "Petite fille sous l'eau passant dans un cerceau"
    },
    "desc": "Vos enfants sont à l’aise dans l’eau, mais quelques leçons sont nécessaires pour la mise en place des bons mouvements de la brasse et du dos crawlé.",
    "hints": [
      "Mon enfant se débrouille sans matériel ?",
      "Mon enfant est capable de nager seul sur quelques mètres ?"
    ]
  },
  {
    "name": "Grand Baigneur",
    "image": {
      "path": grandBaigneurImg,
      "alt": "Garçon au bord de la piscine portant des palmes"
    },
    "desc": "Laissez-nous confirmer votre nage, travailler le geste juste pour plus d’aisance et de confort. <span>Mise en place des 3 nages codifiées, dos, brasse et crawl.</span>",
    "hints": [
      "Je sais nager mais je veux améliorer mes nages, en particulier le crawl ?"
    ]
  },
  {
    "name": "Adulte",
    "image": {
      "path": adulteImg,
      "alt": "Jeune femme nageant sous l'eau dans une piscine"
    },
    "desc": "Laissez-nous confirmer votre nage, travailler le geste juste pour plus d’aisance et de confort.<span> « Il n’y a pas d’âge pour apprendre les 4 nages »</span>. Découvrez ou redécouvrez le plaisir de nager quelque soit votre âge…",
    "hints": ["Je sais nager et mais je veux perfectionner ma nage ?"]
  }
  
];

export default levels;