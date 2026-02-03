import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Network, Command, Calendar } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative px-4 md:px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-md text-brand-secondary text-sm font-semibold mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary"></span>
          </span>
          Ecosystem v2.0
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-8 tracking-tight text-slate-900">
          Schluss mit dem <br/>
          <span className="text-gradient">
            Onboarding-Chaos.
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
          Wir liefern keine leere Softwarehülle, sondern das <span className="text-slate-900 font-semibold">digitale Gehirn</span> Ihres Unternehmens.
          Schlüsselfertig, intelligent und sofort einsatzbereit.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-primary/40 transition-all flex items-center justify-center gap-2"
          >
            <span>Demo starten</span>
            <ArrowRight size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.8)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl bg-white/60 text-slate-700 border border-white/60 font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm shadow-sm"
          >
            <PlayCircle size={20} className="text-brand-secondary" />
            <span>ROI berechnen</span>
          </motion.button>
        </div>

        <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500">
           <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-md">
                   <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
           <p>Bereits von <span className="text-slate-900">50+ Mittelständlern</span> genutzt.</p>
        </div>
      </motion.div>

      {/* Hero Visual - "The System" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 40, delay: 0.3 }}
        className="relative perspective-1000"
      >
        {/* Main Glass Window */}
        <div className="relative z-10 rounded-[32px] overflow-hidden glass-panel shadow-2xl bg-white/40">
           {/* Window Header */}
           <div className="bg-white/50 backdrop-blur-xl p-4 border-b border-white/40 flex items-center justify-between">
              <div className="flex gap-2">
                 <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] shadow-inner" />
                 <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] shadow-inner" />
                 <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] shadow-inner" />
              </div>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 System Active
              </div>
           </div>
           
           <div className="p-8 grid gap-6">
              {/* Intent Widget */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/60 rounded-2xl p-4 shadow-sm border border-white/50 flex items-center gap-4"
              >
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Command size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-0.5">INTENT</div>
                    <div className="text-slate-800 font-medium">"Rechnungsfreigabe Prozess"</div>
                  </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                 {/* Widget 1 */}
                 <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-brand-primary to-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-500/20"
                 >
                    <div className="text-xs font-bold opacity-80 mb-2">ANTWORT</div>
                    <div className="text-lg font-bold mb-2">Genehmigung nötig</div>
                    <p className="text-xs opacity-90 leading-relaxed">
                       Ab 5.000€ muss der CFO genehmigen.
                    </p>
                 </motion.div>

                 {/* Widget 2 */}
                 <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/70 p-5 rounded-2xl shadow-sm border border-white/60 flex flex-col items-center justify-center gap-3 text-center cursor-pointer group"
                 >
                    <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
                       <Calendar size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Workflow starten</span>
                 </motion.div>
              </div>

              {/* Bottom Graph Area */}
              <div className="h-24 bg-white/30 rounded-2xl border border-white/40 flex items-end justify-between p-4 gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                      className="w-full bg-brand-accent/40 rounded-t-sm"
                    />
                  ))}
              </div>
           </div>
        </div>
        
        {/* Floating background decorations */}
        <motion.div 
           animate={{ y: [0, -20, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="absolute -top-12 -right-12 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0" 
        />
        <motion.div 
           animate={{ y: [0, 20, 0] }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
           className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0" 
        />
      </motion.div>
    </section>
  );
};