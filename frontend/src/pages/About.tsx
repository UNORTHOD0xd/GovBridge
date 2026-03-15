import { Link } from "react-router-dom";

const BEFORE_ITEMS = [
  {
    agency: "TAJ",
    service: "Tax Compliance Certificate",
    pain: "Online application exists, but still requires in-person visit with physical documents and an interview. Processing takes 24+ hours.",
    time: "1-2 days",
    cost: "Varies",
  },
  {
    agency: "RGD",
    service: "Birth Certificate",
    pain: "Must know your birth entry number to apply online. No number means a manual mail-in search. Processing takes 2-6 weeks.",
    time: "2-6 weeks",
    cost: "US$55-85",
  },
  {
    agency: "JCF",
    service: "Police Record",
    pain: "Fill out an online form, then print it and bring it to an in-person appointment. Normal processing takes 21 working days.",
    time: "5-21 days",
    cost: "J$3,000-6,000",
  },
];

const PILLARS = [
  {
    title: "One Identity",
    subtitle: "NIDS + JDXP",
    description:
      "Verify your National Identification Number once through the Jamaica Data Exchange Platform. No more presenting multiple documents at every office.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    title: "One Payment Rail",
    subtitle: "Jam-Dex CBDC",
    description:
      "Pay all government fees with Jamaica's central bank digital currency. No cash lines, no separate payment portals per agency.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Verified Documents",
    subtitle: "On-Chain Hashes",
    description:
      "Every issued certificate is hashed on-chain. Employers, banks, and embassies can verify authenticity instantly without calling the issuing agency.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-yellow-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 sm:gap-3">
            <img src="/coat-of-arms.svg" alt="Jamaica Coat of Arms" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-white font-bold text-lg sm:text-xl">GovBridge</span>
          </Link>
          <Link
            to="/login"
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Three agencies. Three logins.
          <br />
          <span className="text-yellow-400">Weeks of waiting.</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
          Jamaica is building NIDS for identity and JDXP for data exchange, but citizens still
          visit separate offices with separate logins to get basic government certificates.
          GovBridge is the citizen-facing layer that ties it all together.
        </p>
      </section>

      {/* The Problem */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">The Problem Today</h2>
        <p className="text-green-200 text-sm sm:text-base mb-6 sm:mb-8">
          Getting three common government certificates means navigating three separate agencies,
          each with its own identity check, payment method, and processing timeline.
        </p>
        <div className="grid gap-3 sm:gap-4">
          {BEFORE_ITEMS.map((item) => (
            <div
              key={item.agency}
              className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/10 text-white text-xs font-mono px-2 py-0.5 rounded">
                      {item.agency}
                    </span>
                    <h3 className="text-white font-semibold text-sm sm:text-base">{item.service}</h3>
                  </div>
                  <p className="text-green-200/80 text-xs sm:text-sm mt-1">{item.pain}</p>
                </div>
                <div className="flex sm:flex-col sm:text-right gap-2 sm:gap-0 shrink-0">
                  <p className="text-yellow-400 font-semibold text-xs sm:text-sm">{item.time}</p>
                  <p className="text-green-300/60 text-xs">{item.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-green-300/60 text-xs sm:text-sm text-center">
          10% of Jamaican adults have no formal identification, locking them out of these services entirely.
        </p>
      </section>

      {/* The Solution */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How GovBridge Fixes This</h2>
        <p className="text-green-200 text-sm sm:text-base mb-6 sm:mb-8">
          One portal built on Jamaica's emerging digital public infrastructure.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm"
            >
              <div className="text-green-400 mb-3 sm:mb-4">{pillar.icon}</div>
              <h3 className="text-white font-bold text-base sm:text-lg">{pillar.title}</h3>
              <p className="text-green-400 text-xs font-mono mb-2">{pillar.subtitle}</p>
              <p className="text-green-200/80 text-xs sm:text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4 sm:p-6">
            <h3 className="text-red-300 font-bold text-base sm:text-lg mb-3 sm:mb-4">Without GovBridge</h3>
            <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-red-200/80">
              <li className="flex gap-2 sm:gap-3">
                <span className="text-red-400 font-bold shrink-0">1.</span>
                Visit TAJ office with physical documents, wait for TCC
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="text-red-400 font-bold shrink-0">2.</span>
                Visit RGD with birth entry number, wait 2-6 weeks for birth cert
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="text-red-400 font-bold shrink-0">3.</span>
                Visit JCF, print form, attend appointment, wait 5-21 days for police record
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="text-red-400 font-bold shrink-0">=</span>
                <span className="text-red-300 font-semibold">3 agencies, 3 identity checks, 3 payment methods, weeks of waiting</span>
              </li>
            </ol>
          </div>
          <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4 sm:p-6">
            <h3 className="text-green-300 font-bold text-base sm:text-lg mb-3 sm:mb-4">With GovBridge</h3>
            <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-green-200/80">
              <li className="flex gap-2 sm:gap-3">
                <span className="text-green-400 font-bold shrink-0">1.</span>
                Verify identity once via NIDS through the JDXP
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="text-green-400 font-bold shrink-0">2.</span>
                Request all three services from one dashboard
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="text-green-400 font-bold shrink-0">3.</span>
                Pay with Jam-Dex in a single transaction
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="text-green-400 font-bold shrink-0">=</span>
                <span className="text-green-300 font-semibold">1 login, 1 payment, blockchain-verified documents in minutes</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Why Blockchain */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <h3 className="text-white font-bold text-base sm:text-lg mb-2">Why On-Chain Verification?</h3>
          <p className="text-green-200/80 text-xs sm:text-sm leading-relaxed">
            Jamaica's government certificates are paper-based. When an employer, bank, or embassy
            needs to verify a certificate's authenticity, they have to contact the issuing agency
            directly. GovBridge hashes every issued document on-chain (Base L2), so any third party
            can verify authenticity instantly and independently. This is especially critical for the
            Jamaican diaspora, who currently mail physical documents internationally and wait weeks
            for verification.
          </p>
        </div>
      </section>

      {/* Built On */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
        <p className="text-center text-green-300/50 text-xs">
          Built on Jamaica's digital public infrastructure: NIDS &middot; JDXP &middot; Jam-Dex &middot; Base L2
        </p>
      </section>
    </div>
  );
}
