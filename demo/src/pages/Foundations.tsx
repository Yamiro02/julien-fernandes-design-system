import { Card } from '@julienfernandes/ds';
import { Block, Grid, Section, Spec, Swatch } from '../ui';

const SURFACES = ['--background', '--foreground', '--card', '--popover', '--secondary', '--muted', '--accent', '--border', '--input'];
const TEXT = ['--foreground', '--text-secondary', '--text-muted', '--text-inverted', '--muted-foreground'];
const BRAND = ['--primary', '--ring', '--brand-from', '--brand-via', '--brand-to', '--destructive'];
const PILLS = ['--pill-coral-bg', '--pill-amber-bg', '--pill-danger-bg', '--pill-warning-bg', '--pill-success-bg', '--pill-neutral-bg'];
const SPACES = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7', '--space-8'];
const RADII = ['--radius-badge', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-pill'];
const RAIL = ['--control-sm', '--control-md', '--control-lg', '--icon-control-sm', '--icon-control-md', '--icon-control-lg'];
const SHADOWS = ['--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-glow', '--shadow-glow-lg'];
const WIDTHS = ['--container-shell', '--container-wide', '--container-read', '--container-narrow'];

export function Foundations() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Couleur" note="Tout se pose sur crème ou ink. La seule couleur saturée est le dégradé de marque, rationné à l'accent. Pas de bleu.">
        <Block label="Surfaces et neutres chauds">
          <div className="grid grid-cols-3 gap-space-4 sm:grid-cols-5 lg:grid-cols-9">
            {SURFACES.map(t => <Swatch key={t} token={t} border />)}
          </div>
        </Block>
        <Block label="Texte">
          <div className="grid grid-cols-3 gap-space-4 sm:grid-cols-5">
            {TEXT.map(t => <Swatch key={t} token={t} border />)}
          </div>
        </Block>
        <Block label="Marque" hint="Accent uniquement : logo, un mot de titre, eyebrow, numéro d'étape, CTA primaire, halo, glow.">
          <div className="grid grid-cols-3 gap-space-4 sm:grid-cols-6">
            {BRAND.map(t => <Swatch key={t} token={t} />)}
          </div>
          <Spec token="--brand-gradient · --brand-gradient-diagonal · --grad-soft">
            <span className="h-space-7 flex-1 rounded-md bg-brand-gradient" />
            <span className="h-space-7 flex-1 rounded-md bg-brand-gradient-diagonal" />
            <span className="h-space-7 flex-1 rounded-md border border-border bg-grad-soft" />
          </Spec>
        </Block>
        <Block label="Pills sémantiques" hint="Toujours couleur + icône + texte, jamais la couleur seule.">
          <div className="grid grid-cols-3 gap-space-4 sm:grid-cols-6">
            {PILLS.map(t => <Swatch key={t} token={t} border />)}
          </div>
        </Block>
        <Block label="Noir profond" hint="--ink-deep est réservé aux miniatures YouTube et au motion. Jamais un fond d'interface.">
          <Spec token="--ink-deep">
            <span className="h-space-7 w-full rounded-md border border-border" style={{ background: 'var(--ink-deep)' }} />
          </Spec>
        </Block>
      </Section>

      <Section title="Typographie" note="Anton 400 CAPS sur tous les titres. DM Sans pour le corps et l'UI. JetBrains Mono pour le code et les métadonnées techniques.">
        <Block label="Affiche et titres">
          <Spec token="--text-display-xl · miniature et motion"><span className="display-xl">On build une app</span></Spec>
          <Spec token="--text-display · hero du site"><span className="display">On build une app</span></Spec>
          <Spec token="--text-heading-xl · h1"><h1>Le résultat, pas l'outil</h1></Spec>
          <Spec token="--text-heading · h2"><h2>La simplicité, pas la technique</h2></Spec>
          <Spec token="--text-subheading · h3"><h3>Cadre ton idée</h3></Spec>
          <Spec token="--text-heading-sm · h4"><h4>Une phrase, un utilisateur</h4></Spec>
        </Block>
        <Block label="Mot en dégradé" hint="Un seul mot par titre, jamais deux.">
          <h2>J'ai construit cette <span className="accent">app</span> en un week-end</h2>
        </Block>
        <Block label="Corps, contrôles et méta">
          <Spec token="--text-body-lg"><p className="text-body-lg">Transforme ton idée en vraie application — simplement, sans coder ni galère technique.</p></Spec>
          <Spec token="--text-body"><p>Zéro ligne de code écrite à la main — juste la bonne méthode.</p></Spec>
          <Spec token="--text-control · boutons, champs, chips, onglets"><span className="text-control font-semibold">Voir la chaîne</span></Spec>
          <Spec token="--text-caption"><span className="caption">il y a 3 j · 18,2 k vues</span></Spec>
          <Spec token="--text-eyebrow"><span className="eyebrow">Méthode · 03</span></Spec>
          <Spec token="--text-chip"><span className="chip text-text-muted">Build</span></Spec>
          <Spec token="--font-mono"><span className="mono text-caption">npm create vite@latest app</span></Spec>
        </Block>
        <Block label="Interlignes" hint="Interface 1.5 · lecture suivie 1.7 (classe .prose).">
          <p className="max-w-read">Interface — 1.5. Direct, concret, pédagogique mais cash. La chaleur vient de l'orange et du halo, jamais d'un emoji.</p>
          <p className="prose max-w-read">Lecture suivie — 1.7. Une colonne de lecture continue respire davantage : mentions légales, article de fond, page à lire de bout en bout.</p>
        </Block>
      </Section>

      <Section title="Espacement, rayons et rail" note="Base 4px, tout en rem. Généreux : gaps de grille de cards ≥ 1.5rem.">
        <Block label="Échelle d'espacement">
          {SPACES.map(t => (
            <Spec key={t} token={t}>
              <span className="h-space-4 rounded-badge bg-primary" style={{ width: `var(${t})` }} />
            </Spec>
          ))}
        </Block>
        <Block label="Rayons" hint="pill est légal sur les onglets, badges et compteurs — jamais sur un bouton ni un input.">
          <div className="grid grid-cols-2 gap-space-4 sm:grid-cols-4 lg:grid-cols-7">
            {RADII.map(t => (
              <div key={t} className="flex flex-col gap-space-2">
                <span className="h-space-7 w-full border border-border bg-card" style={{ borderRadius: `var(${t})` }} />
                <span className="mono text-caption text-text-muted truncate">{t}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block label="Rail de hauteur des contrôles" hint="Bouton md, Input et le trigger de Select s'alignent tous à 3rem.">
          {RAIL.map(t => (
            <Spec key={t} token={t}>
              <span className="w-space-8 rounded-md border border-border bg-card" style={{ height: `var(${t})` }} />
            </Spec>
          ))}
        </Block>
        <Block label="Largeurs de contenu par rôle">
          {WIDTHS.map(t => (
            <Spec key={t} token={t}>
              <span className="h-space-2 w-full rounded-pill bg-accent" style={{ maxWidth: `var(${t})` }} />
            </Spec>
          ))}
        </Block>
      </Section>

      <Section title="Ombres et élévation" note="Trois niveaux teintés ink, jamais noir pur. Le glow est réservé au CTA primaire et aux éléments de marque.">
        <Grid cols={3}>
          {SHADOWS.map(t => (
            <Card key={t} className="flex flex-col gap-space-3" style={{ boxShadow: `var(${t})` }}>
              <span className="mono text-caption text-text-muted">{t}</span>
              <span className="caption">
                {t === '--shadow-sm' ? 'Card au repos'
                  : t === '--shadow-md' ? 'Flottant, hover de card'
                    : t === '--shadow-lg' ? 'Modale, dropdown, toast'
                      : 'Marque — CTA primaire'}
              </span>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="Motion" note="Retenue. Une règle globale prefers-reduced-motion écrase toutes les durées.">
        <Block label="Courbe et durées">
          <Spec token="--ease-standard"><span className="mono text-caption">cubic-bezier(0.2, 0, 0, 1)</span></Spec>
          <Spec token="durées littérales"><span className="mono text-caption">150ms hover · 200ms standard · 300ms modales · 1.4s shimmer</span></Spec>
        </Block>
      </Section>
    </div>
  );
}
