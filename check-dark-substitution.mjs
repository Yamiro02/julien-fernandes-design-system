/**
 * Filet anti-SUBSTITUTION FIGÉE entre `:root` et `.dark`.
 *
 * LE DÉFAUT QU'IL FERME. Un jeton dont la valeur contient `var(Y)` est substitué sur
 * l'élément où il est DÉCLARÉ, pas sur celui où il est employé — puis le résultat, déjà
 * résolu, est hérité. Un jeton déclaré en `:root` seulement, dont la valeur référence un
 * jeton qui, lui, change en `.dark`, fige donc la valeur CLAIRE et l'emporte telle quelle
 * dans toute section sombre.
 *
 *     :root { --muted-foreground:#6b6966;
 *             --pill-neutral-bg: color-mix(in srgb, var(--muted-foreground) 12%, transparent) }
 *     .dark { --muted-foreground:#b0aea9 }        <-- --pill-neutral-bg n'est pas redéclaré
 *
 *     <div class="dark">  ->  --pill-neutral-bg vaut encore le mix du gris CLAIR.
 *
 * Ni erreur, ni avertissement : la variable existe, elle a une valeur, elle est simplement
 * fausse. Rien dans `tsc`, dans tsup, dans Vite ni dans check-contrast.mjs ne peut la voir.
 *
 * CE QUE LA VITRINE NE PEUT PAS MONTRER — l'apprentissage qui a coûté le diagnostic.
 * Quand `.dark` est posé sur `<html>`, `:root` et `.dark` matchent LE MÊME ÉLÉMENT : la
 * substitution s'y fait contre les valeurs sombres et tout est correct. Le défaut n'existe
 * QUE dans une section `.dark` IMBRIQUÉE au milieu d'une page claire. La vitrine bascule
 * `<html>`, donc la vitrine ne l'a jamais montré et ne le montrera jamais. Aucune recette
 * visuelle ne remplace ce contrôle. Trouvé au sous-lot 2 en comparant un ratio calculé à un
 * ratio lu au `getComputedStyle` : ils divergeaient d'exactement 1,0.
 *
 * LA RÈGLE. Tout jeton déclaré en `:root` dont la valeur contient `var(Y)`, où Y est
 * redéclaré en `.dark`, DOIT être redéclaré en `.dark` lui aussi — la même expression suffit,
 * ce qui compte est l'élément porteur. La dépendance est TRANSITIVE : si A vaut var(B) et
 * que B devient sensible au thème, A l'est aussi.
 *
 * NB — la règle ne regarde PAS si les deux valeurs de Y diffèrent aujourd'hui. `--primary`
 * vaut la même chose dans les deux thèmes chez Julien ; rien ne dit qu'il en ira de même
 * chez le client qui apportera son fichier de marque. Le contrôle est volontairement strict.
 *
 * Usage : node check-dark-substitution.mjs   (STYLES=<dossier> pour un autre arbre de styles)
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.env.STYLES || 'src/styles';

/* Les écarts TOLÉRÉS. Chaque entrée est une dette datée, pas une dispense.
   Une entrée qui n'a plus de raison d'être doit disparaître avec son jeton. */
const EXCEPTIONS = {
  '--shadow-soft': 'porte bien le défaut — SUPPRIMÉ AU SOUS-LOT 5 (alias non publié de --shadow-sm). Ne pas le réparer : le retirer. L\'exception meurt avec lui.',
  '--shadow-soft-lg': 'porte bien le défaut — SUPPRIMÉ AU SOUS-LOT 5 (alias non publié de --shadow-lg). Ne pas le réparer : le retirer. L\'exception meurt avec lui.',
};

/* ---------- lecture ---------- */
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith('.css')) files.push(p);
  }
})(DIR);

// `.dark .jf-x{` ne matche pas : entre le sélecteur et `{` il n'y a que des blancs.
const SELECTOR = /(:root|\.dark)\s*\{/g;
const ROOT = new Map(), DARK = new Map();   // jeton -> [{valeur, fichier}]
let nRoot = 0, nDark = 0;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  SELECTOR.lastIndex = 0;
  let m;
  while ((m = SELECTOR.exec(src))) {
    const s = src.slice(SELECTOR.lastIndex);
    let d = 1, j = 0;
    while (d > 0 && j < s.length) { if (s[j] === '{') d++; if (s[j] === '}') d--; j++; }
    const body = s.slice(0, j - 1);
    const into = m[1] === ':root' ? ROOT : DARK;
    if (m[1] === ':root') nRoot++; else nDark++;
    for (const dcl of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      if (!into.has(dcl[1])) into.set(dcl[1], []);
      into.get(dcl[1]).push({ valeur: dcl[2].trim(), fichier: f });
    }
  }
}

