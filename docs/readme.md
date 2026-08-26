# Julien Fernandes — Design System

> Lis ce fichier en premier. C'est la source de vérité pour concevoir toute interface,
> toute miniature et tout asset de la marque **Julien Fernandes**.
> **Langue** : les textes d'interface et de démo sont en **français**. Les identifiants de
> tokens et de composants sont en **anglais**.

---

## La marque

**Qui.** Julien Fernandes, builder français basé à **Busan, Corée du Sud**. Il apprend aux
entrepreneurs et aux ambitieux à **construire leurs propres applications** avec Claude Code et les
outils IA — pour leur business ou pour eux-mêmes.

**Promesse.** « Transforme ton idée en vraie application — simplement, sans coder ni galère technique. »
**Mantra.** Le résultat, pas l'outil. La simplicité, pas la technique.

**Positionnement.** App building · Claude Code & IA · Busan, Corée du Sud.

**Périmètre.** Ce design system est le **socle générique** de la marque : tokens, primitives et
règles partagés par toutes les surfaces — site web, vidéos, slides, e-mails — et par la suite
d'outils internes (dashboard, création de contenu, sport…). Les composants métiers et les
gabarits de production (landing, miniatures, motion, slides, social) vivent dans les projets
consommateurs, jamais ici.

**ADN visuel.** Le terrain chaud et premium hérité de Yunary — crème par défaut, ink en rupture,
jamais de noir pur ni de blanc clinique, beaucoup d'air, rayons généreux, ombres teintées —
traversé par une typo de titre **massive, condensée, en capitales** (Anton), et un dégradé
ambre → orange → rouge **rationné à l'accent**. Le calme du fond, la brutalité du titre.

---

## Sources fournies

| Source | Rôle |
|---|---|
| `uploads/prompt-claude-design-ds-v4.md` | Le brief complet v4 — fusion Yunary × Julien Fernandes. |
| `uploads/kit-design-system-ds-v4/yunary/styles.css` + `yunary/tokens/*.css` | **Source de vérité** couleurs, espacement, rayons, ombres, motion. Reprises telles quelles. |
| `uploads/kit-design-system-ds-v4/yunary/readme.md` | Règles d'usage Yunary (rareté du dégradé, cards, élévation, états). Reprises intégralement. |
| `uploads/kit-design-system-ds-v4/fonts/Anton-400.woff2` | Police de titre. Une seule graisse : 400. |
| `uploads/kit-design-system-ds-v4/fonts/JetBrainsMono-400/500.woff2` | Police mono. |
| `uploads/kit-design-system-ds-v4/logo/*.png` | Logos officiels, point déjà recoloré en orange `#E85D2F`. Repris **sans modification**. |
| **Code produit `app/` (08/2026)** | **Socle CSS de l’app de Julien** (`src/index.css`) : échelle typo par rôle, `control` 15, leading 1.5 / prose 1.7, `--radius-badge`, `--tracking-dense`, largeurs de conteneur par rôle, drop responsive des titres. Les ajouts **Videapro** (Anton côté app, géométrie du Détail, facteurs d’échelle, tons de format YouTube/Instagram, lecteur vidéo) sont **volontairement exclus** — projet personnel, hors marque. |

Aucun Figma n’a été fourni. Le code produit `app/` est désormais la référence vivante du socle :
en cas d’écart entre ce kit et `src/index.css` (hors bloc Videapro), c’est le code qui a raison.
DM Sans se charge depuis Google Fonts ; Anton et JetBrains Mono sont auto-hébergés.

---

## RÈGLE ABSOLUE — tout en `rem`

C'est la contrainte n°1. Chaque valeur dimensionnelle est en **rem** : `font-size`, `padding`,
`margin`, `gap`, `width`, `height`, `min-*`, `max-*`, `inset`, `top/right/bottom/left`,
`border-radius`, `translate`, `background-size`, et les tailles d'icônes posées en CSS.
Le `viewBox` d'un SVG reste sans unité. `line-height` est un ratio, `letter-spacing` est en `em`.

**Restent en `px`, et uniquement celles-là :** bordures filaires `1px` / `1.5px` · offsets, blurs et
spreads des ombres · anneau de focus (`2px`, offset `2–3px`, anneau `3px`) · `backdrop-filter: blur(10px)` ·
`9999px` du rayon pill · grille de fond (`1px`, maille `28px` / `80px`) · micro-décalages
`translateY(-2px|-1px|1px)` · `background-position` du shimmer (`-560px` → `560px`) · `stroke-width`
des SVG · dimensions d'export des canvas fixes.

