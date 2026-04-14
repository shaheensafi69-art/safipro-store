import Link from "next/link";

export default function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#050505] pt-24 pb-12 text-white overflow-hidden font-sans">
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          
          {/* BRAND & VISION */}
          <div className="lg:col-span-5">
            <div className="mb-8">
              <h2 className="text-4xl font-light tracking-tighter uppercase">
                Safi<span className="font-bold text-[#D4AF37]">Pro</span>
              </h2>
              <div className="mt-2 h-[1px] w-12 bg-[#D4AF37]" />
              <p className="mt-4 text-[10px] tracking-[0.4em] uppercase text-gray-500">
                Premium Fashion Experience
              </p>
            </div>

            <p className="max-w-md text-sm leading-8 text-gray-400 font-light">
              Crafting a legacy of excellence. SafiPro represents the intersection 
              of modern digital innovation and timeless luxury aesthetics, 
              delivering premium quality to a global audience.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <img
                src="/shaheen.jpeg"
                alt="Shaheen Safi"
                className="h-12 w-12 rounded-full border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="border-l border-white/10 pl-4">
                <p className="text-xs font-bold tracking-widest uppercase">Shaheen Safi</p>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest mt-0.5">Founder & CEO</p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="lg:col-span-3">
            <h4 className="mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-600">Explore</h4>
            <ul className="space-y-4 text-[13px] tracking-wide">
              {['Home', 'Shop', 'About', 'Cart', 'Checkout'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase()}`} 
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-3" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL & CONNECT */}
          <div className="lg:col-span-4">
            <h4 className="mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-600">Identity</h4>
            <div className="space-y-4">
              {/* Facebook Button */}
              <a 
                href="https://www.facebook.com/profile.php?id=61568189925436" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-white/5 bg-white/[0.02] px-6 py-4 transition-all duration-500 hover:bg-[#D4AF37] hover:text-black"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Facebook</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              {/* LinkedIn Button */}
              <a 
                href="https://www.linkedin.com/company/112523933" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-white/5 bg-white/[0.02] px-6 py-4 transition-all duration-500 hover:bg-[#D4AF37] hover:text-black"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">LinkedIn</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              
              <div className="pt-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">HQ London</p>
                <p className="text-[12px] text-gray-500 italic">71-75 Shelton Street, Covent Garden</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-24 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">
              © {currentYear} SAFIPRO LTD
            </p>
            <p className="text-[9px] tracking-[0.1em] text-gray-700 uppercase border border-white/5 px-2 py-1">
              Company No: 17063286
            </p>
          </div>
          
          <div className="flex gap-8 text-[10px] tracking-[0.2em] text-gray-600 uppercase">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Background Graphic */}
      <div className="absolute -bottom-16 -right-10 pointer-events-none select-none opacity-[0.02] text-[18rem] font-black tracking-tighter">
        SAFI
      </div>
    </footer>
  );
}