import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MonitorList from './components/MonitorList';
import AddMonitorModal from './components/AddMonitorModal';
import VisualPicker from './components/VisualPicker';
import DiffStudio from './components/DiffStudio';
import NumberTracker from './components/NumberTracker';
import ArchitectureHub from './components/ArchitectureHub';
import AlertsHub from './components/AlertsHub';
import { fetchMonitors, fetchQueueStatus } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [monitors, setMonitors] = useState([]);
  const [queueMetrics, setQueueMetrics] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMonitorForDiff, setSelectedMonitorForDiff] = useState('');
  const [selectedUrlForPicker, setSelectedUrlForPicker] = useState('');

  // Initial load and periodic telemetry polling
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle URL query parameters (e.g. from Bookmarklet)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addUrl = params.get('add_url');
    if (addUrl) {
      setSelectedUrlForPicker(addUrl);
      setIsAddModalOpen(true);
    }
  }, []);

  const loadData = async () => {
    try {
      const [monRes, queueRes] = await Promise.all([
        fetchMonitors(),
        fetchQueueStatus()
      ]);
      if (monRes?.success) setMonitors(monRes.monitors);
      if (queueRes?.success) setQueueMetrics(queueRes);
    } catch (e) {
      console.error('Polling error:', e);
    }
  };

  const handleMonitorCreated = (newMon) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#1B133C', '#F97316', '#7C3AED']
    });
    loadData();
    setActiveTab('dashboard');
  };

  const handleSelectDiff = (monitorId) => {
    setSelectedMonitorForDiff(monitorId);
    setActiveTab('diff');
  };

  const handleSelectPicker = (url) => {
    setSelectedUrlForPicker(url);
    setActiveTab('picker');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6FC] via-white to-[#F2EFFE] text-[#1B133C] flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        queueMetrics={queueMetrics?.queue}
      />

      {/* Hero Banner (visible on dashboard) */}
      {activeTab === 'dashboard' && (
        <HeroBanner
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onExperienceClick={() => setActiveTab('picker')}
          metrics={queueMetrics?.metrics}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <MonitorList
            monitors={monitors}
            onRefresh={loadData}
            onSelectDiff={handleSelectDiff}
            onSelectPicker={handleSelectPicker}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'picker' && (
          <VisualPicker
            initialUrl={selectedUrlForPicker}
            onSelectSelectors={(selectors) => {
              setIsAddModalOpen(true);
            }}
          />
        )}

        {activeTab === 'diff' && (
          <DiffStudio
            monitors={monitors}
            selectedMonitorId={selectedMonitorForDiff}
            onSelectMonitor={setSelectedMonitorForDiff}
          />
        )}

        {activeTab === 'number' && (
          <NumberTracker
            monitors={monitors}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureHub />
        )}

        {activeTab === 'alerts' && (
          <AlertsHub
            monitors={monitors}
          />
        )}
      </main>

      {/* Add Monitor Modal */}
      <AddMonitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={handleMonitorCreated}
      />

      {/* Footer in clean light frosted styling */}
      <footer className="border-t border-[#1B133C]/10 bg-white/70 backdrop-blur-md py-8 text-center text-xs font-mono text-[#1B133C]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#1B133C] font-bold">Horizon</span>
            <span>— Autonomous Web Change Intelligence Suite</span>
          </div>
          <div>
            Powered by Headless Chromium Sandboxes, Noise Filtering & Request Coalescing Pool
          </div>
        </div>
      </footer>
    </div>
  );
}
