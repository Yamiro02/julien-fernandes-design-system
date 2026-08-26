#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════════
 * REBRAND — renomme le paquet, l'identité textuelle et le fichier de marque, en une
 * commande. C'est le geste 1 de GETTING-STARTED, celui qui prend une minute.
 * ══════════════════════════════════════════════════════════════════════════════
 *
 *   npm run rebrand -- "@monscope/ds" "Ma Marque"
 *   npm run rebrand -- "@monscope/ds" "Ma Marque" --monogram MM
 *
 * Ce qu'il touche :
 *   · le nom du paquet dans package.json et demo/package.json
 *   · toutes les références au nom courant dans le code, le CSS et les configs
 *   · src/brand.ts — nom, monogramme, lignes du mot-marque
 *   · src/styles/brand-<votre-marque>.css, COPIÉ depuis la palette de placeholder
 *   · src/styles/index.css, REPOINTÉ vers ce nouveau fichier
 *
 * CE DERNIER GESTE EST LE PLUS IMPORTANT. Sans lui, quelqu'un qui copie le dossier,
 * rebrande, et oublie de changer l'import livrerait la palette de quelqu'un d'autre —
 * exactement le silence que ce dépôt élimine partout ailleurs.
 *
 * Ce qu'il NE touche PAS, et c'est volontaire, ce sont des choix de design :
 *   · les valeurs de la palette → à remplir dans le fichier qu'il vient de créer
 *   · les polices et le régime de titrage → même fichier
 *   · le préfixe de classes `ds-` → déjà générique, aucune raison d'en changer
 *
 * IDEMPOTENT. Relancé, il ne fait rien de plus : il lit le nom COURANT dans package.json
 * plutôt que de supposer un point de départ, et il ne recopie pas une palette déjà
 * créée — sinon il écraserait le travail de la personne qui l'a remplie.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.html', '.md']);
const SKIP = new Set(['node_modules', 'dist', '.git', '.claude']);

const args = process.argv.slice(2);
const flagAt = args.indexOf('--monogram');
const monogramFlag = flagAt !== -1 ? args[flagAt + 1] : null;
/* `flagAt + 1` ne doit exclure un index que si le drapeau est réellement présent : sans ce
   garde-fou, flagAt = -1 ferait tomber le premier argument positionnel. */
const valueAt = flagAt === -1 ? -1 : flagAt + 1;
const positional = args.filter((a, i) => !a.startsWith('--') && i !== valueAt);
const [nextPkg, nextName] = positional;

if (!nextPkg || !nextName) {
  console.error(`
Usage :
  npm run rebrand -- "@monscope/ds" "Ma Marque" [--monogram MM]

  1er argument   nom npm du paquet   ex. @monscope/ds
  2e argument    nom de la marque    ex. "Ma Marque"
  --monogram     initiales (1 à 3 lettres). Déduit du nom si absent.
`);
  process.exit(1);
}

if (!/^(@[a-z0-9-]+\/)?[a-z0-9-]+$/.test(nextPkg)) {
  console.error(`✗ « ${nextPkg} » n'est pas un nom npm valide (minuscules, tirets, scope optionnel).`);
  process.exit(1);
}

const pkgPath = join(ROOT, 'package.json');
const currentPkg = JSON.parse(readFileSync(pkgPath, 'utf8')).name;

const monogram = (monogramFlag
  || nextName.split(/\s+/).map(w => w[0]).join('').slice(0, 3)
).toUpperCase();

const words = nextName.split(/\s+/);
const wordmarkLines = words.length === 2 ? words : [nextName];

/* Le nom de fichier de la marque : minuscules, tirets, sans accent. */
const slug = nextName.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const brandFile = `brand-${slug}.css`;

