import pricesData from '@assets/data/prices.json';

const poolsData = [
  { name: 'Kabanon', location: 'Saint-Marc-Jaumegarde', address: 'Route du Plan de Lorgue, 13100 Saint-Marc-Jaumegarde', period: 'Été', services: ['Cours de natation'] },
  { name: 'Aquabecool', location: 'Aix Sud', address: 'Chemin de la Blaque, 13090 Aix-en-Provence', period: 'Toute l\'année', services: ['Cours de natation'] },
  { name: 'Kinémouv\'', location: 'Pertuis', address: '434 Chemin de Saint-Martin, 84120 Pertuis', period: 'Toute l\'année', services: ['Cours de natation', 'Bébé nageur'] },
  { name: 'Les Terrasses du Sun', location: 'Aix Sud Ouest', address: '165 Chemin de la Valette, 13290 Aix-en-Provence', period: 'Été', services: ['Cours de natation'] },
  { name: 'Le Carré d\'Ô', location: 'Aix Centre', address: '23 avenue de la Sainte Victoire, 13100 Aix-en-Provence', period: 'Toute l\'année', services: ['Cours de natation', 'Bébé nageur'] },
  { name: 'Saint-Maximin Été', location: 'Saint-Maximin', address: 'Saint-Maximin', period: 'Été', services: ['Cours de natation'] },
  { name: 'Saint-Maximin Balnéo', location: 'Saint-Maximin', address: 'Saint-Maximin', period: 'Toute l\'année', services: ['Cours de natation', 'Bébé nageur'] },
  { name: 'Country Club Aixois', location: 'Aix-en-Provence', address: '1195 Chemin des Cruyes, 13090 Aix-en-Provence', period: 'Été', services: ['Cours de natation', 'Événements & Sécurité'] },
  { name: 'Domicile', location: 'À votre domicile', address: 'Déplacement à domicile', period: 'Toute l\'année', services: ['Cours de natation', 'Événements & Sécurité', 'Aquaversaire'] },
];

const levelsData = [
  { name: 'Baigneur en douceur', desc: 'Découverte du milieu aquatique dès 3 ans. Pour enfants qui ont peur de la piscine ou ne mettent pas la tête dans l\'eau.' },
  { name: 'Mini Baigneur', desc: 'Premiers ploufs, adieu aux brassards. Dès 3 ans, réflexes anti-noyade avec "Savoir Se Sauver".' },
  { name: 'Petit Baigneur', desc: 'Apprendre à nager en s\'amusant. Enfant à l\'aise dans l\'eau, saute seul, met la tête sous l\'eau.' },
  { name: 'Moyen Baigneur', desc: 'À l\'aise dans l\'eau, mise en place des bons mouvements de la brasse et du dos crawlé. Nage seul sur quelques mètres.' },
  { name: 'Grand Baigneur', desc: 'Confirmation de la nage, geste juste. Mise en place des 3 nages codifiées : dos, brasse et crawl.' },
  { name: 'Super Baigneur', desc: 'Perfectionnement crawl, brasse, dos, initiation papillon. Objectif 4 nages.' },
  { name: 'Adulte', desc: 'Tous âges. Confirmer ou perfectionner sa nage, apprendre les 4 nages à l\'âge adulte.' },
];

export function getChatContext(): string {
  const p = pricesData.prices;

  const poolsText = poolsData
    .map(b => `- ${b.name} (${b.location}) — ${b.period} — Adresse : ${b.address} — Prestations : ${b.services.join(', ')}`)
    .join('\n');

  const swimmingPoolSingle = p.swimmingLessons.pool.single
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');
  const swimmingPoolFormula = p.swimmingLessons.pool.formula
    .map(i => `  ${i.name} : ${i.price}€/séance (${i.extraDesc.trim()})`)
    .join('\n');
  const swimmingHome30 = p.swimmingLessons.home.formula['30min']
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');
  const swimmingHome1h = p.swimmingLessons.home.formula['1h']
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');

  const babyPoolSingle = p.babySwimming.pool.single
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');
  const babyPoolFormula = p.babySwimming.pool.formula
    .map(i => `  ${i.name} : ${i.price}€/séance (${i.extraDesc.trim()})`)
    .join('\n');
  const babyHome = p.babySwimming.home.formula
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');

  const levelsText = levelsData
    .map(l => `- ${l.name} : ${l.desc}`)
    .join('\n');

  return `
## BASSINS (piscines partenaires)

${poolsText}

## PRESTATIONS

- Cours de natation (enfants et adultes, en bassin ou à domicile)
- Cours Bébé nageur (dès 3 mois, bassins : Kinémouv', Le Carré d'Ô, Saint-Maximin Balnéo — ou à domicile)
- Aquaversaire (anniversaire à la piscine)
- Événements & Sécurité / Surveillance (maître-nageur pour événements privés)

## TARIFS COURS DE NATATION

En bassin — Séances à l'unité :
${swimmingPoolSingle}

En bassin — Packs :
${swimmingPoolFormula}

À domicile — 30 minutes :
${swimmingHome30}

À domicile — 1 heure :
${swimmingHome1h}

## TARIFS BÉBÉ NAGEUR

En bassin — Séances à l'unité :
${babyPoolSingle}

En bassin — Packs :
${babyPoolFormula}

À domicile :
${babyHome}

## TARIFS AQUAVERSAIRE

${p.aquaversaire.desc}
Prix : ${p.aquaversaire.price}€ pour 2h — ${p.aquaversaire.extra.price}€ ${p.aquaversaire.extra.desc}

## TARIFS ÉVÉNEMENTS & SÉCURITÉ

${p.events.name} : sur devis (${p.events.condition})

## DIPLÔME / TEST D'AISANCE AQUATIQUE

Test sur ${p.diploma.distance} : ${p.diploma.price}€

## NIVEAUX DE NATATION

${levelsText}

## RÉSERVATION

Lien de réservation en ligne : https://maitrebaigneur.liberfit.fr/customportal/login

## INFORMATIONS GÉNÉRALES

- Maître Baigneur est une école de natation dans la région d'Aix-en-Provence
- Tous les cours sont encadrés par des maîtres-nageurs diplômés d'État
- Cours disponibles en bassin partenaire ou à domicile
- Bébé nageur : dès 3 mois
- Site : maitrebaigneur.com
`.trim();
}
