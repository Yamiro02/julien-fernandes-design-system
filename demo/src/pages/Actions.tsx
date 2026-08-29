import { Button, Icon, IconButton } from '@julienfernandes/ds';
import { ContentIcon } from '@julienfernandes/ds/brand-content';
import { Block, Row, Section } from '../ui';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
/* `accent` n'existe que sur IconButton — Button attend son deuxième appelant. */
const ICON_VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'accent'] as const;

export function ActionsPage() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Button" note="Rayon toujours --radius-md. Jamais un pill. Un seul bouton primaire par vue.">
        <Block label="Variantes" hint="primary porte seul le glow de marque ; secondary, ghost et danger n'en ont aucun.">
          <Row>
            <Button variant="primary">On build une app</Button>
            <Button variant="secondary">Voir la chaîne</Button>
            <Button variant="ghost">Annuler</Button>
            <Button variant="danger">Supprimer</Button>
          </Row>
        </Block>

        <Block label="Tailles" hint="sm 2.375rem · md 3rem (aligné sur Input et Select) · lg 3.25rem.">
          {VARIANTS.map(v => (
            <Row key={v} label={v}>
              <Button variant={v} size="sm">Petite</Button>
              <Button variant={v} size="md">Moyenne</Button>
              <Button variant={v} size="lg">Grande</Button>
            </Row>
          ))}
        </Block>

        <Block label="États" hint="Les états forcés utilisent les classes de démonstration is-hover / is-active / is-focus de patterns.css.">
          {VARIANTS.map(v => (
            <Row key={v} label={v}>
              <Button variant={v}>Repos</Button>
              <Button variant={v} className="is-hover">Hover</Button>
              <Button variant={v} className="is-active">Press</Button>
              <Button variant={v} className="is-focus">Focus</Button>
              <Button variant={v} disabled>Désactivé</Button>
              <Button variant={v} loading>Génération…</Button>
            </Row>
          ))}
        </Block>

        <Block label="Icônes" hint="icon en tête, iconRight en fin. L'icône du chargement remplace celle de tête.">
          <Row>
            <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>On build une app</Button>
            <Button variant="secondary" icon={<ContentIcon name="youtube" />}>Voir la chaîne</Button>
            <Button variant="ghost" size="sm" icon={<Icon name="copy" />}>Copier</Button>
            <Button variant="danger" icon={<Icon name="triangle-alert" />}>Supprimer</Button>
          </Row>
        </Block>

        <Block label="Surface" hint="Un bouton secondaire dans une carte reçoit --background par déduction. Dans un PANNEAU --background posé DANS cette carte, la déduction le peint de la couleur de son panneau : surface=page lui rend --secondary. Chaque Block de cette vitrine EST une Card — la déduction joue déjà partout ici.">
          <Row label="dans un panneau --background">
            <div className="flex flex-wrap items-center gap-space-3 rounded-md border border-border bg-background p-space-3">
              <Button variant="secondary">auto — il disparaît</Button>
              <Button variant="secondary" surface="page">surface=page</Button>
              <IconButton label="Fermer" variant="secondary"><Icon name="x" /></IconButton>
              <IconButton label="Fermer" variant="secondary" surface="page"><Icon name="x" /></IconButton>
            </div>
          </Row>
          <Row label="à même la carte">
            <Button variant="secondary">auto — la déduction suffit</Button>
            <Button variant="secondary" surface="card">surface=card, forcé à la main</Button>
          </Row>
        </Block>

        <Block label="Pleine largeur et lien">
          <Button variant="primary" fullWidth iconRight={<Icon name="arrow-right" />}>Recevoir le prompt du build</Button>
          <Button as="a" variant="secondary" href="#actions" icon={<Icon name="external-link" />}>Rendu en balise a</Button>
        </Block>
      </Section>

      <Section title="IconButton" note="Carré, rayon --radius-md. md fait 2.625rem — la cible de touche minimale. Jamais un pill.">
        <Block label="Variantes et tailles" hint="Les icônes ne portent aucun size : le créneau les dimensionne (sm 1rem · md 1.125rem). accent = fond --accent, sans bordure, icône --primary — l'état « sélectionné doux » d'un lien-icône.">
          {ICON_VARIANTS.map(v => (
            <Row key={v} label={v}>
              <IconButton label="Copier" variant={v} size="sm"><Icon name="copy" /></IconButton>
              <IconButton label="Copier" variant={v} size="md"><Icon name="copy" /></IconButton>
              <IconButton label="Copier" variant={v} size="lg"><Icon name="copy" /></IconButton>
            </Row>
          ))}
        </Block>

        <Block label="Lien-icône" hint="as=a + href : clic-milieu, ouvrir dans un onglet, annonce de lien au lecteur d'écran. La variante accent remplace le détournement d'is-active + style inline.">
          <Row>
            <IconButton label="Boutique" variant="accent" as="a" href="#actions"><Icon name="external-link" /></IconButton>
            <IconButton label="GitHub" variant="secondary" as="a" href="#actions"><Icon name="github" /></IconButton>
          </Row>
        </Block>

        <Block label="États">
          {ICON_VARIANTS.map(v => (
            <Row key={v} label={v}>
              <IconButton label="Repos" variant={v}><Icon name="menu" /></IconButton>
              <IconButton label="Hover" variant={v} className="is-hover"><Icon name="menu" /></IconButton>
              <IconButton label="Focus" variant={v} className="is-focus"><Icon name="menu" /></IconButton>
              <IconButton label="Actif" variant={v} className="is-active"><Icon name="menu" /></IconButton>
              <IconButton label="Désactivé" variant={v} disabled><Icon name="menu" /></IconButton>
            </Row>
          ))}
        </Block>
      </Section>
    </div>
  );
}
