import React, { useState } from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileWarning, Package, Database, Users, GitCommit, Calculator, Mic, Monitor, ArrowRight, CheckCircle2, XCircle, ChevronRight, User } from 'lucide-react';

// --- BLOCK 1: HERO "Wissen, das arbeitet" ---
const StoryHero = () => {
  return (
    <SectionWrapper id="story-start" className="py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
            Kapitel 2: Die Anwendung
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Aus Firmenwissen wird ein <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">verlässlicher Arbeitsmodus.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium mb-8">
            Antworten finden. Rollen verstehen. Entscheidungen sicher treffen.
            Kein weiteres Wiki, sondern ein System für den Alltag.
          </p>
          <ul className="space-y-3 mb-8">
             {['Weniger Rückfragen an Experten', 'Schneller produktiv im Onboarding', 'Konsistente Entscheidungen'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={14} /></div>
                   {item}
                </li>
             ))}
          </ul>
        </div>
        
        {/* Micro-Demo Visual */}
        <div className="glass-card p-6 rounded-3xl bg-white/60 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />
           <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><User size={16} /></div>
                 <div className="text-sm text-slate-600 font-medium">"Wie buche ich Reisekosten?"</div>
              </div>
              
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10"
              >
                 <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white"><Database size={16} /></div>
                    <div>
                       <div className="text-sm text-slate-800 font-semibold mb-1">Prozess: Reisekosten v2.4</div>
                       <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          Reisen unter 500€ benötigen keine Vorab-Genehmigung. Buche direkt über das Portal 'Concur'.
                       </p>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-400">Quelle: HR Policy S.12</span>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

// --- BLOCK 2: PAIN "Information Graveyard" ---
const StoryPain = () => {
  return (
    <SectionWrapper className="py-24">
      <div className="text-center mb-12">
         <h2 className="text-3xl font-bold text-slate-900 mb-4">Das Problem: Information Graveyard</h2>
         <p className="text-slate-500 max-w-2xl mx-auto">Warum Wikis zu Datenfriedhöfen werden.</p>
      </div>
      
      <div className="glass-card p-1 rounded-[40px] max-w-4xl mx-auto bg-red-50/50 border border-red-100 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-50/80 z-20 pointer-events-none" />
         
         <div className="p-12 text-center relative z-30">
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="inline-block mb-6 p-4 bg-white rounded-full shadow-xl shadow-red-200"
            >
               <FileWarning size={48} className="text-red-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Suche im Chaos</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
               "Neue Leute fragen ständig das Gleiche. Experten werden geblockt. 
               Das Wiki ist voll von veralteten Dokumenten von 2019."
            </p>
            
            {/* Simulated Chaos List */}
            <div className="max-w-md mx-auto space-y-3 opacity-60 blur-[1px] select-none">
               {[2018, 2019, 2020].map((year, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-red-100">
                     <span className="text-xs text-slate-400 font-mono">Reisekosten_FINAL_v{i}.pdf</span>
                     <span className="text-xs text-red-300">Last edit: {year}</span>
                  </div>
               ))}
               <div className="flex items-center justify-center p-2 text-red-500 font-bold text-sm bg-red-100 rounded-lg mt-4">
                  <XCircle size={16} className="mr-2" /> Keine eindeutige Antwort gefunden
               </div>
            </div>
         </div>
      </div>
    </SectionWrapper>
  );
};

// --- BLOCK 3: SOLUTION "Schlüsselfertig" ---
const StorySolution = () => {
  const [activeTab, setActiveTab] = useState<'empty' | 'full'>('empty');

  return (
    <SectionWrapper className="py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
         <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Schlüsselfertig statt leer.</h2>
            <p className="text-lg text-slate-500 mb-8 font-medium">
               Sie kaufen nicht das leere Bücherregal, sondern das fertig sortierte Wissen Ihres Unternehmens.
            </p>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="w-1 h-full bg-brand-primary rounded-full min-h-[50px]" />
                  <div>
                     <h4 className="font-bold text-slate-900">Productized Service</h4>
                     <p className="text-sm text-slate-600">Unsere Process Architects erfassen und strukturieren Ihr Wissen.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-1 h-full bg-brand-secondary rounded-full min-h-[50px]" />
                  <div>
                     <h4 className="font-bold text-slate-900">Einmaliges Setup</h4>
                     <p className="text-sm text-slate-600">Startklarer Launch. (Invest: 15k–50k je nach Größe).</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="relative">
            {/* Toggle Switch */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-md p-1 rounded-full border border-slate-200 flex gap-1 shadow-sm z-20">
               <button 
                  onClick={() => setActiveTab('empty')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'empty' ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  Standard Software
               </button>
               <button 
                   onClick={() => setActiveTab('full')}
                   className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'full' ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  Unser Ansatz
               </button>
            </div>

            {/* Visual */}
            <div className="glass-card h-[400px] rounded-[32px] bg-white relative overflow-hidden flex items-center justify-center border-2 border-slate-100 transition-colors duration-500">
               <AnimatePresence mode="wait">
                  {activeTab === 'empty' ? (
                     <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center"
                     >
                        <Package size={80} className="text-slate-200 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="text-xl font-bold text-slate-300">Empty State</h3>
                        <p className="text-slate-300 text-sm">Bitte legen Sie die erste Seite an...</p>
                     </motion.div>
                  ) : (
                     <motion.div 
                        key="full"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="w-full h-full p-6 flex flex-col"
                     >
                        <div className="h-4 w-32 bg-slate-100 rounded mb-6" />
                        <div className="grid grid-cols-2 gap-4">
                           {[1,2,3,4].map(i => (
                              <div key={i} className="bg-brand-primary/5 border border-brand-primary/10 p-4 rounded-xl flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary shadow-sm">
                                    <CheckCircle2 size={16} />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="h-2 w-16 bg-slate-200 rounded" />
                                    <div className="h-2 w-10 bg-slate-100 rounded" />
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="mt-auto bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-bold border border-green-100">
                           System Ready for Launch
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </SectionWrapper>
  );
};

// --- BLOCK 4: THE BRAIN ---
const StoryBrain = () => {
  return (
    <SectionWrapper className="py-24 bg-slate-50/50 rounded-[40px] my-12">
       <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-2xl text-brand-primary mb-4 shadow-sm">
             <Database size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Säule 1: The Brain</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
             Verlässliche Antworten statt Suchen. RAG-Technologie garantiert Antworten nur auf Basis Ihrer internen Daten.
          </p>
       </div>

       <div className="max-w-4xl mx-auto glass-card p-6 rounded-[32px] shadow-2xl shadow-blue-900/5 flex flex-col md:flex-row gap-6 bg-white">
          {/* Chat Area */}
          <div className="flex-1 space-y-4">
             <div className="flex justify-end">
                <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium">
                   Wie ist die Home-Office Regelung für Freitags?
                </div>
             </div>
             <div className="flex justify-start">
                 <div className="bg-blue-600 text-white px-5 py-4 rounded-2xl rounded-tl-sm text-sm shadow-lg shadow-blue-500/20 leading-relaxed">
                    Es gibt keine Kernpräsenzpflicht am Freitag. Mitarbeiter können flexibel mobil arbeiten, sofern keine Kundentermine anstehen.
                 </div>
             </div>
          </div>

          {/* Source Area */}
          <div className="w-full md:w-64 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Geprüfte Quellen</span>
             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm cursor-pointer"
            >
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   <span className="text-xs font-bold text-slate-800">HR Handbuch 2024</span>
                </div>
                <div className="text-[10px] text-slate-500 bg-yellow-100/50 px-1 rounded">
                   "...Freitags entfällt die Präsenzpflicht..."
                </div>
             </motion.div>
          </div>
       </div>
    </SectionWrapper>
  );
};

// --- BLOCK 5: ROLE HUB ---
const StoryRoleHub = () => {
  const [role, setRole] = useState('Sales');
  
  return (
    <SectionWrapper className="py-24">
       <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="glass-card p-8 rounded-[32px] border border-slate-200 bg-white shadow-xl">
                {/* Role Selector */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                   {['Sales Manager', 'HR Specialist', 'DevOps'].map(r => (
                      <button 
                        key={r}
                        onClick={() => setRole(r)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${role === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                         {r}
                      </button>
                   ))}
                </div>

                <AnimatePresence mode="wait">
                   <motion.div
                      key={role}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                   >
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-slate-800">Mein Dashboard</h3>
                         <span className="text-xs font-mono text-slate-400">RACI: Accountable</span>
                      </div>
                      
                      {/* Dynamic Content Cards */}
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-brand-primary/30 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2">
                               {role === 'Sales Manager' ? <Calculator size={16} className="text-blue-500"/> : <Users size={16} className="text-purple-500"/>}
                            </div>
                            <div className="text-sm font-bold text-slate-700">{role === 'Sales Manager' ? 'Q3 Targets' : 'Onboarding'}</div>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-brand-primary/30 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2">
                               <GitCommit size={16} className="text-green-500"/>
                            </div>
                            <div className="text-sm font-bold text-slate-700">Prozesse</div>
                         </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
                         <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Active Task</div>
                         <div className="font-bold">
                            {role === 'Sales Manager' ? 'Opportunity Review' : 'Vertragserstellung'}
                         </div>
                      </div>
                   </motion.div>
                </AnimatePresence>
             </div>
          </div>
          
          <div className="order-1 lg:order-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wider mb-6">
                Säule 2: Role Hub
             </div>
             <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Wissen, das dich kennt.</h2>
             <p className="text-lg text-slate-500 mb-6">
                Keine Informationsflut. Das System filtert Inhalte basierend auf deiner Rolle.
             </p>
             <ul className="space-y-4">
                <li className="flex items-start gap-4">
                   <div className="mt-1 p-1 bg-purple-100 rounded text-purple-600"><CheckCircle2 size={16} /></div>
                   <div>
                      <strong className="block text-slate-900">RACI Integration</strong>
                      <span className="text-sm text-slate-500">Klarheit: Wer ist zuständig, wer muss informiert werden?</span>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="mt-1 p-1 bg-purple-100 rounded text-purple-600"><CheckCircle2 size={16} /></div>
                   <div>
                      <strong className="block text-slate-900">Schnelleres Onboarding</strong>
                      <span className="text-sm text-slate-500">Neue Mitarbeiter sehen am Tag 1 nur das, was für sie zählt.</span>
                   </div>
                </li>
             </ul>
          </div>
       </div>
    </SectionWrapper>
  );
};

// --- BLOCK 6: DECISION ENGINE ---
const StoryDecisionEngine = () => {
  const [inputVal, setInputVal] = useState(12);
  
  return (
    <SectionWrapper className="py-24 bg-slate-900 rounded-[40px] text-white my-12 relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
       
       <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center p-4">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
                Säule 3: Decision Engine
             </div>
             <h2 className="text-4xl font-extrabold mb-6">Entscheidungen auf Knopfdruck.</h2>
             <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Mitarbeitende müssen Regeln nicht auswendig lernen. Der "Flight Simulator" für Businessregeln führt sicher zur korrekten Entscheidung.
             </p>
             <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-mono border border-white/10">Input: Daten</div>
                <ArrowRight className="text-slate-500" />
                <div className="px-4 py-2 bg-brand-primary rounded-lg text-sm font-mono font-bold shadow-lg shadow-brand-primary/50">Output: Ergebnis</div>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-slate-900 shadow-2xl">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-brand-primary" />
                Rabatt-Rechner
             </h3>
             
             <div className="space-y-6">
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Kundenrabatt in %</label>
                   <div className="flex items-center gap-4">
                      <input 
                         type="range" 
                         min="0" max="25" 
                         value={inputVal} 
                         onChange={(e) => setInputVal(Number(e.target.value))}
                         className="w-full accent-brand-primary"
                      />
                      <span className="font-mono font-bold text-xl w-12">{inputVal}%</span>
                   </div>
                </div>

                <div className="p-4 rounded-xl transition-colors duration-300 bg-slate-50 border border-slate-100">
                   <AnimatePresence mode="wait">
                      {inputVal <= 15 ? (
                         <motion.div 
                            key="ok"
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 text-green-600"
                         >
                            <CheckCircle2 size={24} />
                            <div>
                               <div className="font-bold">Sofort Genehmigt</div>
                               <div className="text-xs text-slate-500">Standard Sales Prozess.</div>
                            </div>
                         </motion.div>
                      ) : (
                         <motion.div 
                             key="nok"
                             initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                             className="flex items-center gap-3 text-amber-600"
                         >
                            <User size={24} />
                            <div>
                               <div className="font-bold">Manager Approval nötig</div>
                               <div className="text-xs text-slate-500">Rabatt > 15% erfordert Freigabe.</div>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </div>
       </div>
    </SectionWrapper>
  );
};

// --- BLOCK 7: INTERVIEW AGENT ---
const StoryInterviewAgent = () => {
  return (
    <SectionWrapper className="py-24">
       <div className="text-center mb-16">
          <div className="inline-block p-3 bg-amber-100 rounded-2xl text-amber-600 mb-4 shadow-sm">
             <Mic size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Säule 4: Interview Agent</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
             Der Engpass beim Dokumentieren? Zeit. <br/>
             Unsere KI hört zu, schaut zu und erstellt die Anleitung für Sie.
          </p>
       </div>

       <div className="relative max-w-4xl mx-auto">
          {/* Timeline Visual */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
          
          <div className="space-y-8 pl-16 md:pl-24 relative">
             {/* Event 1 */}
             <motion.div 
                whileHover={{ x: 5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group"
             >
                <div className="absolute -left-[4.5rem] md:-left-[6.5rem] top-6 flex items-center justify-end w-12 md:w-20">
                   <span className="text-xs font-mono text-slate-400 mr-4">00:15</span>
                   <div className="w-4 h-4 rounded-full bg-slate-300 group-hover:bg-brand-primary transition-colors border-4 border-white shadow-sm" />
                </div>
                <div className="flex items-center gap-4 mb-2">
                   <div className="bg-amber-100 text-amber-600 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                      <Mic size={10} /> Voice
                   </div>
                   <span className="text-slate-800 italic font-medium">"Ich klicke jetzt hier oben auf 'Neue Rechnung'..."</span>
                </div>
             </motion.div>

             {/* Event 2 - Connection */}
             <motion.div 
                whileHover={{ x: 5 }}
                className="bg-brand-primary/5 p-6 rounded-2xl shadow-md border border-brand-primary/20 relative group"
             >
                <div className="absolute -left-[4.5rem] md:-left-[6.5rem] top-6 flex items-center justify-end w-12 md:w-20">
                   <span className="text-xs font-mono text-brand-primary font-bold mr-4">00:18</span>
                   <div className="w-4 h-4 rounded-full bg-brand-primary border-4 border-white shadow-sm animate-pulse" />
                </div>
                <div className="flex items-start gap-4">
                   <div className="mt-1 bg-blue-100 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
                      <Monitor size={10} /> Screen
                   </div>
                   <div>
                      <div className="font-bold text-slate-900 mb-1">Step 1: Button "Create Invoice"</div>
                      <div className="w-full h-24 bg-slate-200 rounded-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                         {/* Fake UI Screen */}
                         <div className="absolute top-4 right-4 w-24 h-8 bg-blue-500 rounded shadow-sm" />
                         <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-red-500 opacity-50" />
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
          
          <div className="mt-12 text-center">
             <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold shadow-sm">
                Ergebnis: 80% weniger manueller Aufwand
             </span>
          </div>
       </div>
    </SectionWrapper>
  );
};

// --- BLOCK 8: ROI & RESULT ---
const StoryROI = () => {
  const [hires, setHires] = useState(15);
  // Simple Mock Calc
  const savings = hires * 6800; // Mock factor

  return (
    <SectionWrapper className="py-24 mb-24">
       <div className="glass-card p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-white to-blue-50 border border-brand-primary/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Rechnet sich das?</h2>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
             Ja. Und zwar im ersten Jahr. <br/>
             Vom Dokumentar zum proaktiven Verbesserer Ihres Betriebsergebnisses.
          </p>

          <div className="grid md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
             <div className="space-y-8">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Neueinstellungen / Jahr</label>
                   <div className="flex items-center gap-4">
                      <input 
                         type="range" min="1" max="50" 
                         value={hires} onChange={(e) => setHires(Number(e.target.value))}
                         className="w-full accent-brand-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-mono font-bold text-xl w-12 text-right">{hires}</span>
                   </div>
                </div>
                
                <div className="flex gap-4">
                   <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-3xl font-extrabold text-brand-primary mb-1">30-50%</div>
                      <div className="text-xs text-slate-500 font-bold uppercase">Schnellere Produktivität</div>
                   </div>
                   <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <div className="text-3xl font-extrabold text-brand-secondary mb-1">70%</div>
                      <div className="text-xs text-slate-500 font-bold uppercase">Experten Entlastung</div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/20 blur-3xl opacity-50" />
                <div className="relative z-10 text-center">
                   <div className="text-sm font-medium text-slate-400 mb-2">Geschätzte Netto-Ersparnis (Jahr 1)</div>
                   <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-4">
                      {savings.toLocaleString('de-DE')} €
                   </div>
                   <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-green-300 border border-green-500/30">
                      ROI > 200%
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-12 flex justify-center gap-4">
             <button className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                Beispiel-Kalkulation ansehen <ChevronRight size={20} />
             </button>
          </div>
       </div>
    </SectionWrapper>
  );
};

// --- MAIN EXPORT ---
export const StoryFlow = () => {
  return (
    <div className="relative bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">
       <StoryHero />
       <StoryPain />
       <StorySolution />
       <StoryBrain />
       <StoryRoleHub />
       <StoryDecisionEngine />
       <StoryInterviewAgent />
       <StoryROI />
    </div>
  );
};
