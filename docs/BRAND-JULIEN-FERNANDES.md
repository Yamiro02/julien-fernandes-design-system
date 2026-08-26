# La marque Julien Fernandes — l'instance de référence

Depuis la **v0.5.0**, ce dépôt est un **template**. Sa marque par défaut est un placeholder
gris (`brand-acme.css`), et la marque Julien Fernandes est devenue **une instance parmi
d'autres** — livrée dans le paquet, à titre d'exemple complet et de non-régression.

Ce document consigne ses réglages pour qu'ils se rejouent en une heure, et pour qu'aucune
décision prise entre la v0.1.0 et la v0.4.1 ne se perde dans un fichier qu'on pourrait
supprimer un jour.

---

## 1. Comment la monter

```
@import "@julienfernandes/ds/core.css";
@import "@julienfernandes/ds/brand-jf.css";
```

**Et pas `styles.css`** : cette entrée-là livre le placeholder. C'est le seul changement
que la v0.5.0 impose aux apps existantes — une ligne, et le montage devient explicite au
lieu d'être silencieux.

La vitrine se lance sur cette marque avec :

```bash
npm run demo:jf
```

---

## 2. Les réglages, en un coup d'œil

| | Valeur |
|---|---|
| **Familles** | Anton (display) · DM Sans (texte, UI) · JetBrains Mono (code) |
| **Régime de titrage** | `--heading-transform: uppercase` · `--heading-weight: var(--weight-regular)` |
| **Surfaces claires** | `--background #f6f2ec` · `--card #faf7f2` · `--secondary #ffffff` |
| **Surfaces sombres** | `--background #1f1e1c` · `--card #2b2a28` · `--secondary #2b2a28` |
| **Pas de surface** | `--surface-alt #f6ede2` clair · `#31302e` sombre |
| **Marque** | `--primary #e85d2f` · dégradé `#f5a524 → #f08029 → #e84c3d` |
| **Jumeaux lisibles** | `--primary-readable #b23a1c` clair · `#f0916b` sombre |
| **Neutres nommés** | `--tone-dark #1f1e1c` · `--tone-light #f6f2ec` |
| **Identité textuelle** | `Julien Fernandes` · `JF` · `['Julien','Fernandes']` |

Le pan **métier** — vignettes YouTube, cartes motion — est dans le bloc optionnel de
`brand-jf.css` et demande `brand-content.css` en face.

---

## 3. Les décisions qui ne se redéduisent pas

Celles qui ont coûté une mesure ou un diagnostic, et qu'un futur lecteur refera sinon.

**Le régime de titrage vient d'Anton, pas d'un goût.** Anton est une condensée à capitales
qui ne livre **qu'une graisse, 400**. `uppercase` + `var(--weight-regular)` n'est donc pas
un parti pris esthétique, c'est la seule façon d'employer cette face. Une grotesque
classique voudrait `none` + `var(--weight-bold)`. C'est pour ça que ces deux jetons
appartiennent à la marque : ils découlent de la face.

**`--surface-alt` est calé sur un écart de luminance, pas sur une teinte.** 1,084 en clair,
1,088 en sombre — le même pas de surface dans les deux thèmes. En v0.4, le rôle vivait sur
`--accent`, qui avait dû être neutralisé au niveau de `--card` en sombre : les survols y
étaient strictement invisibles, écart 1,000.

**`--primary` n'est jamais une couleur de texte.** Le corail mesure 3,12 sur `--background` :
c'était la couleur de tous les liens. `--primary-readable` est le même corail, rendu
lisible — ≥ 4,5:1 sur les six surfaces, dans les deux thèmes.

**Les écarts d'accessibilité assumés sont dans `brand-jf.css`**, en blocs `@a11y-assume:`,
et argumentés dans [`accessibilite.md`](accessibilite.md) : le blanc sur les aplats chauds,
le dégradé clippé en texte, les frontières neutres douces. Douze paires, chacune avec son
remède chiffré si un projet ne peut pas les assumer.

**Le noir pur n'existe que dans les ombres `.dark` et `--tone-deep`.** Partout ailleurs, la
teinte suit `--tone-dark`.

**Le blanc pur `--secondary` est réservé, en clair, aux contrôles posés à même le layout** —
bouton secondaire, navbar, barre d'onglets, recherche, champs. Jamais un fond de page,
jamais une carte.

---

## 4. Refaire la mesure

```bash
TOKENS=src/styles/brand-jf.css node check-contrast.mjs
```

```bash
TOKENS=src/styles/brand-jf.css node check-contrast.mjs --table
```

---

## 5. Les fichiers

| | |
|---|---|
| `src/styles/brand-jf.css` | la marque : jetons, `@font-face`, écarts assumés |
| `demo/brand-jf-entry.css` | le montage de la vitrine sur cette marque |
| `assets/logo/` · `src/styles/assets/fonts/` | les exports PNG et les `.woff2` auto-hébergés |
| `docs/accessibilite.md` | les ratios mesurés et les écarts assumés |
