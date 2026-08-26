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
  { value: 'foundations', label: 'Fondations', render: () => <Foundations /> },
  { value: 'icons', label: 'Icônes', render: () => <IconsPage /> },
  { value: 'actions', label: 'Actions', render: () => <ActionsPage /> },
  { value: 'forms', label: 'Formulaires', render: () => <FormsPage /> },
  { value: 'data', label: 'Data display', render: () => <DataDisplayPage /> },
  { value: 'feedback', label: 'Feedback', render: () => <FeedbackPage /> },
  { value: 'overlays', label: 'Overlays', render: () => <OverlaysPage /> },
  { value: 'navigation', label: 'Navigation', render: () => <NavigationPage /> },
  { value: 'brand', label: 'Marque', render: () => <BrandPage /> },
];

const THEMES = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'split', label: 'Côte à côte' },
];

export function App() {
  const [page, setPage] = useState('foundations');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const current = PAGES.find(p => p.value === page) ?? PAGES[0];
  const body = current.render();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Chrome de la vitrine : opaque, pour que le contenu ne transparaisse pas
          derrière. La Navbar du DS est présentée comme spécimen, page Navigation. */}
      <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
        <div className="page flex flex-col gap-space-3 py-space-3">
          <div className="flex flex-wrap items-center justify-between gap-space-4">
            <div className="flex items-baseline gap-space-3">
              <Logo variant="wordmark" height="1.375rem" />
              <span className="caption">Design system · recette visuelle</span>
            </div>
            <Tabs items={THEMES} value={theme} onChange={setTheme} />
          </div>
          <div className="-mx-space-1 overflow-x-auto px-space-1 pb-space-1">
            <Tabs items={PAGES.map(p => ({ value: p.value, label: p.label }))} value={page} onChange={setPage} />
          </div>
        </div>
      </header>

      <main className="page py-space-7">
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