**Sur le web** — jamais de `font-size` en px sur `html` / `:root`. Le rem honore la préférence
de taille de texte du navigateur.

**Sur les canvas à dimensions fixes** — chaque canvas est une page HTML autonome qui pose l'échelle
sur sa **propre racine**. C'est le seul endroit du système où l'on pinne la racine, et c'est volontaire :

```css
html { font-size: calc(100vw / 80); }  /* paysage : 16:9, 1920×1080, 2560×1440, 1200×630, carré 1024 */
html { font-size: calc(100vw / 45); }  /* portrait : Shorts 9:16, 1080×1920 */
```

Diviseurs retenus : **80** (paysage et carré), **45** (portrait 9:16). Aucun autre.
À 1280 de large, `1rem = 16px` ; à 1920, `1rem = 24px` (soit **1,5× l'échelle de l'UI** —
ne confonds pas les deux). La même page s'exporte en 1280×720, 1920×1080 ou 640×360 sans
toucher une seule valeur.

**Sur les apps desktop (outils internes)** — module opt-in `tokens/app-scale.css`, jamais
importé par `styles.css` : paliers d'échelle posés sur `html{font-size}` en **%** (ils
multiplient la préférence navigateur, sans l'écraser) — `103 %` < 1600 · `112 %` à 1600 ·
`126 %` à 1920 · `130 %` ≥ 2400 — pour garder une largeur effective ~1440–1600 sur tout
écran. Garde-fou `body{min-width:1133px}` (1100 × 1,03), en px volontairement.
Le site, les e-mails et les slides ne l'importent jamais.

---

## CONTENT FUNDAMENTALS

**Langue.** Français. Identifiants en anglais.

**Voix.** Première personne — *je build*, *j'ai construit cette app en un week-end*. S'adresse au
lecteur en **tu**, jamais « vous ». Direct, concret, pédagogique mais cash, zéro hype.
Anglicismes naturels acceptés : *build, builder, vibecoding, app, prompt, skill, agent, live, tuto*.

**Casse.** Titres H1 → H4 en **CAPITALES** (Anton). Corps en casse normale. Eyebrows et chips en
capitales trackées. **Jamais de Title Case.**

**Ponctuation.** Le point médian `·` comme séparateur — *Build · 03*, *Busan · Corée du Sud*,
*Julien Fernandes · Builder*. Tirets cadratins pour les incises.

**Chiffres.** Formatage français : virgule décimale (*18,2 k vues*), espace insécable avant les
unités (*6 000 €*), temps relatif en minuscules (*il y a 3 j*). Une métrique n'est jamais un chiffre
nu : toujours icône + valeur (+ libellé).

**Emoji : jamais.** Aucun caractère unicode décoratif non plus — sauf le point médian.
La chaleur vient de l'orange et du halo.

**Lignes de référence.**
- « J'ai construit cette app en un week-end avec Claude Code. Zéro ligne de code écrite à la main — juste la bonne méthode. »
- « On build une app. »
- « Le résultat, pas l'outil. La simplicité, pas la technique. »
- Erreur : « Ça a planté, on réessaie ? » — cash, jamais dramatisé, jamais d'excuse rampante.
- État vide : nommer le vide + donner l'étape suivante — « Aucun build ici. Choisis une série. »

**À éviter.** La hype IA vide, le jargon dev qui exclut les débutants, les promesses creuses
(« deviens dev en 7 jours »), les tutos sans vision produit.

---

## VISUAL FOUNDATIONS

**Couleur.** Tout se pose sur **crème** `#F6F2EC` (thème par défaut) ou **ink** `#1F1E1C`
(variante `.dark`), deux neutres chauds — jamais de blanc clinique, jamais de noir pur.
La seule couleur saturée est le dégradé de marque, et il est **rationné à l'accent**.
Le blanc pur `#FFFFFF` (`--secondary`) est **réservé, en thème clair, aux contrôles posés à même
le layout** : bouton secondaire, navbar, barre de tabs / filtres, barre de recherche, inputs.
Le noir profond `#0D0C0B` (`--tone-deep`) est **réservé aux miniatures YouTube et au motion**.
**Pas de bleu** dans le système.

