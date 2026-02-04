import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { Layers, MousePointer2, Sparkles, Code2, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemArchitecture: React.FC = () => {
  return (
    <SectionWrapper id="architecture" className="py-24">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Under the Hood
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Das <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Anti-Gravity</span> Prinzip.
        </h2>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          Wie wir ein Geschäftsmodell skalieren, das auf den ersten Blick unmöglich scheint. 
          Die Fusion aus Architektur und KI-gestützter Extraktion.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Card 1: Anti-Gravity Architecture */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[40px] border border-white/60 bg-gradient-to-br from-white/80 to-blue-50/30 relative overflow-hidden group"
        >
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Layers size={200} />
           </div>

           <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-brand-primary mb-6">
                 <Code2 size={28} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Die "Anti-Gravity" Architektur</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-lg">
                 Wir lösen das Henne-Ei-Problem der Softwareentwicklung. Durch radikale Clean Architecture und 
                 Memory-Adapter läuft unser Frontend autark – ganz ohne Backend.
              </p>

              {/* Visualization of Layers */}
              <div className="space-y-3 relative">
                 {/* Connection Line */}
                 <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 to-transparent" />

                 <div className="relative flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-lg shadow-blue-500/20">UI</div>
                    <div>
                       <div className="font-bold text-slate-800 text-sm">React / Presentation Layer</div>
                       <div className="text-xs text-slate-400">Keine Business Logic. Nur Darstellung.</div>
                    </div>
                 </div>

                 <div className="relative flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 z-10 translate-x-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-lg shadow-purple-500/20">CORE</div>
                    <div>
                       <div className="font-bold text-slate-800 text-sm">Use Case Layer</div>
                       <div className="text-xs text-slate-400">Reine Logik ("Erstelle Seite"). Unabhängig.</div>
                    </div>
                 </div>

                 <div className="relative flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 z-10 translate-x-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-lg">DATA</div>
                    <div>
                       <div className="font-bold text-slate-800 text-sm">Adapter Layer</div>
                       <div className="text-xs text-slate-400 flex gap-2 items-center mt-1">
                          <span className="bg-green-100 text-green-700 px-1.5 rounded text-[10px] font-bold">MOCK</span>
                          <span className="text-slate-300">↔</span>
                          <span className="bg-slate-100 text-slate-500 px-1.5 rounded text-[10px] font-bold">POSTGRES</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Card 2: Interview Agent */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-[40px] border border-white/60 bg-white/60 relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-50/50" />
           
           <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6">
                 <MousePointer2 size={28} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">Der Interview Agent</h3>
              <p className="text-slate-500 font-medium mb-6 text-sm">
                 Reduziert manuellen Aufwand um 80%. Die KI korreliert das gesprochene Wort mit der Bildschirmaktion.
              </p>

              <div className="flex-1 bg-slate-900 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-center gap-4 shadow-2xl">
                  {/* Simulation Code Transcript */}
                  <div className="flex gap-3 items-center opacity-50">
                     <div className="w-1 h-8 bg-green-500 rounded-full" />
                     <div className="space-y-1">
                        <div className="h-1.5 w-24 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-32 bg-white/20 rounded-full" />
                     </div>
                  </div>
                  
                  {/* The Highlight */}
                  <motion.div 
                     initial={{ scale: 0.95, opacity: 0.8 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                     className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center gap-3"
                  >
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                     <div className="text-xs text-white font-mono">
                        <span className="text-purple-300">Voice:</span> "Klick auf Buchen"<br/>
                        <span className="text-blue-300">Event:</span> MouseUp @ Btn#Confirm
                     </div>
                  </motion.div>

                  <div className="flex gap-3 items-center opacity-50">
                     <div className="w-1 h-6 bg-slate-600 rounded-full" />
                     <div className="space-y-1">
                        <div className="h-1.5 w-20 bg-white/20 rounded-full" />
                     </div>
                  </div>
              </div>
           </div>
        </motion.div>
      </div>

      {/* Vision Section */}
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
         {/* RAG / Truth */}
         <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-[40px] border border-white/60 bg-white/40 flex flex-col justify-between"
         >
            <div>
               <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-6">
                  <Database size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">RAG statt Halluzination</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Die KI darf nicht raten. Sie erhält "Spickzettel" aus Ihren internen Dokumenten (Retrieval Augmented Generation).
               </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
               <span className="text-green-600 font-bold">✓</span> Fact-Check passed
            </div>
         </motion.div>

         {/* The Future Vision (Wide) */}
         <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[40px] border border-brand-accent/30 bg-gradient-to-br from-green-50/50 to-white relative overflow-hidden"
         >
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide mb-4">
                      Vision
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-3">Der proaktive Berater</h3>
                   <p className="text-slate-600 font-medium leading-relaxed">
                      Was passiert, wenn die KI Prozesse nicht nur versteht, sondern optimiert? 
                      Das System wandelt sich vom Dokumentar zum Unternehmensberater, der Schwachstellen aufdeckt.
                   </p>
                </div>

                <div className="w-full md:w-auto shrink-0">
                   <div className="bg-white p-5 rounded-2xl shadow-xl shadow-green-900/5 border border-green-100/50 max-w-xs relative">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-accent/30">
                         <Sparkles size={16} />
                      </div>
                      <div className="flex items-center gap-3 mb-3 border-b border-slate-100 pb-3">
                         <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                            <Zap size={16} />
                         </div>
                         <div className="text-xs font-bold text-slate-800">Insight gefunden</div>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-2">
                         "Prozess 'Urlaubsantrag' hat 3 manuelle Schleifen."
                      </p>
                      <div className="text-xs font-bold text-brand-accent">
                         → Potentielle Einsparung: 40%
                      </div>
                   </div>
                </div>
             </div>
         </motion.div>
      </div>
    </SectionWrapper>
  );
};
