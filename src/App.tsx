import React, { useState } from 'react';
import { OrganSyncProvider } from './context/OrganSyncContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrgansPage } from './pages/OrgansPage';
import { RecipientsPage } from './pages/RecipientsPage';
import { MatchEnginePage } from './pages/MatchEnginePage';
import { CompatibilityGraphPage } from './pages/CompatibilityGraphPage';
import { PriorityQueuePage } from './pages/PriorityQueuePage';
import { TransportQueuePage } from './pages/TransportQueuePage';
import { AlgorithmsPage } from './pages/AlgorithmsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'organs':
        return <OrgansPage />;
      case 'recipients':
        return <RecipientsPage />;
      case 'matching':
        return <MatchEnginePage setActiveTab={setActiveTab} />;
      case 'graph':
        return <CompatibilityGraphPage setActiveTab={setActiveTab} />;
      case 'priority':
        return <PriorityQueuePage setActiveTab={setActiveTab} />;
      case 'transport':
        return <TransportQueuePage setActiveTab={setActiveTab} />;
      case 'algorithms':
        return <AlgorithmsPage />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <OrganSyncProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <Footer setActiveTab={setActiveTab} />
      </div>
    </OrganSyncProvider>
  );
}

export default App;