/* ---------- le garde-fou du garde-fou ---------- */
if (nRoot === 0 || nDark === 0 || ROOT.size === 0 || DARK.size === 0) {
  console.error(`
✗ substitution — le contrôle n'a rien à contrôler, ce qui est un ÉCHEC, pas un succès.
    dossier scanné : ${DIR}   fichiers .css : ${files.length}
    blocs :root : ${nRoot} (${ROOT.size} jetons)   blocs .dark : ${nDark} (${DARK.size} jetons)
  Un thème sombre déclaré autrement qu'en \`.dark{…}\` — media query, attribut, autre classe —
  rend ce contrôle aveugle : il passerait au vert sur un dépôt entièrement cassé. Adapte le
  script au nouveau porteur de thème, ne le laisse pas vert à vide.
`);
  process.exit(1);
}

/* ---------- sensibilité au thème, transitive ---------- */
const sensibles = new Set(DARK.keys());
for (let change = true; change;) {
  change = false;
  for (const [nom, decls] of ROOT) {
    if (sensibles.has(nom)) continue;
    for (const d of decls)
      for (const r of d.valeur.matchAll(/var\((--[\w-]+)\)/g))
        if (sensibles.has(r[1])) { sensibles.add(nom); change = true; }
  }
}

/* ---------- violations ---------- */
const violations = [];
for (const [nom, decls] of ROOT) {
  if (DARK.has(nom)) continue;
  for (const d of decls) {
    const refs = [...d.valeur.matchAll(/var\((--[\w-]+)\)/g)]
      .map(r => r[1]).filter(y => sensibles.has(y));
    if (refs.length) { violations.push({ nom, ...d, refs: [...new Set(refs)] }); break; }
  }
}

const dures = violations.filter(v => !(v.nom in EXCEPTIONS));
const tolérées = violations.filter(v => v.nom in EXCEPTIONS);
const périmées = Object.keys(EXCEPTIONS).filter(n => !violations.some(v => v.nom === n));

if (dures.length) {
  console.error(`\n✗ substitution — ${dures.length} jeton(s) figent la valeur CLAIRE dans une section .dark imbriquée :\n`);
  for (const v of dures) {
    console.error(`    ${v.nom}   (${v.fichier})`);
    console.error(`      valeur     : ${v.valeur}`);
    for (const y of v.refs) {
      const l = ROOT.get(y)?.[0]?.valeur ?? '(non déclaré en :root)';
      const dk = DARK.get(y)?.[0]?.valeur ?? '(sensible par transitivité)';
      console.error(`      dépend de  : ${y}   clair ${l}   sombre ${dk}`);
    }
    console.error('');
  }
  console.error(`  Correctif : redéclarer le jeton dans le bloc \`.dark\`, la MÊME EXPRESSION suffit —
  ce qui compte est l'élément qui porte la déclaration, pas la valeur écrite.

      .dark{ ${dures[0].nom}:${dures[0].valeur}; }

  Ou, si le jeton est un alias en sursis : l'inscrire dans EXCEPTIONS de ce fichier AVEC la
  date de sa mort. Pas sans.
`);
  process.exit(1);
}
for (const v of tolérées) console.warn(`⚠ substitution — ${v.nom} toléré : ${EXCEPTIONS[v.nom]}`);
for (const n of périmées) console.warn(`⚠ substitution — l'exception ${n} ne correspond plus à aucune violation : retire-la d'EXCEPTIONS.`);
console.log(`✓ substitution — ${ROOT.size} jetons :root · ${DARK.size} jetons .dark · ${sensibles.size} sensibles au thème · aucun ne fige la valeur claire${tolérées.length ? ` (${tolérées.length} toléré${tolérées.length > 1 ? 's' : ''})` : ''}`);
