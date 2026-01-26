import React, { useState } from 'react';
import './index.css';
import { Auth } from './Auth.tsx';
import { Selection } from './Selection.tsx';
import { ProfessionalDesigner } from './ProfessionalDesigner.tsx';
import { api } from './api';

type View = 'auth' | 'selection' | 'designer';

const App: React.FC = () => {
  const [view, setView] = useState<View>('auth');
  const [selectedDoc, setSelectedDoc] = useState<{ moduleId: string, moduleName: string, template: string, customContent?: string } | null>(null);

  const handleLogin = () => setView('selection');

  const handleLogout = () => {
    api.setToken('');
    setView('auth');
  };

  const handleDocSelect = (moduleId: string, template: string, moduleName: string, customContent?: string) => {
    setSelectedDoc({ moduleId, moduleName, template, customContent });
    setView('designer');
  };

  const handleBack = () => setView('selection');

  if (view === 'auth') return <Auth onLogin={handleLogin} />;
  if (view === 'selection') return <Selection onSelect={handleDocSelect} onLogout={handleLogout} />;

  if (view === 'designer' && selectedDoc) {
    return (
      <ProfessionalDesigner
        template={selectedDoc.template}
        customContent={selectedDoc.customContent}
        docName={selectedDoc.moduleName}
        moduleId={selectedDoc.moduleId}
        onBack={handleBack}
      />
    );
  }

  return null;
};

export default App;
