import React, { useState, useEffect } from 'react';
import { IntentBar } from './components/IntentBar';
import { Hero } from './sections/Hero';
import { ProblemSolution } from './sections/ProblemSolution';
import { Process } from './sections/Process';
import { Modules } from './sections/Modules';
import { DeepDiveDMN } from './sections/DeepDiveDMN';
import { Benefits } from './sections/Benefits';
import { Pricing } from './sections/Pricing';
import { FAQ } from './sections/FAQ';
import { Footer } from './components/Footer';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Dynamic Liquid Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#F5F5F7]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20">
              B
            </div>
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

      <main className="pt-32 pb-20 space-y-32 md:space-y-48">
        <Hero />
        <ProblemSolution />
        <Process />
        <Modules />
        <DeepDiveDMN />
        <Benefits />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default App;