**Règle de rareté (non négociable).** Le dégradé et l'orange vivent en accent seulement :
logo, **un** mot de titre (via `background-clip:text`), eyebrow, numéro d'étape, CTA primaire,
halo, glow. Jamais un grand aplat, jamais deux mots en dégradé dans un même titre, jamais mélangé
à un autre accent. **La rareté de l'orange, c'est la reconnaissance.** L'orange ne signifie jamais
« erreur » : les erreurs utilisent `--destructive` `#E84C3D` avec icône + texte.

**Typo.** **Anton 400 CAPS** sur tous les niveaux de titre H1 → H4 et sur le display — c'est le
titre qui porte l'identité. **DM Sans** 400/500/600/700 pour le corps et l'UI.
**JetBrains Mono** 400/500 pour le code et les métadonnées techniques. Le tracking d'Anton est *moins* négatif que celui d'Onest dans Yunary
(`-0.02em` au lieu de `-0.03em`) : Anton est déjà ultra-condensé.
Palier **`--text-control` `0.9375rem`** (15) pour tous les contrôles : boutons, champs, chips,
onglets. Interligne d’**interface 1.5** (`--leading-body`) ; une colonne de **lecture suivie**
passe à **1.7** (`--leading-prose`, classe `.prose`). Sous **64rem**, les deux paliers de titre
descendent d’un cran : heading-xl → `1.75rem` (28), heading → `1.625rem` (26) — tokens only.

**Espacement.** Base 4px, en rem : `0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 6rem`.
Généreux : gaps de grille de cards **≥ 1.5rem**, marges de section larges, sensation éditoriale.
**Largeurs de contenu par rôle** (jamais une largeur inventée) : shell `70rem` (1120, la plus
large — `--page-max` pointe dessus) · wide `56.25rem` (900, colonne de travail) · read `45rem`
(720, lecture suivie) · narrow `30rem` (480, message centré, état vide).

**Rayons.** badge `0.375rem` (micro-badge / squircle sur boîte ~20px) · sm `0.625rem` (chips, skeleton, onglets) · md `0.75rem` (boutons, inputs, selects, icon-buttons) ·
lg `1.25rem` (card standard, `--radius` par défaut, dropdowns) · xl `1.5rem` (grandes cards, panneaux, hero) ·
2xl `1.75rem` (modales, sheets) · pill `9999px` (badges et compteurs uniquement —
**jamais** un bouton, un input ni une barre de tabs).

**Rail de hauteur des contrôles.** Une seule hauteur minimum pour tout contrôle — bouton (toutes
tailles), input, trigger de Select, IconButton carré, barre de tabs : `3rem`, qui descend à
`2.75rem` (44px, cible de touche) sous `64rem`. `sm` ne joue que sur le padding et la typo ;
lg `3.25rem` (`3rem` mobile) est réservé au CTA hero. Textarea garde sa hauteur automatique.

**Barre de tabs.** Le fond contraste TOUJOURS avec la surface porteuse : `--secondary` posée sur
la page, `--background` posée sur une card (prop `onCard`). Conteneur `0.875rem`, onglets
`--radius-sm`, hauteur du rail — jamais fondue dans le fond, jamais pill.

**Surfaces des contrôles.** Même règle pour tout ce qui est posé à même le layout — navbar,
barre de filtres, barre de recherche, inputs, selects : fond `--secondary` (blanc en clair,
ink-soft en sombre), qui les détache du fond. Un champ posé dans une card passe en
`--background` (`surface="card"`). Jamais le même fond que la surface porteuse.

**Cards.** L'objet signature : surface `--card` teintée (`#FAF7F2` en clair, `#2B2A28` en ink),
bordure **1px** `--border`, **rayon lg/xl**, **padding 1.5rem** (1.75rem pour une grande card
ou un panneau), ombre diffuse teintée ink. Jamais une card blanche. Card cliquable :
`translateY(-2px)` vers `--shadow-md` au hover, retour en `translateY(1px)` au press.

**Fonds.** Aplats crème ou ink pour le **rythme des sections** : la page est crème, une ou deux
sections passent en ink pleine largeur pour créer la respiration — et ces sections adoptent le
**scope `.dark`**, pas un fond sombre peint à la main. La décoration se limite au **halo radial**
et au lavis `--grad-soft` (6–14 %) derrière les StepCard et les icônes d'état vide.
Pas de photo en fond sans traitement, pas de motif répété, pas de texture lourde.
Les portraits sont des **découpes** (silhouette détourée), placées bas, halo orange derrière les
épaules, jamais centrées derrière le texte.

