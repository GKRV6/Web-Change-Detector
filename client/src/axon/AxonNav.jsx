import React from 'react'

export default function AxonNav({ activePage, setPage, onOpenEarlyAccess }) {
  const NAV_LINKS = ['Features', 'Plans', 'Security', 'About']

  return (
    <header className="relative z-10 flex justify-center pt-4 md:pt-6 px-4">
      <nav className="bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm flex items-center gap-6 md:gap-8">
        {/* Custom SVG logo: two geometric arrow/chevron shapes in #1B133C, 24x24px */}
        <button
          onClick={() => setPage('hero')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none bg-transparent border-0 p-0"
          aria-label="Axon Home"
          title="Axon Home"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" fill="#1B133C" />
            <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" fill="#1B133C" />
          </svg>
        </button>

        {/* Navigation links (hidden on mobile, shown sm: and up) */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const pageId = link.toLowerCase()
            const isActive = activePage === pageId
            return (
              <button
                key={link}
                onClick={() => setPage(pageId)}
                className={`text-sm font-medium text-[#1B133C]/80 hover:text-[#1B133C] hover:opacity-100 transition-opacity duration-200 cursor-pointer bg-transparent border-0 p-0 ${
                  isActive ? '!text-[#1B133C] !opacity-100 font-semibold' : ''
                }`}
              >
                {link}
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
