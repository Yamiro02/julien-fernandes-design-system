import { useState } from 'react';
import { Button, Dropdown, Icon, Modal } from '@julienfernandes/ds';
import { Block, Row, Section } from '../ui';

export function OverlaysPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Modal" note="Panneau sur --popover, rayon 2xl, --shadow-lg, au-dessus d'un scrim ink à 45 % avec blur(2px). Largeur 23.75rem.">
        <Block label="En vrai" hint="Échap ferme, le focus est piégé dans le panneau puis rendu au déclencheur.">
          <Row>
            <Button variant="danger" onClick={() => setOpen(true)}>Supprimer ce build</Button>
          </Row>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            icon={<Icon name="triangle-alert" size="1.25rem" />}
            title="Supprimer ce build ?"
            description="Cette action est définitive."
            footer={<>
              <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Supprimer</Button>
            </>}
          />
        </Block>

        <Block label="Variantes de tuile d'icône" hint="inline — le panneau sans le scrim, pour la recette. La modale garde sa largeur propre de 23.75rem.">
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
          </div>
        </Block>

        <Block label="Sans icône, avec fermeture">
          <Modal inline onClose={() => undefined} title="Ta session a expiré" description="Reconnecte-toi pour reprendre là où tu en étais."
            footer={<Button size="sm">Se reconnecter</Button>} />
        </Block>
      </Section>

      <Section title="Dropdown" note="Panneau de menu, rayon 2xl, --shadow-lg. Les items s'éclairent sur --accent.">
        <Block label="inline — rendu dans le flux">
          <Row>
            <Dropdown inline items={[
              { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
              { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" />, hint: '⏎' },
              { label: 'Voir les stats', icon: <Icon name="trending-up" size="1rem" /> },
              { separator: true },
              { label: 'Supprimer', icon: <Icon name="x" size="1rem" />, danger: true },
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
