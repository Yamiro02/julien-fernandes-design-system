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

- Radius is always `--radius-md` (0.75rem). **Never a pill** — pills are for badges and counters.
- Every button rides the shared control rail: min-height 3rem (2.75rem under 64rem). `sm` only tightens padding and type; `lg` (3.25rem) is the hero CTA.
- Only `primary` gets `--shadow-glow`; hover deepens it to `--shadow-glow-lg` + `translateY(-1px)`, press returns `translateY(1px)`.
- One primary button per view. Label in sentence case, French, tutoiement.


## IconButton

Icon-only button — copy actions, navigation toggles, close buttons.

```jsx
<IconButton label="Copier le prompt" variant="ghost"><Icon name="copy" /></IconButton>
<IconButton label="Fermer" variant="secondary" size="sm"><Icon name="x" size="1rem" /></IconButton>
```

Square, radius `--radius-md`, always the same square on the shared control rail (3rem, 2.75rem under 64rem) — aligned with Button and Input. Never a pill.


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

# data-display


## Badge

Status / category pill.

```jsx
<Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
<Badge tone="danger" icon={<Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />}>Échec</Badge>
<Badge tone="outline">Brouillon</Badge>
```

Pill radius is fine here (badges, counters). Never on a button, an input or a tab bar.


## Card

The brand's core surface — everything that isn't a page section sits on a Card.

```jsx
<Card>Contenu</Card>
<Card variant="interactive" onClick={…}>Card cliquable</Card>
<Card variant="feature" size="lg">Mise en avant — lavis de dégradé + bordure orange</Card>
<Card flush><img … /><div style={{padding:'var(--card-pad)'}}>…</div></Card>
```

Grid gaps between cards are **≥ 1.5rem**. Never a pure-white card.


## Separator

Thin rule between blocks. With `label`, the caption sits centred on the line.

```jsx
<Separator />
<Separator label="Ou" />
<Separator orientation="vertical" />
```


## Table

Composable data table for tool UIs.

```jsx
<Card flush><Table striped hoverable>
  <THead><Tr><Th>Build</Th><Th>Statut</Th></Tr></THead>
  <TBody><Tr><Td>App de lecture</Td><Td><Badge tone="success">En ligne</Badge></Td></Tr></TBody>
</Table></Card>
```

Empty list: render `EmptyState` INSTEAD of an empty table — the table never carries its own empty state.


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


## Progress

Determined bar (0–100) or indeterminate sliding bar. Accent-tinted rail, `--primary` fill, thin.

```jsx
<Progress value={64} label="Progression du build" />
<Progress indeterminate label="Chargement" />
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


## Spinner

Loading ring in `currentColor`, sizes aligned on Icon (1 / 1.25 / 1.5rem). Inside a Button, use the `loading` prop instead — it swaps the icon for a Spinner and disables the button.

```jsx
<Spinner size="sm" />
<Button loading>Génération…</Button>
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


## Calendar

Month view — Monday-first, fr locale, native `Date` + `Intl` only. Selected day = `--primary` fill; today = `--primary` bold. Single date, no range.

```jsx
<Calendar value={date} onChange={setDate} min={new Date()} />
```


## Checkbox

Checkbox with label.

```jsx
<Checkbox label="Je veux recevoir le prompt du build" defaultChecked />
<Checkbox label="Option indisponible" disabled />
```


## DatePicker

Input-styled trigger + Calendar in a popover (outside click / Escape close). Same `surface` rule as Input.

```jsx
<DatePicker value={date} onChange={setDate} placeholder="Choisir une date" />
<DatePicker surface="card" value={date} onChange={setDate} />
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

Text field — radius `--radius-md`, 1.5px border. Focus = the border turns `--ring` — one border, never an extra ring.

```jsx
<Input placeholder="ton@email.com" />
<Input surface="card" placeholder="ton@email.com" />   {/* inside a Card */}
<Input invalid defaultValue="pas-un-email" />
```

Never a pill. Placeholder in `--text-muted`. Fill is `--secondary` on the layout (default, like navbar/tabs/search); `surface="card"` swaps to `--background` inside a Card. Wrap in `<FormField>` for label / help / error.


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


## AppShell

Tool-app skeleton: grid `[Sidebar | contenu]`. Under 64rem the sidebar becomes a drawer, driven by Sidebar's `open`/`onClose`.

```jsx
<AppShell sidebar={<Sidebar sections={…} footer={<Avatar size="2rem" />} open={menuOpen} onClose={close} />}>
  {content}
</AppShell>
```


## Footer

Page footer.

```jsx
<Footer columns={[{title:'Séries',links:[{label:'Build'},{label:'Tuto'}]}]}
  social={<><IconButton label="YouTube"><Icon name="youtube" /></IconButton></>} />
```

The location line uses the middle dot: *Busan · Corée du Sud*.


## Navbar

Site header — always on `--secondary`, detached from the cream layout; scroll adds blur + shadow.

```jsx
<Navbar links={[{label:'Vidéos',active:true},{label:'Séries'},{label:'À propos'}]}
  cta={<Button size="sm">La newsletter</Button>} />
```

Blur is the only place the system uses `backdrop-filter`. No glassmorphism anywhere else.


## Pagination

Controlled: `page`, `pageCount`, `onPageChange`. Ellipsis beyond 7 pages; current page gets the active-tab treatment; the bar rides `--secondary` like Tabs.

```jsx
<Pagination page={page} pageCount={12} onPageChange={setPage} />
```


## Sidebar

App navigation on `--secondary`: Logo head, titled sections, active item in `--accent` + `--primary`, footer for Avatar + name. Collapsible to icons-only, persisted in localStorage (`storageKey`).

```jsx
<Sidebar sections={[{ title: 'Outils', items: [
  { label: 'Dashboard', icon: <Icon name="layout-dashboard" />, active: true },
  { label: 'Contenu', icon: <Icon name="video" /> }
]}]} footer={<><Avatar size="2rem" /><span>Julien</span></>} />
```


## Tabs

Filter a feed by series.

```jsx
<Tabs value={tab} onChange={setTab} items={[{value:'all',label:'Tout'},{value:'build',label:'Build'},{value:'tuto',label:'Tuto'}]} />
<Tabs onCard value={tab} onChange={setTab} items={…} />   {/* posed on a Card */}
```

The bar always contrasts with its host surface: `--secondary` on the page, `onCard` swaps to `--background` on a Card. Rectangle (0.875rem / `--radius-sm`), min-height on the control rail — never a pill, never blended into the background.


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
