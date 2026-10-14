import React, { useState } from 'react'
import HeroPage from './HeroPage'
import FeaturesPage from './FeaturesPage'
import PlansPage from './PlansPage'
import SecurityPage from './SecurityPage'
import AboutPage from './AboutPage'

export default function AxonApp() {
  const [page, setPage] = useState('home')

  // Update document title on nav
  React.useEffect(() => {
    const titles = {
      home: 'Axon — Digital Workers for Mundane Workflows',
      features: 'Features — Axon',
      plans: 'Pricing Plans — Axon',
      security: 'Security & Trust — Axon',
      about: 'About Us — Axon',
    }
    document.title = titles[page] || 'Axon'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <>
      {page === 'home'     && <HeroPage     setPage={setPage} />}
      {page === 'features' && <FeaturesPage setPage={setPage} />}
      {page === 'plans'    && <PlansPage    setPage={setPage} />}
      {page === 'security' && <SecurityPage setPage={setPage} />}
      {page === 'about'    && <AboutPage    setPage={setPage} />}
    </>
  )
}
