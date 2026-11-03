import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-[#EBE5DC] pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#EBE5DC]">
          
          {/* Brand Info (Left Column) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#CD92EB] text-[#141416] flex items-center justify-center font-serif font-bold text-base shadow-xs">
                M
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl text-[#141416] tracking-tight">
                  MILC
                </span>
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="w-2 h-2 rounded-full bg-[#CD92EB]" />
                  <span className="w-2 h-2 rounded-full bg-[#D4FF3F]" />
                  <span className="w-2 h-2 rounded-full bg-[#E04234]" />
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed max-w-sm">
              AI-driven facial biometrics and adaptive 7-day skincare routines.
            </p>

            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed max-w-sm">
              Calibrated with our signature three-tier formula synergy:{" "}
              <span className="text-[#141416] font-medium">Lavender (Calm)</span>,{" "}
              <span className="text-[#141416] font-medium">Chartreuse (Energy)</span>,{" "}
              <span className="text-[#141416] font-medium">Tomato Red (Vitality)</span>.
            </p>

            <p className="text-xs text-[#71717A] leading-relaxed pt-1">
              Backed by board-certified dermatological research.
            </p>
          </div>

          {/* Navigation Links (Middle Column) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#141416]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#52525B]">
              <li>
                <a href="#explore" className="hover:text-[#141416] transition-colors">
                  Explore
                </a>
              </li>
              <li>
                <a href="#skin-flow" className="hover:text-[#141416] transition-colors">
                  Your Skin Flow
                </a>
              </li>
              <li>
                <a href="#formula-synergy" className="hover:text-[#141416] transition-colors">
                  Formula Synergy
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-[#141416] transition-colors">
                  Transformations
                </a>
              </li>
            </ul>
          </div>

          {/* Clinical & Compliance (Right Column) */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#141416]">
              Clinical &amp; Compliance
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#52525B]">
              <li>
                <a href="#privacy" className="hover:text-[#141416] transition-colors">
                  On-Device Privacy Architecture
                </a>
              </li>
              <li>
                <a href="#trial-disclosures" className="hover:text-[#141416] transition-colors">
                  Spectrophotometric Trial Disclosures
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#141416] transition-colors">
                  Terms of Protocol
                </a>
              </li>
              <li className="pt-1.5">
                <a
                  href="#sister-atelier"
                  className="font-medium text-[#141416] hover:text-[#E04234] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#141416]">✦</span>
                  <span>View Sister Atelier (MILC Indian Melanin Skincare) →</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© 2026 MILC Skincare Technologies Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#141416] transition-colors">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#141416] transition-colors">
              Twitter / X
            </a>
            <a href="#app-store" className="hover:text-[#141416] transition-colors">
              App Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
