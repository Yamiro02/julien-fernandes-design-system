import { useEffect, useState } from 'react';
import { Logo, Tabs } from '@julienfernandes/ds';
import { Foundations } from './pages/Foundations';
import { IconsPage } from './pages/Icons';
import { ActionsPage } from './pages/Actions';
import { FormsPage } from './pages/Forms';
import { DataDisplayPage } from './pages/DataDisplay';
import { FeedbackPage } from './pages/Feedback';
import { OverlaysPage } from './pages/Overlays';
import { NavigationPage } from './pages/Navigation';
import { BrandPage } from './pages/Brand';

const PAGES = [
  { value: 'brand', label: 'Marque', render: () => <BrandPage /> },
  { value: 'foundations', label: 'Fondations', render: () => <Foundations /> },
  { value: 'icons', label: 'Icônes', render: () => <IconsPage /> },
  { value: 'actions', label: 'Actions', render: () => <ActionsPage /> },
  { value: 'forms', label: 'Formulaires', render: () => <FormsPage /> },
  { value: 'data', label: 'Data display', render: () => <DataDisplayPage /> },
  { value: 'feedback', label: 'Feedback', render: () => <FeedbackPage /> },
  { value: 'overlays', label: 'Overlays', render: () => <OverlaysPage /> },
  { value: 'navigation', label: 'Navigation', render: () => <NavigationPage /> },
];

const THEMES = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'split', label: 'Côte à côte' },
];

export function App() {
  const [page, setPage] = useState('brand');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const current = PAGES.find(p => p.value === page) ?? PAGES[0];
  const body = current.render();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Chrome de la vitrine : la barre de marque seule. La Navbar du DS est
          présentée comme spécimen, page Navigation. */}
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="page flex flex-wrap items-center justify-between gap-space-4 py-space-3">
          <div className="flex items-baseline gap-space-3">
            <Logo variant="wordmark" height="1.375rem" />
            <span className="caption">Design system · recette visuelle</span>
          </div>
          <Tabs onCard items={THEMES} value={theme} onChange={setTheme} />
        </div>
      </header>

      <main className="page flex flex-col gap-space-6 py-space-7">
        {/* Les familles vivent dans le layout, pas dans le chrome : aucun fond,
            aucune bordure. Le groupe d'onglets est posé sur --background, il garde
            donc son fond --secondary et contraste avec la page.
            La marge négative empêche le scroll horizontal de rogner l'anneau de
            focus ; elle est imbriquée pour ne pas casser le centrage de .page. */}
        <nav aria-label="Familles de composants" className="-mx-space-1 overflow-x-auto px-space-1">
          <Tabs items={PAGES.map(p => ({ value: p.value, label: p.label }))} value={page} onChange={setPage} />
        </nav>

        {theme === 'split' ? (
          <div className="inline-grid w-full grid-cols-1 gap-space-5 lg:grid-cols-2">
            <Panel label="Clair">{body}</Panel>
            <Panel label="Sombre" dark>{current.render()}</Panel>
          </div>
        ) : body}
      </main>
    </div>
  );
}

function Panel({ label, dark, children }: { label: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className={`${dark ? 'dark' : ''} rounded-xl border border-border bg-background text-foreground shadow-sm`}>
      <div className="border-b border-border px-space-5 py-space-3">
        <span className="eyebrow">{label}</span>
      </div>
      <div className="p-space-5">{children}</div>
    </div>
  );
}
