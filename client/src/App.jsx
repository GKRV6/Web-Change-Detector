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
import EarlyAccessModal from './axon/EarlyAccessModal';
import { fetchMonitors, fetchQueueStatus } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [monitors, setMonitors] = useState([]);
  const [queueMetrics, setQueueMetrics] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
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

  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll listener for silky downward motion while scrolling down
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectPicker = (url) => {
    setSelectedUrlForPicker(url);
    setActiveTab('picker');
  };

  return (
    <div className="min-h-screen relative text-[#1B133C] flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Full-Viewport Looping Motion Video (glides smoothly down while scrolling down) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[25vh] -left-[3vw] w-[106vw] h-[155vh] will-change-transform transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(0, ${Math.min(scrollY * 0.22, 220)}px, 0)`
          }}
        >
          <video
            className="w-full h-full object-cover will-change-[object-position] transition-[object-position] duration-150 ease-out scale-105"
            style={{
              filter: 'saturate(1.48) contrast(1.08) brightness(1.02)',
              objectPosition: `center ${Math.min(scrollY * 0.05, 45)}%`
            }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        {/* Soft frosted ambient overlays: vibrant motion shines through with crisp text legibility */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/35 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
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
            onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
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

        {/* Early Access Waitlist Modal */}
        <EarlyAccessModal
          isOpen={isEarlyAccessOpen}
          onClose={() => setIsEarlyAccessOpen(false)}
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
    </div>
  );
}
