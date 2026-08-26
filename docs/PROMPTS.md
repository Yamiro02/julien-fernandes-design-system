# Prompts d'usage des composants

Docs d'usage fusionnées (anciennement un `.prompt.md` par composant).


---

# actions


## Button

The brand's action control — use `primary` for the single main CTA of a view, everything else is secondary/ghost.

```jsx
<Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>On build une app</Button>
<Button variant="secondary" icon={<Icon name="youtube" />}>Voir la chaîne</Button>
<Button variant="ghost" size="sm">Annuler</Button>
<Button variant="danger" icon={<Icon name="triangle-alert" />}>Supprimer</Button>
<Button loading>Génération…</Button>
```

- Radius is always `--radius-md` (1rem). **Never a pill** — pills are for tabs, badges and counters.
- Only `primary` gets `--shadow-glow`; hover deepens it to `--shadow-glow-lg` + `translateY(-1px)`, press returns `translateY(1px)`.
- One primary button per view. Label in sentence case, French, tutoiement.


## IconButton

Icon-only button — copy actions, navigation toggles, close buttons.

```jsx
<IconButton label="Copier le prompt" variant="ghost"><Icon name="copy" /></IconButton>
<IconButton label="Fermer" variant="secondary" size="sm"><Icon name="x" size="1rem" /></IconButton>
```

Square, radius `--radius-md`. `md` is 2.625rem (42px) — the minimum touch target. Never a pill.


---

# brand


## Avatar

Portrait with halo. Portraits are always **cut-outs** — placed low, halo behind the shoulders, never centred behind the title.

```jsx
<Avatar src="assets/portrait-cutout.png" size="4rem" />
<Avatar size="3rem" halo={false} />   {/* placeholder — no portrait supplied yet */}
```


## GridBackground

Fine background grid — **thumbnails and motion only**.

```jsx
<div style={{position:'relative',background:'var(--ink-deep)'}}>
  <GridBackground cell="sm" />
  <Halo hot />
  …
</div>
```

If you are building the site, a UI screen or a slide: do not use this component.


## Halo

The halo gives ink sections their warmth and cream sections their relief.

```jsx
<section style={{position:'relative',overflow:'hidden'}}>
  <Halo placement="bottom" />
  <div style={{position:'relative'}}>…</div>
</section>
```

`hot` swaps in `--gradient-thumbnail` — **only** on YouTube thumbnails and motion cards.


## Logo

The Julien Fernandes mark — CSS-rendered: Anton caps + gradient rounded-square dot with glow.

```jsx
<Logo variant="wordmark" height="1.75rem" />          {/* letters follow --foreground */}
<Logo variant="wordmark" tone="bone" height="1.75rem" />  {/* forced light letters on ink */}
<Logo variant="monogram" height="2.5rem" />
```

- The dot carries `--brand-gradient-diagonal` + glow on EVERY surface; only the letters invert.
- Never fake-bold, outline or letterspace the mark.
- Plain-HTML pages use the same mark via `.jf-logo` / `.jf-logo__dot` (tokens/base.css).
- `assets/logo/*.png` (flat-orange dot) remain as static exports for platforms that need files.


---

# content


## BeforeAfter

Comparison of a build before and after.

```jsx
<BeforeAfter
  before={<p>3 semaines de dev, un devis à 6 000 €, un cahier des charges de 12 pages.</p>}
  after={<p>Un week-end, une session Claude Code, zéro ligne écrite à la main.</p>} />
```

The gradient lives **only** on the seam — never as a panel fill.


## CodeBlock

Shows a command or a snippet.

```jsx
<CodeBlock filename="~/projects/app" code={"npm create vite@latest app\ncd app && claude"} onCopy={…} />
```

JetBrains Mono is only ever used here and in technical metadata — never for body copy.


## QuoteBlock

Quote from a viewer, a client, or the brand itself.

```jsx
<QuoteBlock quote="J'ai construit cette app en un week-end avec Claude Code. Zéro ligne de code écrite à la main — juste la bonne méthode."
  author="Julien Fernandes" role="Busan · Corée du Sud" />
```


## StepCard

Method / tutorial steps, usually 3 or 4 in a row.

```jsx
<StepCard step={1} title="Cadre l'idée">Une phrase, un utilisateur, un problème. Pas de features.</StepCard>
```

The step number is the only gradient in the card — the title stays ink.


---

# data-display


## Badge

Status / category pill.

```jsx
<Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
<Badge tone="danger" icon={<Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />}>Échec</Badge>
<Badge tone="outline">Brouillon</Badge>
```

Pill radius is fine here (badges, counters, tabs). Never on a button or input.


## Card

The brand's core surface — everything that isn't a page section sits on a Card.

```jsx
<Card>Contenu</Card>
<Card variant="interactive" onClick={…}>Card cliquable</Card>
<Card variant="feature" size="lg">Mise en avant — lavis de dégradé + bordure orange</Card>
<Card flush><img … /><div style={{padding:'var(--card-pad)'}}>…</div></Card>
```

Grid gaps between cards are **≥ 1.5rem**. Never a pure-white card.


## MetricPill

Metric counter — views, duration, publish date. French number formatting (`12,4 k vues`, `il y a 3 j`).

