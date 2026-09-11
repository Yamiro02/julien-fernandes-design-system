#!/usr/bin/env node
/**
 * Filet de LA COULEUR D'ACTIF — tout ce qui est actif lit --active, et rien d'autre.
 *
 * LE DÉFAUT QU'IL FERME. Jusqu'à la 0.20.0, l'état « actif » du socle prenait TROIS
 * couleurs selon le composant : le jumeau lisible sur l'entrée de menu et le bouton
 * enfoncé, l'aplat de marque sur l'entrée de rail et la pastille, l'ENCRE sur le lien de
 * navbar et la page courante de pagination. Chaque règle avait sa raison, écrite ; le
 * résultat à l'écran était trois oranges (dont un brun) pour dire « tu es ici ». Julien
 * l'a redemandé à chaque lot : « la couleur de n'importe quoi actif, c'est l'orange
 * clair ». Une demande qu'on refait n'est pas une règle, c'est un souvenir — ce garde la
 * transforme en règle.
 *
 * LA RÈGLE. Dans `src/styles/patterns.css`, toute règle dont le sélecteur nomme un ÉTAT
 * ACTIF — `.is-active`, `.is-selected`, `[aria-selected="true"]`, `[aria-current…]`,
 * `[aria-pressed="true"]`, `.ds-icon-btn--accent` — ne peut colorer son contenu et ses
 * contours qu'avec `var(--active)` :
 *   · `color:` doit valoir `var(--active)` — sauf `var(--primary-foreground)` quand la
 *     même règle pose un REMPLISSAGE de marque (le jour sélectionné du calendrier : blanc
 *     sur le dégradé, c'est l'aplat qui est actif, pas le glyphe) ;
 *   · `border-color:` et `box-shadow:` ne peuvent référencer aucun autre jeton de marque
 *     (`--primary`, `--primary-readable`, `--brand-*`, `--ring`) ni l'encre : le contour
 *     d'une sélection est --active, comme son texte.
 * Le pseudo-état `:active` (le bouton ENFONCÉ pendant le clic) n'est pas un état actif :
 * il n'est pas regardé. Une règle d'actif sans `color:` (un `transform`, une ombre) passe.
 *
 * Usage : node check-active.mjs
 */
import fs from 'node:fs';

