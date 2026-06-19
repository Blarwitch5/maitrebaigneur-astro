import pricesData from '@assets/data/prices.json';
import pools from '@assets/data/pools.ts';
import levels from '@assets/data/levels.ts';

function stripHtml(str: string): string {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export function getChatContext(): string {
  const p = pricesData.prices;

  const poolsText = pools
    .map(b => {
      const period = b.period === 'Summer' ? 'Été' : "Toute l'année";
      const services = b.services.map(s => s.name).join(', ');
      const location = b.location || 'À votre domicile';
      return `- ${b.name} (${location}) — ${period} — Adresse : ${b.address || 'Déplacement à domicile'} — Prestations : ${services}`;
    })
    .join('\n');

  const swimmingPoolSingle = p.swimmingLessons.pool.single
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');
  const swimmingPoolFormula = p.swimmingLessons.pool.formula
    .map(i => `  ${i.name} : ${i.price}€/séance — ${i.totalPrice}€ total (${i.validity})`)
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
    .map(i => `  ${i.name} : ${i.price}€/séance — ${i.totalPrice}€ total (${i.validity})`)
    .join('\n');
  const babyHome = p.babySwimming.home.formula
    .map(i => `  ${i.name} : ${i.price}€`)
    .join('\n');

  const levelsText = levels
    .map(l => `- ${l.name} : ${stripHtml(l.desc)}`)
    .join('\n');

  const babyPools = pools
    .filter(b => b.services.some(s => s.name === 'Cours Bébé nageur'))
    .map(b => b.name)
    .join(', ');

  return `
## QUI SOMMES-NOUS

Maître Baigneur est une école de natation fondée par Quentin Vander Meulen, dans la région d'Aix-en-Provence.

Fondateur et directeur : Quentin Vander Meulen
Parcours : athlète de haut niveau, joueur professionnel de water-polo, maître-nageur diplômé d'État.
Sa vision : "Allier mes différentes expériences et transmettre mon savoir au travers d'une pédagogie ludique, pour que chaque baigneur puisse avoir le plaisir de nager en toute sécurité."

Tous les cours sont encadrés par des maîtres-nageurs diplômés d'État.
Note Google : 4,9/5 sur 174 avis.

## PHILOSOPHIE & PÉDAGOGIE

Cours en petits groupes, pédagogie ludique axée sur la progression et la sécurité.
Bénéfices : esprit d'équipe, confiance en soi, bons réflexes aquatiques, développement de la coordination.
La régularité des séances est essentielle pour progresser.

## CONTACT

Téléphone : +33 6 77 00 75 84
Email : contact@maitrebaigneur.com
Site : maitrebaigneur.com
Page de contact : https://maitrebaigneur.com/contact

## BASSINS (piscines partenaires)

${poolsText}

## PRESTATIONS

- Cours de natation (enfants et adultes, en bassin ou à domicile)
- Cours Bébé nageur (dès 3 mois, bassins : ${babyPools} — ou à domicile)
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
`.trim();
}
