import React, { useState, useEffect } from 'react'
import HeroPage from './HeroPage'
import FeaturesPage from './FeaturesPage'
import PlansPage from './PlansPage'
import SecurityPage from './SecurityPage'
import AboutPage from './AboutPage'
import EarlyAccessModal from './EarlyAccessModal'

export default function AxonApp({ onOpenChangeDetector }) {
  const [page, setPage] = useState('hero')
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false)

  // Update document title dynamically based on active section
  useEffect(() => {
    const titles = {
      hero: 'Axon — Digital Workers for Mundane Workflows',
      features: 'Features — Axon Platform Capabilities',
      plans: 'Pricing Plans — Axon Digital Workers',
      security: 'Security & Trust — Axon Enterprise Architecture',
      about: 'About Axon — Digital Workers for Mundane Workflows',
    }
    document.title = titles[page] || 'Axon — Digital Workers for Mundane Workflows'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <div className="relative font-sans text-[#1B133C]">
      {/* Active Page View */}
      {page === 'hero' && (
        <HeroPage
          setPage={setPage}
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />
      )}

      {page === 'features' && (
        <FeaturesPage
          setPage={setPage}
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />
      )}

      {page === 'plans' && (
        <PlansPage
          setPage={setPage}
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />
      )}

      {page === 'security' && (
        <SecurityPage
          setPage={setPage}
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />
      )}

      {page === 'about' && (
        <AboutPage
          setPage={setPage}
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />
      )}

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
      />

      {/* Discrete switcher to Change Detector Dashboard if requested */}
      {onOpenChangeDetector && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={onOpenChangeDetector}
            className="group flex items-center gap-2 bg-white/80 hover:bg-white text-[#1B133C] backdrop-blur-md px-3 py-1.5 rounded-full border border-[#1B133C]/10 text-xs font-medium shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100"
            title="Open Website Change Detector Engine"
          >
            <span>🛰️</span>
            <span className="hidden sm:inline">Change Detector</span>
          </button>
        </div>
      )}
    </div>
  )
}
