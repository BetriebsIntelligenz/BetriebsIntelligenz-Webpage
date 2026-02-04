import React, { useState, useEffect } from 'react';
import { IntentBar } from './components/IntentBar';
import { ConceptHero } from './sections/ConceptHero';
import { Hero } from './sections/Hero';
import { ProblemSolution } from './sections/ProblemSolution';
import { Process } from './sections/Process';
import { Modules } from './sections/Modules';
import { DeepDiveDMN } from './sections/DeepDiveDMN';
import { Benefits } from './sections/Benefits';
import { Pricing } from './sections/Pricing';
import { FAQ } from './sections/FAQ';
import { StoryFlow } from './sections/StoryFlow';
import { Footer } from './components/Footer';
import { Logo } from './components/Logo';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Scroll hooks
  const { scrollYProgress } = useScroll();
  
  // Smooth progress for the progress bar
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Smooth progress for the blobs (slightly looser for organic feel)
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // --- Traveler Blob Configuration ---
  // Wanders from top to bottom of the viewport as you scroll the whole page
  const travelerY = useTransform(smoothProgress, [0, 1], ['5vh', '85vh']);
  // Weaves left and right
  const travelerX = useTransform(smoothProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    ['85vw', '15vw', '75vw', '25vw', '50vw']
  );
  const travelerRotate = useTransform(smoothProgress, [0, 1], [0, 180]);
  const travelerScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  // --- Ambient Background Parallax (Full Page Coverage) ---
  const y1 = useTransform(smoothProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(smoothProgress, [0, 1], ['0%', '-50%']);
  const r1 = useTransform(smoothProgress, [0, 1], [0, 90]);
  const r2 = useTransform(smoothProgress, [0, 1], [0, -90]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-brand-primary/20 selection:text-brand-primary overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* --- Dynamic Background System --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#F5F5F7]">
        
        {/* 1. THE TRAVELER BLOB (The main fluid guide) */}
        <motion.div
          style={{ 
            top: travelerY, 
            left: travelerX, 
            rotate: travelerRotate,
            scale: travelerScale
          }}
          className="absolute w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] -translate-x-1/2 -translate-y-1/2 z-0"
        >
           {/* Inner gradient blob with organic morph animation */}
           <div className="w-full h-full bg-gradient-to-br from-brand-primary/40 via-brand-secondary/40 to-brand-accent/40 rounded-full blur-[80px] mix-blend-multiply animate-blob filter" />
        </motion.div>


        {/* 2. Ambient Blobs (Context) */}
        {/* Top Left - Blue */}
        <motion.div 
          style={{ y: y1, rotate: r1 }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] mix-blend-multiply opacity-40 filter blur-[90px]"
        >
          <div className="w-full h-full bg-blue-200 rounded-full animate-blob-slow" />
        </motion.div>

        {/* Top Right - Purple */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[-5%] right-[-10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] mix-blend-multiply opacity-40 filter blur-[100px]"
        >
           <div className="w-full h-full bg-purple-200 rounded-full animate-blob" style={{ animationDelay: '2s' }} />
        </motion.div>

        {/* Bottom Left - Pinkish (Opposite Movement) */}
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], ['60vh', '20vh']), rotate: r2 }}
          className="absolute top-0 -left-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] mix-blend-multiply opacity-30 filter blur-[80px]"
        >
           <div className="w-full h-full bg-pink-200 rounded-full animate-blob" style={{ animationDelay: '4s' }} />
        </motion.div>

        {/* Bottom Right - Amber/Green (Static Anchor) */}
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], ['80vh', '40vh']) }}
          className="absolute top-0 -right-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] mix-blend-multiply opacity-30 filter blur-[90px]"
        >
           <div className="w-full h-full bg-brand-accent/20 rounded-full animate-blob-fast" style={{ animationDelay: '1s' }} />
        </motion.div>
      </div>

      {/* Sticky Header / Intent Hub */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 glass-panel shadow-sm' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer z-20 shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-10 h-10 text-brand-primary" />
            <span className={`font-bold text-xl tracking-tight hidden md:block transition-colors ${scrolled ? 'text-slate-800' : 'text-slate-900'}`}>
              BetriebsIntelligenz
            </span>
          </div>

          {/* The Intent Hub (Omnibox) - Replaces Nav */}
          <div className="flex-1 max-w-xl mx-auto hidden md:block z-10">
            <IntentBar compact={scrolled} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0 z-20">
            <button className="hidden md:flex px-5 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 transition-all">
              Login
            </button>
            <button className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:scale-105 hover:shadow-lg transition-all active:scale-95">
              Demo buchen
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-white/50 rounded-full backdrop-blur-md"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 z-40 bg-white/80 backdrop-blur-xl pt-28 px-6 md:hidden overflow-hidden"
          >
             <div className="flex flex-col gap-8">
                <IntentBar compact={false} />
                <nav className="flex flex-col gap-6 text-2xl font-semibold text-slate-800 tracking-tight">
                  <motion.a whileTap={{ scale: 0.95 }} href="#solutions" onClick={() => setMobileMenuOpen(false)}>Lösungen</motion.a>
                  <motion.a whileTap={{ scale: 0.95 }} href="#process" onClick={() => setMobileMenuOpen(false)}>Prozess</motion.a>
                  <motion.a whileTap={{ scale: 0.95 }} href="#benefits" onClick={() => setMobileMenuOpen(false)}>ROI</motion.a>
                  <motion.a whileTap={{ scale: 0.95 }} href="#pricing" onClick={() => setMobileMenuOpen(false)}>Preise</motion.a>
                </nav>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 space-y-32 md:space-y-48 relative z-10">
        <ConceptHero />
        <Hero />
        <ProblemSolution />
        <Process />
        <Modules />
        <DeepDiveDMN />
        <Benefits />
        <Pricing />
        <FAQ />
        
        {/* --- NEW STORY FLOW SECTION --- */}
        <StoryFlow />
        
      </main>

      <Footer />
    </div>
  );
};

export default App;