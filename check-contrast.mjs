/**
 * Filet WCAG — le contraste du système, MESURÉ, à chaque `npm run lint`.
 *
 * LE DÉFAUT QU'IL FERME. `docs/accessibilite.md` liste des ratios. Un document qui
 * porte des nombres ment dès la première valeur de jeton qui bouge, et personne ne
 * le voit : rien dans `tsc`, dans tsup ni dans Vite ne calcule un contraste. Le
 * chantier v0.5.0 a trouvé le corail des liens à 3,12 sur --background — la couleur
 * de TOUT le texte cliquable — dans un dépôt qui passait ses quatre commandes au vert.
 *
 * POURQUOI IL COMPTE POUR UN TEMPLATE. Le socle ne porte plus aucune couleur : elles
 * viennent du fichier de marque, que le CLIENT écrit. Ce contrôle lit ce fichier-là.
 * Un client qui pose sa palette et casse une paire l'apprend de son build, pas de son
 * audit d'accessibilité six mois plus tard.
 *
 * LA RÈGLE. Toute paire contenu/porteuse doit tenir son seuil — 4,5:1 pour du texte
 * courant (WCAG 2.2 AA, 1.4.3), 3:1 pour du gros texte, une icône ou un contour de
 * contrôle (1.4.11). Une paire qui échoue DOIT être déclarée `@a11y-assume:` DANS LE
 * FICHIER DE MARQUE, avec sa raison, et reprise dans `docs/accessibilite.md`. Sinon le
 * build tombe. Le script porte la mécanique, la marque porte ses renoncements.
 *
 * Usage : node check-contrast.mjs [--table]
 * Il mesure la marque que `styles.css` MONTE — il lit son `@import`, il ne la devine pas.
 * Un dossier rebrandé mesure donc la palette du client, pas celle du template.
 * TOKENS=<chemin> en mesure une autre : c'est ainsi qu'on recette l'instance de référence,
 * la palette de recette, ou celle d'un client avant de l'installer.
 */
import fs from 'node:fs';

/* ---------- WCAG ---------- */
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = h => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, alpha, bg) => { const f = hex(fg), b = hex(bg);
  return '#' + f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, '0')).join(''); };

/* ---------- lecture des jetons ---------- */
/* La marque mesurée par défaut est celle que `styles.css` MONTE — lue dans son @import,
   pas codée en dur. Sans ça, un dossier rebrandé continuerait de mesurer la palette de
   placeholder pendant que la vitrine rend celle du client : une paire qui fait échouer
   son audit passerait au vert. */
