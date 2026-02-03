import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Zap, Users, FileText, ChevronRight, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntentBarProps {
  compact?: boolean;
}

const TOP_INTENTS = [
  { id: 'audit', icon: Search, label: 'Audit vereinbaren', href: '#contact', color: 'bg-blue-500' },
  { id: 'pricing', icon: Zap, label: 'Preise ansehen', href: '#pricing', color: 'bg-amber-500' },
  { id: 'demo', icon: FileText, label: 'Demo Case ansehen', href: '#deep-dive', color: 'bg-purple-500' },
  { id: 'team', icon: Users, label: 'Experten entlasten', href: '#benefits', color: 'bg-green-500' },
];

export const IntentBar: React.FC<IntentBarProps> = ({ compact }) => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full group perspective-1000">
      {/* The Input Field (Spotlight Style) */}
      <motion.div 
        layout
        className={`relative flex items-center bg-white/70 backdrop-blur-xl border transition-all duration-300 ease-spring
          ${focused ? 'shadow-[0_0_0_4px_rgba(0,122,255,0.15)] border-brand-primary/50' : 'border-white/50 shadow-sm hover:shadow-md'}
          ${compact ? 'h-11 rounded-full' : 'h-14 rounded-2xl'}
        `}
      >
        <div className="pl-4 text-slate-400">
          <Search size={compact ? 18 : 20} />
        </div>
        <input
          type="text"
          className="w-full bg-transparent border-none outline-none px-3 text-slate-800 placeholder:text-slate-400 font-medium text-base"
          placeholder={compact ? "Was ist Ihr Ziel?" : "Was möchten Sie erreichen?"}
          onFocus={() => setFocused(true)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="pr-3 flex items-center gap-2">
          <AnimatePresence mode="popLayout">
            {(focused || query.length > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="p-1.5 bg-brand-primary rounded-full text-white shadow-lg shadow-brand-primary/30 hover:scale-105 transition-transform"
              >
                <ArrowRight size={16} />
              </motion.button>
            )}
            {(!focused && !query && !compact) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/50 font-medium"
              >
                <Command size={10} /><span>K</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* The Dropdown (Intent Results) */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-full left-0 right-0 mt-3 p-2 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-float z-50 overflow-hidden"
          >
            {query.length === 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Vorgeschlagene Schritte
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {TOP_INTENTS.map((intent) => (
                    <motion.a
                      key={intent.id}
                      href={intent.href}
                      onClick={() => setFocused(false)}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.6)' }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group"
                    >
                      <div className={`w-9 h-9 rounded-xl ${intent.color} flex items-center justify-center text-white shadow-sm`}>
                        <intent.icon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">{intent.label}</span>
                        <span className="text-[11px] text-slate-500">Schnellzugriff</span>
                      </div>
                      <div className="ml-auto w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight size={14} />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p className="font-medium">Suche nach "{query}"...</p>
                <p className="text-xs mt-2 text-slate-400">Das volle System würde hier semantische Ergebnisse anzeigen.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};