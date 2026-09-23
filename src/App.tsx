import React, { Suspense, lazy, useState } from 'react';
import './index.css';
import { api } from './api';
import { ToastHost } from './store/ToastHost.tsx';

// Route-level code splitting: each screen ships in its own chunk so the
// initial bundle stays small. The designer (~150KB after minify) is the
// heaviest — it only loads once a user actually opens it.
const Auth = lazy(() => import('./Auth.tsx').then((m) => ({ default: m.Auth })));
const Selection = lazy(() => import('./Selection.tsx').then((m) => ({ default: m.Selection })));
const ProfessionalDesigner = lazy(() =>
    import('./ProfessionalDesigner.tsx').then((m) => ({ default: m.ProfessionalDesigner }))
);

const ScreenFallback: React.FC = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: '#64748b',
            fontSize: 14,
        }}
    >
        Yükleniyor...
    </div>
);

type View = 'auth' | 'selection' | 'designer';

const App: React.FC = () => {
  const [view, setView] = useState<View>('auth');
  const [selectedDoc, setSelectedDoc] = useState<{ moduleId: string, moduleName: string, template: string, customContent?: string, themeColor?: string } | null>(null);

  const handleLogin = () => setView('selection');

  const handleLogout = () => {
    api.setToken('');
    setView('auth');
  };

  const handleDocSelect = (moduleId: string, template: string, moduleName: string, customContent?: string, themeColor?: string) => {
    setSelectedDoc({ moduleId, moduleName, template, customContent, themeColor });
    setView('designer');
  };

  const handleBack = () => setView('selection');

  return (
    <>
      <ToastHost />
      <Suspense fallback={<ScreenFallback />}>
        {view === 'auth' && <Auth onLogin={handleLogin} />}
        {view === 'selection' && <Selection onSelect={handleDocSelect} onLogout={handleLogout} />}
        {view === 'designer' && selectedDoc && (
          <ProfessionalDesigner
            template={selectedDoc.template}
            customContent={selectedDoc.customContent}
            themeColor={selectedDoc.themeColor}
            docName={selectedDoc.moduleName}
            moduleId={selectedDoc.moduleId}
            onBack={handleBack}
          />
        )}
      </Suspense>
    </>
  );
};

export default App;