**Ombres.** Trois niveaux teintés ink, jamais noir pur : **sm** `0 2px 8px rgba(31,30,28,.06)`
(card au repos) · **md** `0 10px 28px …/.09` (flottant / hover) · **lg** `0 20px 48px …/.12`
(modales, dropdowns). En `.dark`, l'élévation s'approfondit — `rgba(0,0,0,.34/.46/.58)` : c'est la
seule occurrence de noir pur du système hors `--tone-deep`, et c'est une ombre, jamais une surface.
Plus le **glow** `--shadow-glow` / `-lg`, réservé au CTA primaire et aux éléments de marque,
et **`--shadow-knob`** `0 1px 2px rgba(31,30,28,.28)` — le seul relief 1px du système, pour le knob
du `Switch` (ink-tinté, jamais noir pur). Le knob est en **`--tone-light-alt`**, pas en blanc pur : la
seule exception blanc reste le bouton secondaire en thème clair.

**Élévation.** fond (1) → card (2, `--shadow-sm`, `--shadow-md` au hover) →
popover / modale / dropdown (3, `--shadow-lg`) → skeleton muted (4).
À chaque niveau : fond teinté + bordure fine + ombre teintée.

**Bordures.** 1px `--border` sur les cards et surfaces ; **1.5px** sur les contrôles interactifs
(inputs, boutons secondaires) ; **pointillé** pour les états vides.

**Hover.** Teinte douce : le contrôle passe sur `--accent` et/ou bordure `--primary`.
Card cliquable : `translateY(-2px)` → `--shadow-md`. Bouton primaire : glow renforcé + `translateY(-1px)`.
**Press.** Le lift s'inverse en `translateY(1px)`, le glow se resserre. Aucune inversion de couleur.
**Focus.** Toujours visible. Boutons et contrôles cliquables : `outline: 2px solid var(--ring)`
avec `outline-offset: 2–3px`, ou l'anneau 3px. Champs (input, textarea, select, recherche) : la
bordure passe simplement en `--ring` — **une seule bordure, jamais d'anneau en plus**.
Orange en clair, ambre en sombre.

**Animation.** Retenue. `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`, durées littérales :
**150ms** (hover) · **200ms** (standard) · **300ms** (modales) · **1.4s** (shimmer de skeleton).
Aucun rebond, aucune boucle décorative sur du contenu. Une règle globale `prefers-reduced-motion`
écrase toutes les durées.

**Transparence & flou.** Avec parcimonie : navbar sticky (`backdrop-filter: blur(10px)` + fond
`--card` au scroll), scrim du bouton play (`--overlay-play-bg`, ~42 % ink), fonds de modale,
`color-mix` pour les pills. **Pas de glassmorphism.**

**États sémantiques.** Toujours **couleur + icône + texte**, jamais la couleur seule :
success (olive), warning (orange), danger (rouge), neutral (gris), plus coral & amber en accents
de métrique. Livrés en pills, toasts et bannières.

### Motifs signature
1. Le **dégradé de marque**, en accent uniquement.
2. Le **rythme des sections** par alternance crème ↔ ink (scope `.dark`).
3. Le **halo** — dégradé radial chaud ancré en bas, jamais plein écran. Hero, section CTA, derrière
   un portrait, derrière une card clé.
4. Le **glow ambré** sous le CTA primaire.
5. La **grille fine** — maille 28px ou 80px, lignes 1px à ~5,5 %. **Miniatures YouTube et motion
   design uniquement.** Jamais sur le site, jamais dans l'UI, jamais sur les slides.
6. Le **point orange du logo** — la seule tache de couleur du mark.

---

## ICONOGRAPHY

