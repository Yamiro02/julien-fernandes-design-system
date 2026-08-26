# Accessibilité — le contraste du système, mesuré

> **Ce document ne s'écrit pas à la main.** Les deux tableaux sortent de
> `node check-contrast.mjs --table`, qui lit les valeurs réelles de
> `src/styles/brand-jf.css` — le fichier de MARQUE. Le même contrôle tourne à chaque
> `npm run lint` et **fait tomber le build** si une paire passe sous son seuil sans être
> déclarée.
>
> Cible : **WCAG 2.2 niveau AA**. 4,5:1 pour le texte courant (1.4.3) · 3:1 pour le gros
> texte, les icônes porteuses de sens et les contours de contrôle (1.4.11). Les fonds
> translucides — pilules, `--grad-soft` — sont compositéss sur leur surface porteuse
> avant mesure : c'est la couleur que l'œil reçoit, pas celle qui est écrite.
>
> **Un template, pas un design system.** Depuis le sous-lot 3 le socle ne porte plus AUCUNE
> couleur : elles viennent toutes du fichier de marque, que le client écrit. `TOKENS=<son
> fichier> node check-contrast.mjs` mesure SA palette. C'est le sens de ce document : un
> écart d'accessibilité doit être une décision écrite du concepteur, jamais une découverte
> faite par l'audit du client.

---

## 1. La règle qui est sortie de la mesure

**`--primary` et `--destructive` sont des couleurs de REMPLISSAGE. Elles ne sont jamais une
`color:`.**

C'est la cause unique de tous les échecs de texte trouvés en v0.4.1. Un corail conçu pour
tenir un aplat de bouton ne peut pas atteindre 4,5:1 comme texte sur une surface claire :
il mesurait **3,12 sur `--background`** — et c'était la couleur de **tous les liens** du
système, plus l'onglet de nav actif, le lien de sidebar actif, le badge accent, le bandeau
d'info, la date du jour du calendrier. Le rouge faisait de même à **3,40** sur les messages
d'erreur.

Le socle porte donc deux **jumeaux lisibles** :

| jeton | clair | sombre | garantie du contrat |
|---|---|---|---|
| `--primary-readable` | `#b23a1c` | `#f0916b` | ≥ 4,5:1 sur `--background`, `--card`, `--popover`, `--secondary`, `--accent`, `--surface-alt` |
| `--destructive-readable` | `#a32d2d` | `#ec8f8f` | idem |

Mesuré : **5,16 à 5,97** en clair et **5,62 à 7,11** en sombre pour le corail ; **6,34 à
7,07** et **6,07 à 7,05** pour le rouge. Le survol de lien ne demande pas de troisième
jeton : il se **dérive** en tirant le jumeau vers `--foreground`
(`color-mix(in srgb, var(--primary-readable) 80%, var(--foreground))`), ce qui ne peut
qu'**augmenter** le ratio — 6,76 en clair, 8,21 en sombre.

La règle se vérifie d'un grep, et c'est ce qui la rend tenable :

```bash
grep -rE '(^|[^-[:alnum:]])color:var\(--(primary|destructive)\)' src/styles/
```

Une sortie vide = la règle tient. Aujourd'hui : vide.

---

## 2. Les paires conformes