```jsx
<MetricPill icon={<Icon name="eye" size="0.875rem" strokeWidth={2.5} />} value="18,2 k" label="vues" />
<MetricPill tone="solid" value="14:32" />
```


## Tooltip

Short hover label.

```jsx
<Tooltip content="Copier le prompt"><IconButton label="Copier"><Icon name="copy" /></IconButton></Tooltip>
```


---

# feedback


## Banner

Persistent inline message.

```jsx
<Banner tone="warning" title="Ce tuto date de mars">La CLI a changé depuis — la méthode reste bonne.</Banner>
```


## EmptyState

Empty list / no results. Always give the reader the next step.

```jsx
<EmptyState icon={<Icon name="folder" size="1.5rem" />} title="Aucun build ici"
  description="Choisis une série pour voir les vidéos correspondantes."
  action={<Button variant="secondary">Voir tout</Button>} />
```


## Skeleton

Loading placeholder.

```jsx
<Skeleton width="12rem" height="1.25rem" />
<Skeleton height="9rem" radius="var(--radius-lg)" />
```


## SkeletonCard

Placeholder for a loading card grid.

```jsx
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--space-5)'}}>
  {[0,1,2].map(i => <SkeletonCard key={i} />)}
</div>
```


## Toast

Transient feedback, bottom-right of the viewport.

```jsx
<Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." onClose={…} />
<Toast tone="danger" title="Ça a planté, on réessaie ?" description="Le build n'a pas pu démarrer." />
```

Error copy is cash, never dramatised. Icon tile is 1.5rem, radius sm; glyphs at stroke-width 2.5 (check / x / triangle-alert / info, as in Yunary).


---

# forms


## Checkbox

Checkbox with label.

```jsx
<Checkbox label="Je veux recevoir le prompt du build" defaultChecked />
<Checkbox label="Option indisponible" disabled />
```


## FormField

Wraps any field with its label, help text and error.

```jsx
<FormField label="Ton email" htmlFor="mail" help="Un build décortiqué par semaine. Zéro spam.">
  <Input id="mail" placeholder="ton@email.com" />
</FormField>

<FormField label="Ton email" error="Ça a planté, on réessaie ?">
  <Input invalid defaultValue="pas-un-email" />
</FormField>
```


## Input

Text field — radius `--radius-md`, 1.5px border, 3px focus ring in `--ring`.

```jsx
<Input placeholder="ton@email.com" />
<Input invalid defaultValue="pas-un-email" />
```

Never a pill. Placeholder in `--text-muted`. Wrap in `<FormField>` for label / help / error.


## Radio

Radio — always in a named group.

```jsx
<Radio name="niveau" value="debutant" label="Je débute" defaultChecked />
<Radio name="niveau" value="avance" label="Je code déjà" />
```


## Select

Dropdown field — same silhouette and 3rem rail as Input and Button md.

```jsx
<Select options={[{value:'build',label:'Build'},{value:'tuto',label:'Tuto'}]} defaultValue="build" />
```


## Switch

Instant on/off toggle (no Save button).

```jsx
<Switch label="Thème sombre" defaultChecked />
```


## Textarea

Multi-line field. Keeps auto height — never set a min-height.

```jsx
<Textarea rows={5} placeholder="Décris ton idée d'app en deux phrases." />
```


---

# icons


## Icon

Renders a Lucide line icon — use it anywhere the design needs an icon; never emoji, never a hand-drawn SVG.

```jsx
<Icon name="circle-check" size="1.25rem" strokeWidth={2} />
<Icon name="arrow-right" size="1rem" style={{ color: 'var(--primary)' }} />
```

- Sizes: `1rem` · `1.25rem` (default) · `1.5rem`. Always rem, never px.
- `strokeWidth`: 2 standard · 2.5 inside pills and toasts · 3 for the check glyph.
- Colour follows `currentColor` — default `--foreground`; `--primary` only for an active icon or a CTA.
- Third-party marks (YouTube, Instagram, GitHub) keep their own glyph and are never recoloured to brand.


---

# navigation


## Footer

Page footer.

```jsx
<Footer columns={[{title:'Séries',links:[{label:'Build'},{label:'Tuto'}]}]}
  social={<><IconButton label="YouTube"><Icon name="youtube" /></IconButton></>} />
```

The location line uses the middle dot: *Busan · Corée du Sud*.


## Navbar

Site header.

```jsx
<Navbar links={[{label:'Vidéos',active:true},{label:'Séries'},{label:'À propos'}]}
  cta={<Button size="sm">La newsletter</Button>} />
```

Blur is the only place the system uses `backdrop-filter`. No glassmorphism anywhere else.


## Tabs

Filter a feed by series.

```jsx
<Tabs value={tab} onChange={setTab} items={[{value:'all',label:'Tout'},{value:'build',label:'Build'},{value:'tuto',label:'Tuto'}]} />
```


---

# overlays


## Dropdown

Contextual menu.

```jsx
<Dropdown items={[
  { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
  { separator: true },
  { label: 'Supprimer', icon: <Icon name="x" size="1rem" />, danger: true }
]} />
```


## Modal

Confirmation / focused task dialog.

```jsx
<Modal title="Supprimer ce build ?" description="Cette action est définitive."
  footer={<><Button variant="ghost">Annuler</Button><Button variant="danger">Supprimer</Button></>}
  onClose={…} />
```