/* ── 1 · Références au paquet ─────────────────────────────────────────────── */
let touched = 0;
if (currentPkg !== nextPkg) {
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (SKIP.has(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (!EXT.has(extname(entry))) continue;
      const before = readFileSync(full, 'utf8');
      if (!before.includes(currentPkg)) continue;
      /* Le nom de la démo CONTIENT celui du paquet — `<pkg>-demo` : le remplacement de
         préfixe la renomme donc au passage, ce qui est exactement voulu. */
      const after = before.split(currentPkg).join(nextPkg);
      if (after !== before) { writeFileSync(full, after); touched++; }
    }
  })(ROOT);
}

/* ── 2 · Identité textuelle ───────────────────────────────────────────────── */
const brandTs = join(ROOT, 'src/brand.ts');
writeFileSync(brandTs, readFileSync(brandTs, 'utf8')
  .replace(/export const BRAND_NAME = .*;/, `export const BRAND_NAME = ${JSON.stringify(nextName)};`)
  .replace(/export const BRAND_MONOGRAM = .*;/, `export const BRAND_MONOGRAM = ${JSON.stringify(monogram)};`)
  .replace(/export const BRAND_WORDMARK_LINES: readonly string\[\] = .*;/,
           `export const BRAND_WORDMARK_LINES: readonly string[] = ${JSON.stringify(wordmarkLines)};`));

/* ── 3 · Le fichier de marque, et l'import qui pointe dessus ──────────────── */
const stylesDir = join(ROOT, 'src/styles');
const brandPath = join(stylesDir, brandFile);
const entry = join(stylesDir, 'index.css');
let brandCree = false;

if (!existsSync(brandPath)) {
  /* On copie la palette de PLACEHOLDER, pas le gabarit vide : la vitrine doit rendre
     immédiatement après un rebrand, avec le nouveau nom et une palette encore fade —
     c'est l'étape suivante de GETTING-STARTED de la remplacer. */
  const source = readFileSync(join(stylesDir, 'brand-acme.css'), 'utf8')
    .replace('MARQUE — PLACEHOLDER.                                        ✏️  À REMPLACER',
             `MARQUE — ${nextName.toUpperCase()}.${' '.repeat(Math.max(1, 40 - nextName.length))}✏️  À REMPLIR`);
  writeFileSync(brandPath, source);
  brandCree = true;
}

/* L'import de `styles.css` suit. C'est ce geste qui évite qu'un dossier rebrandé
   continue de livrer la palette d'origine sans que personne ne le voie. */
const avant = readFileSync(entry, 'utf8');
const apres = avant.replace(/@import '\.\/brand-[^']+\.css';/, `@import './${brandFile}';`);
const importRepointe = apres !== avant;
if (importRepointe) writeFileSync(entry, apres);

/* ── Compte rendu ─────────────────────────────────────────────────────────── */
const ligne = (ok, txt) => `${ok ? '✓' : '·'} ${txt}`;
console.log(`
${ligne(currentPkg !== nextPkg, `Paquet     ${currentPkg}  →  ${nextPkg}${touched ? `      (${touched} fichier${touched > 1 ? 's' : ''})` : '      (déjà à ce nom)'}`)}
${ligne(true, `Marque     ${nextName}`)}
${ligne(true, `Monogramme ${monogram}`)}
${ligne(true, `Wordmark   ${JSON.stringify(wordmarkLines)}`)}
${ligne(brandCree, `Palette    src/styles/${brandFile}${brandCree ? '   (copiée du placeholder)' : '   (existe déjà — non écrasée)'}`)}
${ligne(importRepointe, `Import     styles.css → ./${brandFile}${importRepointe ? '' : '   (pointait déjà dessus)'}`)}

Il reste les choix de design — le script ne peut pas les faire à votre place. TOUT est
dans le fichier de marque, aucun fichier du socle à ouvrir :

  src/styles/${brandFile}
    1. la palette                        (elle est encore en placeholder)
    2. les @font-face et les 3 familles  --font-display / -body / -mono
    3. le régime de titrage              --heading-transform / --heading-weight
    4. le relief de marque               --shadow-glow* / --shadow-logo-dot

Puis :  node check-contrast.mjs      mesure VOTRE palette, et refuse une paire sous seuil
        npm run demo                 http://localhost:5273
`);
