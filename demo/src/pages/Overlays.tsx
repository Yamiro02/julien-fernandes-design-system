import { useState } from 'react';
import { ActionSheet, Button, Dropdown, Icon, Modal } from '@julienfernandes/ds';
import { Block, Row, Section } from '../ui';

const MENU = [
  { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
  { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" /> },
  { label: 'Voir les stats', icon: <Icon name="trending-up" size="1rem" /> },
];

export function OverlaysPage() {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [phase, setPhase] = useState<'confirm' | 'loading' | 'result'>('confirm');
  const [statut, setStatut] = useState<'success' | 'error'>('success');
  const ouvrir = (p: 'confirm' | 'loading' | 'result', s?: 'success' | 'error') => {
    setPhase(p);
    if (s) setStatut(s);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Modal" note="Panneau sur --popover, rayon 2xl, --shadow-lg, au-dessus d'un scrim --tone-dark à 45 % avec blur(2px). Largeur 23.75rem au-dessus de 64 rem ; en dessous, la MÊME modale devient une feuille basse — pleine largeur, coins hauts arrondis, poignée, entrée par le bas. Aucun JS de point de rupture : c'est du CSS.">
        <Block label="En vrai" hint="Le focus entre dans le panneau, y est piégé, Échap ferme, le focus revient au déclencheur, et le défilement de la page est verrouillé tant que la modale est ouverte. Réduis la fenêtre sous 1024 px pour la voir en feuille basse.">
          <Row>
            <Button variant="danger" onClick={() => ouvrir('confirm')}>Supprimer ce build</Button>
          </Row>
          <Row label="ouvrir directement dans une phase — en loading, rien ne ferme">
            <Button variant="secondary" size="sm" onClick={() => ouvrir('loading')}>loading</Button>
            <Button variant="secondary" size="sm" onClick={() => ouvrir('result', 'success')}>result succès</Button>
            <Button variant="secondary" size="sm" onClick={() => ouvrir('result', 'error')}>result erreur</Button>
          </Row>
          <Modal
            open={open}
            phase={phase}
            onClose={() => setOpen(false)}
            icon={<Icon name="triangle-alert" size="1.25rem" />}
            title={phase === 'loading' ? 'Suppression en cours' : 'Supprimer ce build ?'}
            description={phase === 'loading' ? 'Ne ferme pas cette fenêtre.' : 'Cette action est définitive.'}
            result={{
              status: statut,
              title: statut === 'error' ? 'La suppression a échoué' : 'Build supprimé',
              message: statut === 'error'
                ? 'Le service n’a pas répondu dans le délai imparti. Les fichiers sont intacts et le build reste disponible : réessaie dans un instant, ou vérifie la connexion avant de relancer.'
                : 'Les fichiers et la configuration ont été retirés du projet.',
              onRetry: statut === 'error' ? () => ouvrir('confirm') : undefined,
            }}
            footer={phase === 'result' ? undefined : (
              phase === 'loading'
                ? <><Button variant="ghost" disabled>Annuler</Button><Button variant="danger" loading>Suppression…</Button></>
                : <><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="danger" onClick={() => ouvrir('loading')}>Supprimer</Button></>
            )}
          />
        </Block>

        <Block label="Les trois phases" hint="confirm → loading → result, dans UN seul dialogue. En loading rien ne ferme : Échap, clic dehors et croix sont inertes, le piège de focus tient toujours.">
          <div className="flex flex-wrap gap-space-5">
            <Modal inline iconVariant="danger" icon={<Icon name="trash-2" size="1.25rem" />}
              title="Supprimer ce build ?" description="Cette action est définitive."
              footer={<><Button variant="ghost" size="sm">Annuler</Button><Button variant="danger" size="sm">Supprimer</Button></>} />
            <Modal inline phase="loading" iconVariant="danger" icon={<Icon name="trash-2" size="1.25rem" />}
              onClose={() => undefined}
              title="Suppression en cours" description="Ne ferme pas cette fenêtre."
              footer={<><Button variant="ghost" size="sm" disabled>Annuler</Button><Button variant="danger" size="sm" loading>Suppression…</Button></>} />
            <Modal inline phase="result" onClose={() => undefined}
              result={{ status: 'success', title: 'Build supprimé', message: 'Les fichiers et la configuration ont été retirés du projet.' }} />
            <Modal inline phase="result" iconVariant="danger" onClose={() => undefined}
              result={{
                status: 'error',
                title: 'La suppression a échoué',
                message: 'Le service n’a pas répondu dans le délai imparti. Les fichiers sont intacts et le build reste disponible : réessaie dans un instant, ou vérifie la connexion avant de relancer.',
                onRetry: () => undefined,
              }} />
          </div>
        </Block>

        <Block label="Variantes de tuile d'icône" hint="La tuile est une <Pastille size=&quot;dialogue&quot;>. neutral lit la paire --pill-neutral-* comme Badge, Banner et Toast — une seule source sémantique.">
          <div className="flex flex-wrap gap-space-5">
            <Modal inline iconVariant="danger" icon={<Icon name="triangle-alert" size="1.25rem" />}
              title="Supprimer ce build ?" description="Cette action est définitive."
              footer={<><Button variant="ghost" size="sm">Annuler</Button><Button variant="danger" size="sm">Supprimer</Button></>} />
            <Modal inline iconVariant="brand" icon={<Icon name="rocket" size="1.25rem" />}
              title="Lancer le build ?" description="Claude Code va créer le projet et installer les dépendances."
              footer={<><Button variant="ghost" size="sm">Plus tard</Button><Button size="sm">Lancer</Button></>} />
            <Modal inline iconVariant="neutral" icon={<Icon name="info" size="1.25rem" />}
              title="À propos de cette série" description="Trois vidéos pour construire ton premier outil interne."
              footer={<Button variant="secondary" size="sm">Compris</Button>} />
            <Modal inline iconVariant="warning" icon={<Icon name="clock" size="1.25rem" />}
              title="Quota bientôt atteint" description="Il te reste deux exports ce mois-ci."
              footer={<Button variant="secondary" size="sm">Compris</Button>} />
            <Modal inline iconVariant="success" icon={<Icon name="circle-check" size="1.25rem" />}
              title="Déploiement terminé" description="Ton outil est en ligne."
              footer={<Button variant="secondary" size="sm">Voir</Button>} />
          </div>
        </Block>

        <Block label="Sans icône, avec fermeture">
          <Modal inline onClose={() => undefined} title="Ta session a expiré" description="Reconnecte-toi pour reprendre là où tu en étais."
            footer={<Button size="sm">Se reconnecter</Button>} />
        </Block>
      </Section>

      <Section title="ActionSheet" note="Le menu ⋯ sur mobile : une feuille basse d'actions, Annuler intégré. Chaque ligne fait au moins --control-md — le rail tactile, non négociable.">
        <Block label="La doctrine ⋯" hint="Dropdown est desktop only. Sous 64 rem, un menu ⋯ ouvre TOUJOURS une ActionSheet, jamais un Dropdown. Ce ne sont pas deux composants concurrents : c'est le même geste sur deux tailles d'écran. Au-dessus de 64 rem, .ds-scrim--sheet est en display:none — une ActionSheet modale y est impossible par construction, et le composant le signale en console en développement.">
          <Row>
            <Button variant="secondary" onClick={() => setSheet(true)}>Ouvrir le menu ⋯</Button>
          </Row>
          <ActionSheet
            open={sheet}
            onCancel={() => setSheet(false)}
            items={[...MENU.map(m => ({ ...m, onSelect: () => setSheet(false) })),
              { separator: true },
              { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true, onSelect: () => setSheet(false) }]}
          />
        </Block>

        <Block label="inline panel — la forme desktop" hint="Au-dessus de 64 rem elle n'existe qu'en spécimen : 20rem, quatre coins au rayon 2xl, bordure complète, sans poignée, sans voile.">
          <Row>
            <ActionSheet inline panel items={MENU} />
            <ActionSheet inline panel items={[...MENU,
              { separator: true },
              { label: 'Supprimer la vidéo', icon: <Icon name="trash-2" size="1rem" />, danger: true }]} />
            <ActionSheet inline panel
              title="Vidéo 3 — le déploiement"
              subtitle="Publiée le 24 septembre"
              note="La suppression retire aussi la miniature et les sous-titres. Elle est définitive."
              items={[...MENU,
                { separator: true },
                { label: 'Supprimer la vidéo', icon: <Icon name="trash-2" size="1rem" />, danger: true }]} />
          </Row>
        </Block>
      </Section>

      <Section title="Dropdown" note="Panneau de menu, rayon 2xl, --shadow-lg. Les items s'éclairent sur --accent. DESKTOP ONLY — sous 64 rem, c'est l'ActionSheet ci-dessus qui prend le relais.">
        <Block label="inline — rendu dans le flux" hint="Posé à côté de l'ActionSheet ci-dessus, la parenté se voit : mêmes lignes, mêmes tons, même séparateur. Seule la surface change.">
          <Row>
            <Dropdown inline items={[
              { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
              { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" />, hint: '⏎' },
              { label: 'Voir les stats', icon: <Icon name="trending-up" size="1rem" /> },
              { separator: true },
              { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
            ]} />
            <Dropdown inline items={[
              { label: 'Item au repos', icon: <Icon name="file-text" size="1rem" /> },
              { label: 'Item survolé', icon: <Icon name="file-text" size="1rem" /> },
              { separator: true },
              { label: 'Action risquée', icon: <Icon name="triangle-alert" size="1rem" />, danger: true },
            ]} />
          </Row>
        </Block>
      </Section>

    </div>
  );
}
