import { useState } from 'react';
import { Banner, Button, EmptyState, Icon, Skeleton, SkeletonCard, Toast } from '@julienfernandes/ds';
import { Block, Grid, Section, Stack } from '../ui';

export function FeedbackPage() {
  const [closed, setClosed] = useState(false);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Toast" note="Retour transitoire, en bas à droite du viewport. Toujours couleur + icône + texte.">
        <Block label="Tons">
          <Stack>
            <Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." />
            <Toast tone="danger" title="Ça a planté, on réessaie ?" description="Le build n'a pas pu démarrer." />
            <Toast tone="warning" title="Version de la CLI ancienne" description="Mets à jour avant de relancer." />
            <Toast tone="info" title="Build en file d'attente" description="Ça démarre dans quelques secondes." />
          </Stack>
        </Block>
        <Block label="Avec fermeture">
          {closed
            ? <Button variant="secondary" size="sm" onClick={() => setClosed(false)}>Réafficher le toast</Button>
            : <Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." onClose={() => setClosed(true)} />}
        </Block>
      </Section>

      <Section title="Banner" note="Message inline persistant, dans une page ou une card.">
        <Block label="Tons">
          <Stack>
            <Banner tone="info" title="Nouvelle série en ligne">Trois vidéos pour construire ton premier outil interne.</Banner>
            <Banner tone="warning" title="Ce tuto date de mars">La CLI a changé depuis — la méthode reste bonne.</Banner>
            <Banner tone="success" title="Build terminé">Ton app tourne en local sur le port 5173.</Banner>
            <Banner tone="danger" title="Ça a planté, on réessaie ?">La commande s'est arrêtée avant la fin.</Banner>
          </Stack>
        </Block>
        <Block label="Avec action">
          <Banner tone="warning" title="Ce tuto date de mars" action={<Button size="sm" variant="secondary">Voir la mise à jour</Button>}>
            La CLI a changé depuis — la méthode reste bonne.
          </Banner>
        </Block>
      </Section>

      <Section title="EmptyState" note="Nommer le vide et donner l'étape suivante. Bordure pointillée, tuile d'icône en lavis de dégradé.">
        <Grid cols={2}>
          <Block label="Complet">
            <EmptyState
              icon={<Icon name="folder" size="1.5rem" />}
              title="Aucun build ici"
              description="Choisis une série pour voir les vidéos correspondantes."
              action={<Button variant="secondary">Voir tout</Button>}
            />
          </Block>
          <Block label="Sans action">
            <EmptyState
              icon={<Icon name="search" size="1.5rem" />}
              title="Rien ne correspond"
              description="Essaie un autre mot-clé, ou repars de la liste complète."
            />
          </Block>
        </Grid>
      </Section>

      <Section title="Skeleton" note="Placeholder de chargement sur --muted, shimmer de 1.4s.">
        <Block label="Formes">
          <Stack>
            <Skeleton width="12rem" height="1.25rem" />
            <Skeleton width="20rem" height="0.75rem" />
            <Skeleton height="9rem" radius="var(--radius-lg)" />
            <Skeleton width="5.5rem" height="1.125rem" radius="var(--radius-pill)" />
          </Stack>
        </Block>
        <Block label="SkeletonCard" hint="Une par emplacement de grille pendant le chargement.">
          <Grid cols={3}>
            <SkeletonCard />
            <SkeletonCard lines={3} />
            <SkeletonCard media={false} lines={4} />
          </Grid>
        </Block>
      </Section>
    </div>
  );
}