const FICHIER = 'src/styles/patterns.css';
const ACTIF = /\.is-active\b|\.is-selected\b|\[aria-selected="true"\]|\[aria-current|\[aria-pressed="true"\]|\.ds-icon-btn--accent\b/;
const MARQUE_INTERDITE = /var\(--(primary|primary-readable|brand-from|brand-via|brand-to|ring|foreground|text-secondary|text-muted|muted-foreground)\)/;
const FILL_DE_MARQUE = /background:\s*var\(--(brand-gradient|brand-gradient-diagonal|primary)\)/;

/* ---------- l'analyse : une règle = un sélecteur + ses déclarations ---------- */
function regles(css) {
  const sans = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  /* Les blocs @media : on lit leur contenu comme le reste — une règle d'actif sous un
     media query est une règle d'actif. */
  const plat = sans.replace(/@media[^{]*\{([\s\S]*?)\}\s*(?=\n|$)/g, (m, inner) => inner);
  for (const m of plat.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selecteur = m[1].trim(); const corps = m[2].trim();
    if (!selecteur || selecteur.startsWith('@')) continue;
    out.push({ selecteur, corps });
  }
  return out;
}

function fautes(css) {
  const erreurs = [];
  for (const { selecteur, corps } of regles(css)) {
    /* Une liste de sélecteurs est active si L'UN de ses membres l'est — la règle vaut
       alors pour tous, puisqu'ils partagent le corps. */
    const membres = selecteur.split(',').map(x => x.trim());
    if (!membres.some(x => ACTIF.test(x))) continue;
    const decl = (nom) => { const r = new RegExp(`(?:^|;)\\s*${nom}\\s*:\\s*([^;]+)`); const x = r.exec(corps); return x ? x[1].trim() : null; };
    const color = decl('color');
    if (color !== null) {
      const fill = FILL_DE_MARQUE.test(corps);
      const ok = color === 'var(--active)' || (fill && color === 'var(--primary-foreground)');
      if (!ok) erreurs.push(`${selecteur}  ->  color:${color}  (attendu var(--active))`);
    }
    for (const prop of ['border-color', 'box-shadow', 'outline-color']) {
      const v = decl(prop);
      if (v !== null && MARQUE_INTERDITE.test(v)) erreurs.push(`${selecteur}  ->  ${prop}:${v}  (un contour d'actif est var(--active))`);
    }
  }
  return erreurs;
}

/* ---------- le jumeau de falsification — rejoué à chaque appel ---------- */
const CAS = [
  ['.x.is-active{color:var(--primary)}', 1],
  ['.x.is-active{color:var(--primary-readable);font-weight:600}', 1],
  ['.x[aria-selected="true"]{background:var(--accent);color:var(--foreground)}', 1],
  ['.x[aria-current="page"]{color:var(--foreground)}', 1],
  ['.x.is-selected{color:var(--active);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--primary) 45%,transparent)}', 1],
  ['.x.is-active{border-color:var(--primary);color:var(--active)}', 1],
  ['.y,.x.is-active{color:var(--text-muted)}', 1],
  ['@media (max-width:64rem){.x.is-active{color:var(--primary)}}', 1],
  ['.x.is-active{color:var(--active)}', 0],
  ['.x.is-active{color:var(--active);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--active) 45%,transparent)}', 0],
  ['.x.is-active{transform:translateY(1px)}', 0],
  ['.x:active:not(:disabled){color:var(--primary)}', 0],
  ['.x:hover,.x.is-hover{color:var(--foreground)}', 0],
  ['.x.is-selected{background:var(--brand-gradient);color:var(--primary-foreground)}', 0],
  ['/* .x.is-active{color:var(--primary)} */ .x{color:var(--foreground)}', 0],
  ['.x.is-active{background:var(--card);color:var(--active);box-shadow:var(--shadow-sm)}', 0],
];
const rates = CAS.filter(([css, n]) => fautes(css).length !== n);
if (rates.length) {
  console.error(`\n✗ actif — le garde ne se reconnaît plus lui-même (${rates.length} cas sur ${CAS.length}) :\n`);
  for (const [css, n] of rates) console.error(`    attendu ${n} faute(s) :  ${css}\n      obtenu : ${JSON.stringify(fautes(css))}`);
  console.error('\n  Un motif qui ne reconnaît plus rien rend le garde toujours vert, donc décoratif. Refus.\n');
  process.exit(1);
}

/* ---------- le scan ---------- */
const css = fs.readFileSync(FICHIER, 'utf8');
const erreurs = fautes(css);
const actives = regles(css).filter(r => r.selecteur.split(',').some(x => ACTIF.test(x.trim()))).length;
if (erreurs.length) {
  console.error(`\n✗ actif — ${FICHIER} : ${erreurs.length} règle(s) d'état actif colorée(s) autrement qu'avec --active :\n`);
  for (const e of erreurs) console.error('    · ' + e);
  console.error(`
  La règle : tout ce qui est actif — icône, texte, libellé d'onglet, contour, page
  courante — lit UN jeton, --active. Ni --primary, ni --primary-readable, ni l'encre.
  Si la valeur de --active ne tient pas 4,5:1 sur cette porteuse, c'est un écart que la
  MARQUE assume par écrit (@a11y-assume) — pas une raison de changer de jeton ici.\n`);
  process.exit(1);
}
console.log(`✓ actif — ${actives} règles d'état actif dans ${FICHIER}, toutes en --active · garde prouvé sur ${CAS.length} cas`);