function marqueParDéfaut() {
  const entry = 'src/styles/index.css';
  try {
    const m = /@import\s+'\.\/(brand-[^']+\.css)'/.exec(
      fs.readFileSync(entry, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''));
    if (m) return 'src/styles/' + m[1];
  } catch { /* pas d'entrée lisible : on retombe sur le placeholder */ }
  return 'src/styles/brand-acme.css';
}
const TOKENS = process.env.TOKENS || marqueParDéfaut();
const brut = fs.readFileSync(TOKENS, 'utf8');
const src = brut.replace(/\/\*[\s\S]*?\*\//g, '');
const block = sel => { const i = src.indexOf(sel + '{');
  if (i < 0) throw new Error(`${TOKENS} : bloc ${sel} introuvable`);
  const s = src.slice(i + sel.length + 1); let d = 1, j = 0;
  while (d > 0) { if (s[j] === '{') d++; if (s[j] === '}') d--; j++; }
  return s.slice(0, j - 1); };
const parse = t => Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
const ROOT = parse(block(':root')), DARK = parse(block('.dark'));

function resolve(v, scope, d = 0) {
  if (d > 12) throw new Error('référence circulaire : ' + v);
  v = String(v).trim();
  let m = /^var\((--[\w-]+)\)$/.exec(v);
  if (m) { const next = scope[m[1]] ?? ROOT[m[1]];
    if (next === undefined) throw new Error(`${TOKENS} : jeton ${m[1]} absent du contrat`);
    return resolve(next, scope, d + 1); }
  m = /^color-mix\(in srgb,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/.exec(v);
  if (m) { const a = resolve(m[1], scope, d + 1), p = +m[2] / 100, b = m[3].trim();
    return b === 'transparent' ? { c: a, alpha: p } : over(a, p, resolve(b, scope, d + 1)); }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
  if (m) { const h = '#' + [1, 2, 3].map(i => (+m[i]).toString(16).padStart(2, '0')).join('');
    return m[4] !== undefined ? { c: h, alpha: +m[4] } : h; }
  return v;
}

/* ---------- les paires du système ---------- */
// [zone, règle, contenu, porteuse, seuil, taille]
// `on(jeton, porteuse)` aplatit un fond translucide sur sa surface porteuse.
function pairs(theme) {
  const scope = theme === 'dark' ? { ...ROOT, ...DARK } : ROOT;
  const g = n => resolve(`var(${n})`, scope);
  const on = (n, carrier) => { const v = g(n); return typeof v === 'object' ? over(v.c, v.alpha, g(carrier)) : v; };
  const B = '--background', C = '--card', P = [];
  const add = (zone, regle, fg, bg, min, taille) => P.push({ zone, regle, fg, bg, min, taille, r: ratio(fg, bg) });
  const softAlpha = theme === 'dark' ? [.14, .10] : [.08, .06];

  add('Texte', 'texte courant sur --background', g('--foreground'), g(B), 4.5, '16 / 400');
  add('Texte', 'texte courant sur --card', g('--foreground'), g(C), 4.5, '16 / 400');
  add('Texte', '--text-secondary sur --card', g('--text-secondary'), g(C), 4.5, '16 / 400');
  add('Texte', '.caption — --text-muted sur --card', g('--text-muted'), g(C), 4.5, '13 / 500');
  add('Texte', '.ds-input::placeholder', g('--text-muted'), g('--secondary'), 4.5, '15 / 400');
  add('Texte', '.ds-tooltip__bubble', theme === 'light' ? g('--text-inverted') : g('--tone-dark'),
                                      theme === 'light' ? g('--tone-dark') : g('--tone-light-alt'), 4.5, '13 / 600');

  add('Lien', 'a{} au repos sur --background', g('--primary-readable'), g(B), 4.5, '16 / 400');
  add('Lien', 'a{} au repos sur --card', g('--primary-readable'), g(C), 4.5, '16 / 400');
  add('Lien', 'a:hover — dérivé vers --foreground', over(g('--primary-readable'), .8, g('--foreground')), g(B), 4.5, '16 / 400');

  add('Marque-contenu', '.ds-navlink.is-active', g('--primary-readable'), g('--secondary'), 4.5, '16 / 500');
  add('Marque-contenu', '.ds-sidenav.is-active', g('--primary-readable'), g('--surface-alt'), 4.5, '15 / 500');
  add('Marque-contenu', '.ds-badge--accent', g('--primary-readable'), g('--accent'), 4.5, '12 / 700');
  add('Marque-contenu', '.ds-banner--info', g('--primary-readable'), g('--accent'), 4.5, '15 / 400');
  add('Marque-contenu', '.ds-cal__day.is-today', g('--primary-readable'), g(C), 4.5, '14 / 700');
  add('Marque-contenu', '.ds-pastille--brand — icône', g('--primary-readable'), over(g('--brand-from'), softAlpha[0], g(C)), 3, 'icône');
  add('Marque-contenu', '.ds-icon-btn[aria-pressed] — icône', g('--primary-readable'), g('--accent'), 3, 'icône');
  add('Marque-contenu', '.ds-error', g('--destructive-readable'), g(C), 4.5, '13 / 500');
  add('Marque-contenu', '.ds-dropdown__item--danger', g('--destructive-readable'), g('--popover'), 4.5, '14 / 400');
  add('Marque-contenu', '.ds-actionsheet__item--danger', g('--destructive-readable'), g('--popover'), 4.5, '15 / 500');

  for (const n of ['coral', 'amber', 'danger', 'warning', 'success', 'neutral']) {
    add('Pill', `.ds-badge--${n} sur --card`, g(`--pill-${n}-fg`), on(`--pill-${n}-bg`, C), 4.5, '12 / 700');
    add('Pill', `.ds-badge--${n} sur --background`, g(`--pill-${n}-fg`), on(`--pill-${n}-bg`, B), 4.5, '12 / 700');
  }
  add('Pill', '.ds-badge--outline', g('--text-secondary'), g(C), 4.5, '12 / 700');

  add('Surface', 'survol — --foreground sur --surface-alt', g('--foreground'), g('--surface-alt'), 4.5, '15 / 600');

  add('Marque-aplat', '.ds-btn--primary — label sur --primary à plat', g('--primary-foreground'), g('--primary'), 4.5, '15 / 600');
  add('Marque-aplat', '.ds-btn--primary — label sur --brand-from (pire arrêt)', g('--primary-foreground'), g('--brand-from'), 4.5, '15 / 600');
  add('Marque-aplat', '.ds-btn--primary — label sur --brand-via', g('--primary-foreground'), g('--brand-via'), 4.5, '15 / 600');
  add('Marque-aplat', '.ds-btn--primary — label sur --brand-to', g('--primary-foreground'), g('--brand-to'), 4.5, '15 / 600');
  add('Marque-aplat', '.ds-btn--danger — label sur --destructive', g('--destructive-foreground'), g('--destructive'), 4.5, '15 / 600');
  add('Marque-aplat', '.ds-cal__day.is-selected', g('--primary-foreground'), g('--primary'), 4.5, '14 / 600');
  add('Marque-aplat', '.eyebrow / .accent — dégradé clippé en texte', g('--brand-from'), g(B), 4.5, '12 / 600');

  add('Non-texte', 'anneau de focus --ring sur --background', g('--ring'), g(B), 3, 'contour 2px');
  add('Non-texte', '.ds-choice coché — aplat --primary', g('--primary'), g(B), 3, 'contrôle');
  add('Non-texte', '.ds-switch actif — piste --primary', g('--primary'), g(B), 3, 'contrôle');
  add('Non-texte', '.ds-progress__bar sur son rail', g('--primary'), g('--surface-alt'), 3, 'graphique');
  add('Non-texte', '.ds-input.is-error — bordure --destructive', g('--destructive'), g('--secondary'), 3, 'contour 1.5px');
  add('Non-texte', '.ds-input — bordure --input vs page', g('--input'), g(B), 3, 'contour 1.5px');
  add('Non-texte', '.ds-input — bordure --input vs remplissage', g('--input'), g('--secondary'), 3, 'contour 1.5px');
  add('Non-texte', '.ds-input — remplissage vs page', g('--secondary'), g(B), 3, 'aplat');
  add('Non-texte', '.ds-card — bordure --border vs page', g('--border'), g(B), 3, 'contour 1px');
  add('Non-texte', '.ds-sep — filet --border sur --card', g('--border'), g(C), 3, 'filet 1px');
  return P;
}

/* ---------- les écarts ASSUMÉS ----------
   Ils ne sont PAS ici. Ils appartiennent à la MARQUE, pas au socle : les renoncements
   de Julien ne sont pas ceux d'un client, et un client qui apporte son brand-acme.css
   ne doit hériter d'aucune dérogation qu'il n'a pas prise — sans quoi une paire qui le
   fait échouer à son audit passerait au vert chez lui.
   Ce script porte la MÉCANIQUE ; le fichier de marque porte ses RENONCEMENTS, sous
   forme de blocs de commentaire lus ici :

       /* @a11y-assume: <clé exacte de la paire>
          <la raison, sur autant de lignes qu'il faut> * /

   Une liste vide est un état normal — et même l'état de départ de brand.template.css. */
const ASSUMÉES = Object.fromEntries(
  [...brut.matchAll(/@a11y-assume:[ \t]*(.+?)[ \t]*\r?\n([\s\S]*?)\*\//g)]
    .map(m => [m[1].trim(), m[2].replace(/\s+/g, ' ').trim()]));

/* ---------- rapport ---------- */
const F = n => n.toFixed(2).replace('.', ',');
const light = pairs('light'), dark = pairs('dark');
const rows = light.map((p, i) => ({ ...p, rl: p.r, rd: dark[i].r,
  ko: p.r < p.min || dark[i].r < dark[i].min }));

if (process.argv.includes('--table')) {
  const md = sel => { const out = ['| Paire | contenu | seuil | clair | sombre |', '|---|---|--:|--:|--:|'];
    for (const p of rows.filter(sel)) out.push(
      `| \`${p.regle}\` | ${p.taille} | ${String(p.min).replace('.', ',')} | ${F(p.rl)}${p.rl < p.min ? ' ✗' : ''} | ${F(p.rd)}${p.rd < p.min ? ' ✗' : ''} |`);
    return out.join('\n'); };
  console.log('<!-- CONFORMES -->\n' + md(p => !p.ko));
  console.log('\n<!-- ASSUMÉES -->\n' + md(p => p.ko));
  process.exit(0);
}

const nonDéclarées = rows.filter(p => p.ko && !(p.regle in ASSUMÉES));
const périmées = rows.filter(p => !p.ko && (p.regle in ASSUMÉES));

if (nonDéclarées.length) {
  console.error(`\n✗ contraste — ${nonDéclarées.length} paire(s) sous le seuil sans décision écrite (${TOKENS}) :\n`);
  for (const p of nonDéclarées) console.error(
    `    ${p.regle}\n      contenu ${p.taille} · seuil ${p.min}:1 · clair ${F(p.rl)} · sombre ${F(p.rd)}`);
  console.error(`
  Deux issues, pas trois :
    · corriger le jeton fautif — c'est presque toujours une couleur de REMPLISSAGE
      (--primary, --destructive) posée comme couleur de CONTENU. Le socle a un jumeau
      lisible pour ça : --primary-readable, --destructive-readable ;
    · ou ASSUMER l'écart : ajouter dans ${TOKENS}, en commentaire, le bloc

          /* @a11y-assume: <la clé exacte ci-dessus>
             <pourquoi la marque impose cet écart, et ce qui l'atténue> */

      et le reprendre dans docs/accessibilite.md. Un écart assumé est une décision écrite.
`);
  process.exit(1);
}
for (const p of périmées) console.warn(
  `⚠ contraste — « ${p.regle} » passe désormais (${F(p.rl)} / ${F(p.rd)}) : retire son @a11y-assume de ${TOKENS} et sa section de docs/accessibilite.md.`);
console.log(`✓ contraste — ${rows.length} paires × 2 thèmes · ${rows.length - rows.filter(p => p.ko).length} conformes · ${rows.filter(p => p.ko).length} écarts assumés et documentés`);
