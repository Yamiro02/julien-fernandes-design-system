import { useState } from 'react';
import { BeforeAfter, CodeBlock, QuoteBlock, StepCard } from '@julienfernandes/ds';
import { Block, Grid, Section } from '../ui';

const SNIPPET = 'npm create vite@latest app\ncd app && claude';

export function ContentPage() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="CodeBlock" note="JetBrains Mono ne sert qu'ici et dans les métadonnées techniques — jamais pour du corps de texte.">
        <Block label="Avec nom de fichier">
          <CodeBlock
            filename="~/projects/app"
            code={SNIPPET}
            copied={copied}
            onCopy={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); }}
          />
        </Block>
        <Block label="Avec langage, et état copié">
          <CodeBlock language="bash" code="claude --version" />
          <CodeBlock language="bash" code="git tag v0.1.0 && git push --tags" copied />
        </Block>
      </Section>

      <Section title="StepCard" note="Le numéro d'étape est le seul dégradé de la card — le titre reste ink.">
        <Grid cols={3}>
          <StepCard step={1} title="Cadre l'idée">Une phrase, un utilisateur, un problème. Pas de features.</StepCard>
          <StepCard step={2} title="Pose les écrans">Trois écrans maximum pour la première version.</StepCard>
          <StepCard step={3} title="Lance le build">Claude Code écrit, tu relis et tu décides.</StepCard>
        </Grid>
      </Section>

      <Section title="BeforeAfter" note="Le dégradé vit uniquement sur la couture — jamais en aplat de panneau.">
        <Block label="Comparaison">
          <BeforeAfter
            before={<p>3 semaines de dev, un devis à 6 000 €, un cahier des charges de 12 pages.</p>}
            after={<p>Un week-end, une session Claude Code, zéro ligne écrite à la main.</p>}
          />
        </Block>
        <Block label="Libellés personnalisés">
          <BeforeAfter
            beforeLabel="SANS MÉTHODE"
            afterLabel="AVEC MÉTHODE"
            before={<p>Des prompts au hasard, un projet qui ne compile plus.</p>}
            after={<p>Un cadrage écrit, des lots courts, une recette à chaque étape.</p>}
          />
        </Block>
      </Section>

      <Section title="QuoteBlock" note="Corps de texte, pas Anton — Anton est réservé aux titres.">
        <Grid cols={2}>
          <QuoteBlock
            quote="J'ai construit cette app en un week-end avec Claude Code. Zéro ligne de code écrite à la main — juste la bonne méthode."
            author="Julien Fernandes"
            role="Busan · Corée du Sud"
          />
          <QuoteBlock quote="Le résultat, pas l'outil. La simplicité, pas la technique." />
        </Grid>
      </Section>
    </div>
  );
}