38 paires sur 50, dans les deux thèmes.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `texte courant sur --background` | 16 / 400 | 4,5 | 14,94 | 14,52 |
| `texte courant sur --card` | 16 / 400 | 4,5 | 15,59 | 12,50 |
| `--text-secondary sur --card` | 16 / 400 | 4,5 | 10,31 | 9,22 |
| `.caption — --text-muted sur --card` | 13 / 500 | 4,5 | 5,12 | 6,47 |
| `.jf-input::placeholder` | 15 / 400 | 4,5 | 5,47 | 6,47 |
| `.jf-tooltip__bubble` | 13 / 600 | 4,5 | 14,52 | 15,59 |
| `a{} au repos sur --background` | 16 / 400 | 4,5 | 5,36 | 7,11 |
| `a{} au repos sur --card` | 16 / 400 | 4,5 | 5,59 | 6,12 |
| `a:hover — dérivé vers --foreground` | 16 / 400 | 4,5 | 6,76 | 8,21 |
| `.jf-navlink.is-active` | 16 / 500 | 4,5 | 5,97 | 6,12 |
| `.jf-sidenav.is-active` | 15 / 500 | 4,5 | 5,16 | 5,63 |
| `.jf-badge--accent` | 12 / 700 | 4,5 | 5,16 | 5,62 |
| `.jf-banner--info` | 15 / 400 | 4,5 | 5,16 | 5,62 |
| `.jf-cal__day.is-today` | 14 / 700 | 4,5 | 5,59 | 6,12 |
| `.jf-pastille--brand — icône` | icône | 3 | 5,30 | 4,66 |
| `.jf-icon-btn[aria-pressed] — icône` | icône | 3 | 5,16 | 5,62 |
| `.jf-error` | 13 / 500 | 4,5 | 6,62 | 6,07 |
| `.jf-dropdown__item--danger` | 14 / 400 | 4,5 | 6,62 | 6,07 |
| `.jf-actionsheet__item--danger` | 15 / 500 | 4,5 | 6,62 | 6,07 |
| `.jf-badge--coral sur --card` | 12 / 700 | 4,5 | 4,90 | 5,32 |
| `.jf-badge--coral sur --background` | 12 / 700 | 4,5 | 4,69 | 6,15 |
| `.jf-badge--amber sur --card` | 12 / 700 | 4,5 | 4,99 | 5,35 |
| `.jf-badge--amber sur --background` | 12 / 700 | 4,5 | 4,82 | 6,22 |
| `.jf-badge--danger sur --card` | 12 / 700 | 4,5 | 5,47 | 5,22 |
| `.jf-badge--danger sur --background` | 12 / 700 | 4,5 | 5,28 | 6,00 |
| `.jf-badge--warning sur --card` | 12 / 700 | 4,5 | 4,79 | 4,89 |
| `.jf-badge--warning sur --background` | 12 / 700 | 4,5 | 4,59 | 5,60 |
| `.jf-badge--success sur --card` | 12 / 700 | 4,5 | 4,94 | 6,17 |
| `.jf-badge--success sur --background` | 12 / 700 | 4,5 | 4,75 | 7,14 |
| `.jf-badge--neutral sur --card` | 12 / 700 | 4,5 | 4,88 | 7,46 |
| `.jf-badge--neutral sur --background` | 12 / 700 | 4,5 | 4,70 | 8,78 |
| `.jf-badge--outline` | 12 / 700 | 4,5 | 10,31 | 9,22 |
| `survol — --foreground sur --surface-alt` | 15 / 600 | 4,5 | 14,38 | 11,50 |
| `anneau de focus --ring sur --background` | contour 2px | 3 | 3,12 | 8,16 |
| `.jf-choice coché — aplat --primary` | contrôle | 3 | 3,12 | 4,79 |
| `.jf-switch actif — piste --primary` | contrôle | 3 | 3,12 | 4,79 |
| `.jf-progress__bar sur son rail` | graphique | 3 | 3,00 | 3,79 |
| `.jf-input.is-error — bordure --destructive` | contour 1.5px | 3 | 3,80 | 3,78 |

---

## 3. Les écarts assumés

12 paires. Chacune est déclarée **dans le fichier de marque**, `src/styles/brand-jf.css`, par
un bloc `@a11y-assume:` — pas dans le script. Le script porte la mécanique, la marque porte ses
renoncements : un client qui apporte son `brand-acme.css` repart d'une liste VIDE et n'hérite
d'aucune dérogation qu'il n'a pas prise. Le build tombe si une **treizième** apparaît.