- **Système : [Lucide](https://lucide.dev), exclusivement.** En production, `lucide-react` ;
  ici, le composant `Icon` embarque les tracés Lucide 24×24 (copiés, jamais redessinés) et les
  specimen cards les rendent depuis le bundle. Aucun jeu d'icônes n'était fourni dans le kit :
  **Lucide est repris du design system Yunary**, où il est déjà la référence — pas une substitution.
- **Tailles** `1rem` / `1.25rem` / `1.5rem`, posées en CSS (`width`/`height`). Le `viewBox` 24×24
  reste sans unité.
- **Graisses** `stroke-width: 2` par défaut ; **2.5** dans les pills et les toasts (entre `0.875rem`
  et `0.9375rem`) ; **3** pour le check. Bouts et jointures arrondis.
- **Couleur** `--foreground` par défaut ; `--primary` seulement pour une icône active ou un CTA.
- **Marques tierces** (YouTube, Instagram, TikTok, GitHub, Claude, Supabase) : leurs glyphes
  officiels, **non recolorés**. Aucun n'était fourni dans le kit. *À fournir aux projets consommateurs.*
- **Aucun emoji, aucun caractère unicode décoratif** — sauf le point médian `·`.

---

## Logo

Le mark est **rendu en CSS** (composant `Logo` / utilitaire `.ds-logo`) : lettres Anton CAPS +
**point carré arrondi en dégradé de marque** (`--brand-gradient-diagonal`, rayon 25 %,
glow `0 0 12px rgba(240,128,41,.5)`) — décision utilisateur, qui remplace l'aplat orange du
brief v4. Le point garde le dégradé sur **tous** les fonds ; seules les lettres s'inversent :
ink sur crème, bone sur ink. Les PNG fournis (point orange plat) restent dans `assets/logo/`
comme exports statiques.
Marge de protection autour du wordmark = **1× la hauteur du `J`**.
Le rose d'origine `#D11A4E` est mort : il ne doit réapparaître nulle part.

---

## Composants

Chaque composant : un `.jsx`, un `.d.ts` (contrat de props), et une specimen card `@dsCard`
par dossier, rendue **en clair ET en sombre**. Les docs d'usage sont fusionnées dans
`components/PROMPTS.md`.

**`components/actions/`** — `Button` (primary · secondary · ghost · danger ; sm · md · lg ;
hover / active / focus / disabled / loading ; icône optionnelle), `IconButton`.

**`components/forms/`** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `FormField`,
`DatePicker`, `Calendar`.

**`components/data-display/`** — `Card` (default · interactive · feature, + en-tête à slots
eyebrow / icon / title / subtitle / action), `Pastille` (la tuile d'icône : 5 tailles nommées
par contexte — carte · dialogue · panneau · héros · écran —, 2 formes, 8 tons ; elle remplace
les tuiles internes de `Modal` et `EmptyState`), `Badge` (2 rembourrages : md `--badge-h`,
dense `--badge-h-dense`), `Tooltip`, `Table`, `Separator`. (`MetricPill` est sorti du socle — composant métier,
il vit dans l'app qui en a besoin ; les classes `.ds-metric*` restent dans `patterns.css`.)

**`components/feedback/`** — `Toast`, `Banner`, `EmptyState`, `Skeleton`, `SkeletonCard`,
`Spinner`, `Progress`.

**`components/overlays/`** — `Modal` (3 phases dans la même modale : confirm → loading → result ;
en `loading` rien ne ferme — ni Échap, ni clic dehors, ni croix. Sous 64 rem la même modale devient
une feuille basse : ancrage bas, pleine largeur, coins hauts au rayon 2xl, poignée, entrée par le bas),
`ActionSheet` (le menu ⋯ sur mobile, « Annuler » intégré, lignes au rail tactile `--control-md`),
`Dropdown`.

**Doctrine ⋯ .** `Dropdown` est **desktop only**. Sous 64 rem, un menu ⋯ s'ouvre **toujours** en
`ActionSheet`, jamais en `Dropdown` : ce ne sont pas deux composants concurrents, c'est le même
geste sur deux tailles d'écran.

**Icône bannie.** `sparkles` est retiré du set et ne doit jamais y revenir : l'étoile-éclair est un
marqueur « fait par une IA ». Les actions destructives utilisent `trash-2`.

**`components/navigation/`** — `Navbar` (sticky, fond `--secondary`, blur au scroll), `Footer`,
`Tabs`, `Pagination`, `AppShell`, `Sidebar`.

**`components/brand/`** — `Logo`, `Halo`, `GridBackground`, `Avatar`.

**`components/icons/`** — `Icon`.

---

## Index / manifeste

**Racine**
- `styles.css` — point d'entrée unique (les consommateurs ne lient que ce fichier). `@import` seulement.
- `patterns.css` — styles d'états des composants (voir « Ajouts assumés »).
- `readme.md` — ce fichier.
- `SKILL.md` — entrée Agent Skill.
- `thumbnail.html` — vignette du design system.

**`tokens/`** — `fonts.css` (DM Sans + `@font-face` Anton & JetBrains Mono) · `colors.css`
(`:root` crème + `.dark` ink + `--tone-deep` + halos + pills) · `typography.css` (familles, échelle,
tracking, leading, graisses) · `scales.css` (espacement, rayons, rail, ombres, grille, motion —
chaque token dimensionnel porte son équivalent px en commentaire) · `base.css` (reset + utilitaires
`.display` `.eyebrow` `.chip` `.accent` `.halo` `.ds-grid` `.page` `.mono` `.caption`) ·
`app-scale.css` (**opt-in apps desktop**, hors `styles.css` — paliers d'échelle par largeur d'écran).

**`assets/`** — `fonts/` (Anton-400, JetBrainsMono-400/500) · `logo/` (les PNG fournis, non modifiés).

**`components/`** — les primitives réutilisables, par dossier (voir ci-dessus).

**`guidelines/`** — specimen cards des fondations : Colors (surfaces, texte, marque, pills,
noir profond) · Type (affiche, titres, corps, mono, eyebrow/chip, mot en dégradé) ·
Spacing (espacement, rayons, rail, ombres, glow) · Brand (logo, halo, grille) ·
Motion (courbe & durées, shimmer).

Les gabarits de production (landing, miniatures, social, motion, slides) ont été **sortis du
socle** : ils vivent dans les projets consommateurs.

---

## Ajouts assumés & valeurs dérivées

Rien n'a été glissé en douce. Voici tout ce qui ne vient ni de Yunary ni du brief :

1. **`patterns.css`** — les styles d'états des composants. Un style inline ne peut pas exprimer
   `:hover` / `:focus-visible` / `:active` / `:disabled`, et chaque composant doit montrer ces états.
   Aucune valeur nouvelle : le fichier ne fait que composer des tokens.
2. **`components/icons/Icon`** — un wrapper autour des tracés Lucide, nécessaire pour que les
   composants embarquent leurs icônes sans dépendre d'un CDN.
3. **`--gradient-thumbnail-fit`** — voir « Points à trancher » ci-dessous.
4. **`--grid-line: rgba(246,242,236,.055)`** — le brief donne « 1px à ~5,5 % d'opacité » sans
   nommer la couleur ; c'est le crème de marque à 5,5 %.
5. ~~Géométrie de Checkbox / Radio / Switch dérivée~~ — **résolu** : les valeurs sont désormais
   copiées du code source Yunary (case 1.25rem rayon 0.4375rem, radio 1.25rem à point 0.625rem,
   switch 2.75 × 1.625rem à knob 1.25rem), converties en rem.
6. **`--card-pad` / `--card-pad-lg` / `--page-max` / `--control-*` / `--icon-control-*`** — les
   valeurs sont dans le brief, seuls les noms de tokens sont nouveaux.
7. **Placeholders de portrait** — aucun portrait découpé n'était fourni. `Avatar` retombe sur un
   monogramme muté. **Envoie les PNG détourés.**

---

## Points à trancher

- **`--gradient-thumbnail` ne peut pas s'afficher.** Le littéral du brief est
  `radial-gradient(closest-side at 50% 110%, …)` : avec `closest-side`, le rayon vaut 10 % de la
  hauteur de la boîte, tandis que le centre est situé 10 % de cette hauteur **sous** la boîte —
  le disque peint ne touche donc jamais la zone visible, dans n'importe quel conteneur.
  Le token est conservé **verbatim** pour ne pas trahir la source, et un jumeau
  `--gradient-thumbnail-fit` reprend **exactement les mêmes arrêts de couleur** avec un
  dimensionnement explicite (`70% 55% at 50% 100%`), comme le fait déjà `--gradient-halo`.
  Il sert aux surfaces de production (miniatures, motion) des projets consommateurs.
  **Confirme le remplacement, ou donne la valeur corrigée.**
- **Portrait** : voir « Ajouts assumés » 7.
- **Géométrie des contrôles de choix** : voir « Ajouts assumés » 5.

---

## Interdits

Pas de bleu. Pas de dégradé en grand aplat. Pas de deux mots accentués dans un titre.
Pas de Title Case. Pas de faux gras sur Anton (400 uniquement, jamais `-webkit-text-stroke`).
Pas d'Anton en bas de casse, ni sous `1.125rem`, ni dans un paragraphe / bouton / label.
Pas de glassmorphism. Pas d'ombres grises non teintées. Pas de pill sur un bouton, un input ou
une barre de tabs. Pas de barre de tabs fondue dans le fond de sa surface porteuse.
Pas de grille sur le site, l'UI ou les slides. Pas de `--tone-deep` en fond d'interface.
Pas de card blanche, pas de fond blanc. Pas d'emoji. Pas de rose `#D11A4E`.
Pas de valeur inventée : si elle n'est ni dans Yunary ni dans le brief, elle est listée ci-dessus.