Pour mémoire, la palette de recette `demo/brand-test.css` — froide, sans un orange — n'en
déclare que **8**, et pas les mêmes : ses bleus tiennent le blanc là où le corail ne le tenait
pas, et elle a dû éclaircir ses remplissages de marque en thème sombre là où Julien n'en a pas
besoin. C'est la démonstration que la liste appartient bien à la marque.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `.jf-btn--primary — label sur --primary à plat` | 15 / 600 | 4,5 | 3,48 ✗ | 3,48 ✗ |
| `.jf-btn--primary — label sur --brand-from (pire arrêt)` | 15 / 600 | 4,5 | 2,04 ✗ | 2,04 ✗ |
| `.jf-btn--primary — label sur --brand-via` | 15 / 600 | 4,5 | 2,68 ✗ | 2,68 ✗ |
| `.jf-btn--primary — label sur --brand-to` | 15 / 600 | 4,5 | 3,80 ✗ | 3,80 ✗ |
| `.jf-btn--danger — label sur --destructive` | 15 / 600 | 4,5 | 3,80 ✗ | 3,80 ✗ |
| `.jf-cal__day.is-selected` | 14 / 600 | 4,5 | 3,48 ✗ | 3,48 ✗ |
| `.eyebrow / .accent — dégradé clippé en texte` | 12 / 600 | 4,5 | 1,83 ✗ | 8,16 |
| `.jf-input — bordure --input vs page` | contour 1.5px | 3 | 1,17 ✗ | 1,44 ✗ |
| `.jf-input — bordure --input vs remplissage` | contour 1.5px | 3 | 1,30 ✗ | 1,24 ✗ |
| `.jf-input — remplissage vs page` | aplat | 3 | 1,12 ✗ | 1,16 ✗ |
| `.jf-card — bordure --border vs page` | contour 1px | 3 | 1,17 ✗ | 1,44 ✗ |
| `.jf-sep — filet --border sur --card` | filet 1px | 3 | 1,22 ✗ | 1,24 ✗ |

### 3.1 · Le blanc sur les aplats de marque — `2,04` au pire point

**L'écart.** Le CTA primaire porte `--brand-gradient`. Son arrêt le plus clair, `--brand-from`
`#f5a524`, laisse le label blanc à **2,04:1** — moins de la moitié du seuil. À plat sur
`--primary` c'est 3,48 ; sur `--brand-to` 3,80. Le bouton danger et la date sélectionnée du
calendrier sont dans la même famille. Le label du bouton mesure **15 px / 600** : il ne
bénéficie **pas** du seuil « gros texte » de 3:1, qui commence à 18,66 px en gras.

**Pourquoi il est assumé.** C'est la marque. Une identité orange chaude ne peut pas porter
du blanc lisible : il faudrait assombrir le dégradé jusqu'au brun, c'est-à-dire cesser
d'être cette marque. Beaucoup d'identités chaudes font ce choix ; il devient acceptable
**à condition d'être écrit**.

**Ce qui l'atténue.** Le CTA n'est jamais le seul chemin vers une action : il porte un
libellé explicite, il est atteignable au clavier, son anneau de focus mesure 3,12:1 en
clair et 8,16:1 en sombre. Aucune information n'existe uniquement dans ce contraste.

**Le remède, si le client ne peut pas l'assumer** — un seul geste, mesuré :

| label | sur `#f5a524` | sur `#e85d2f` | sur `#e84c3d` |
|---|--:|--:|--:|
| `#ffffff` (actuel) | 2,04 | 3,48 | 3,80 |
| `--ink` `#1f1e1c` | **8,16** | **4,79** | 4,39 |

Passer `--primary-foreground` à `--ink` fait tenir le pire arrêt à 8,16. Le CTA devient un
bouton à label sombre sur dégradé chaud — c'est une décision d'identité, pas une correction
technique, d'où le fait qu'elle ne soit pas prise ici.

### 3.2 · Le dégradé clippé en texte — `1,83`

**L'écart.** `.eyebrow` (12 px / 600) et `.accent` clippent `--brand-gradient` dans le
texte. Sur `--background` clair, les trois arrêts mesurent **1,83** · **2,41** · **3,40**.
En sombre le même dégradé passe (8,16) : l'écart est un défaut du thème clair seul.

**Pourquoi il est assumé.** C'est **la signature** : un mot en dégradé par titre. La
corriger reviendrait à la supprimer. `.accent` s'emploie dans un H2 de 29 px — donc en
« gros texte », seuil 3:1 — et même là 1,83 ne passe pas ; `.eyebrow`, à 12 px, encore
moins. L'écart est donc réel dans les deux régimes et pleinement assumé.

**Ce qui l'atténue.** `.accent` marque **un mot d'un titre déjà lisible** ; `.eyebrow` est un
sur-titre décoratif qui **duplique** toujours une information portée par le titre en dessous.
Aucun des deux ne porte une information unique. Le socle ne les utilise nulle part pour un
libellé fonctionnel.

**Le remède.** Un `--brand-gradient-text` bâti sur `--primary-readable` plutôt que sur les
arrêts d'aplat, clippé par `.eyebrow` / `.accent`. Le mot reste en dégradé, il passe le
seuil. Non fait ici : cela change l'aspect de la signature, et c'est une décision du
concepteur de la marque.

### 3.3 · Les contours et filets neutres — `1,12` à `1,44`

**L'écart.** Aucune frontière neutre du système n'atteint 3:1. Le contour d'un champ mesure
**1,17** contre la page et **1,30** contre son propre remplissage ; le remplissage du champ
contre la page, **1,12**. Bordure de carte et filet de séparateur, même ordre. WCAG 1.4.11
demande 3:1 pour ce qui est nécessaire à **identifier un composant**.

**Pourquoi il est assumé.** Les neutres doux **sont** l'identité de ce système — crème
chaude, frontières à peine posées. Les remonter à 3:1 demande `#908c85` en clair et
`#747370` en sombre : des gris moyens francs, sur chaque carte, chaque tableau, chaque
séparateur et chaque champ. C'est un autre design.

**Ce qui l'atténue.** Un champ ne se signale pas seulement par son contour : il a un
remplissage distinct de la page, une hauteur de rail de 3 rem, un libellé associé, un
placeholder à 5,47:1, et **au focus** une bordure `--ring` qui, elle, tient 3,12:1 en clair
et 8,16:1 en sombre. L'état d'erreur passe aussi, à 3,80. Ce qui manque est le contraste au
**repos**, pas la possibilité d'identifier ou d'utiliser le contrôle.

**Le remède, mesuré.** `--border` et `--input` sont des jetons du contrat de marque : un
client qui doit tenir 1.4.11 les remonte, sans ouvrir un fichier du socle.

| | actuel | pire ratio | valeur conforme | vs page | vs remplissage |
|---|---|--:|---|--:|--:|
| clair | `#e5e1da` | 1,17 | `#908c85` | 3,00 | 3,35 |
| sombre | `#3a3936` | 1,24 | `#747370` | 3,51 | 3,02 |

---

## 4. Ce que ce document ne couvre pas

Le contraste des couleurs, et lui seul. Trois points relèvent de l'accessibilité mais pas de
la mesure faite ici, et aucun n'est traité par le sous-lot :

- **1.4.1 Utilisation de la couleur.** `a{}` ne pose **pas** de soulignement : dans un
  paragraphe, un lien ne se distingue que par sa couleur. Le corriger change le rendu de
  toute prose du système — décision de conception, à trancher à part.
- **1.4.11 sur les états.** Les états `:hover` reposent sur un écart de surface de ~1,08,
  très en dessous de 3:1. C'est un usage courant et non couvert stricto sensu par 1.4.11
  (l'état reste identifiable par le curseur et le focus), mais il mérite d'être connu.
- **2.4.7, 1.4.12, 1.4.10.** Focus, espacement du texte, redimensionnement : hors mesure.

---

## 5. Refaire la mesure

```bash
node check-contrast.mjs           # le contrôle — sort non-zéro sur un écart non déclaré
node check-contrast.mjs --table   # les deux tableaux de ce document, en markdown
TOKENS=chemin/vers/brand-client.css node check-contrast.mjs   # la palette d'un client
```
