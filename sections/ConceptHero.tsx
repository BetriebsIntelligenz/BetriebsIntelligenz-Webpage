import React, { useRef } from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Brain, Filter, Settings, Cpu, UserCheck, ArrowRight, FileText, Network, CheckCircle, ChevronRight } from 'lucide-react';

export const ConceptHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll Physics for the Gears
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth spring physics for rotation to make it feel weighty/mechanical
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  
  // Gears rotate in opposite directions based on scroll
  const rotateClockwise = useTransform(smoothProgress, [0, 1], [0, 180]); 
  const rotateCounter = useTransform(smoothProgress, [0, 1], [0, -180]);
  
  // Parallax effects for floating elements
  const yFloating = useTransform(smoothProgress, [0, 1], [0, -50]);

  return (
    <div ref={containerRef} className="relative pt-32 pb-24 overflow-hidden perspective-1000">
      
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-brand-primary/5 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] bg-brand-secondary/5 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <SectionWrapper className="relative z-10">
        
        {/* Header Content */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Das Onboarding-Ecosystem
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight"
          >
            Vom Kopf in den <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_auto] animate-gradient">
              automatisierten Prozess.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Wir transformieren implizites Wissen (Service) in ausführbare Logik (Technologie). 
            Ein schlüsselfertiges System ab Tag 1.
          </motion.p>
        </div>

        {/* --- THE ENGINE VISUALIZATION --- */}
        <div className="relative py-12 xl:py-24">
            
            {/* The Connecting "Data Pipeline" - Animated Stream */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-1/2 z-0">
               {/* Base Line */}
               <div className="w-full h-full bg-slate-200/50 rounded-full" />
               
               {/* Animated Packets */}
               <motion.div 
                 animate={{ x: ["0%", "100%"], opacity: [0, 1, 0] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 left-0 w-[20%] h-full bg-gradient-to-r from-transparent via-brand-primary to-transparent blur-[1px]"
               />
               <motion.div 
                 animate={{ x: ["0%", "100%"], opacity: [0, 1, 0] }}
                 transition={{ duration: 4, delay: 1.5, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 left-0 w-[15%] h-full bg-gradient-to-r from-transparent via-brand-secondary to-transparent blur-[1px]"
               />
            </div>
            
            <div className="grid lg:grid-cols-4 gap-4 items-center relative z-10">
                
                {/* 1. INPUT: Wissen im Kopf */}
                <motion.div style={{ y: yFloating }} className="flex flex-col items-center text-center relative group">
                    <div className="relative mb-6">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full group-hover:bg-blue-400/30 transition-all duration-500" />
                        
                        <div className="w-28 h-28 rounded-full bg-white/80 backdrop-blur-xl shadow-glass border border-white flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300">
                            <Brain size={48} strokeWidth={1.5} className="text-slate-400 group-hover:text-brand-primary transition-colors duration-500" />
                        </div>
                        
                        {/* Orbiting Element */}
                        <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-[-10px] rounded-full border border-dashed border-slate-300 pointer-events-none"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-lg z-20">
                            <Filter size={16} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors">Wissen im Kopf</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Input</p>
                </motion.div>


                {/* 2. PHASE 1: SERVICE ENGINE (Gear Left) */}
                <div className="relative flex justify-center lg:col-span-1 h-[300px] items-center">
                    {/* Outer Gear Ring - Scroll Driven */}
                    <motion.div 
                        style={{ rotate: rotateClockwise }}
                        className="w-[280px] h-[280px] rounded-full border-[2px] border-dashed border-brand-primary/20 absolute"
                    >
                       {/* Gear Teeth Decoration */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-brand-primary/20 rounded-sm" />
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-4 h-4 bg-brand-primary/20 rounded-sm" />
                       <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-4 h-4 bg-brand-primary/20 rounded-sm" />
                       <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-4 h-4 bg-brand-primary/20 rounded-sm" />
                    </motion.div>
                    
                    {/* Inner Rotating Ring */}
                    <motion.div 
                         animate={{ rotate: -360 }}
                         transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                         className="w-64 h-64 rounded-full border border-brand-primary/10 absolute bg-gradient-to-br from-blue-50/10 to-transparent backdrop-blur-[2px]"
                    />
                    
                    {/* Core Card */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative z-10 glass-card w-48 h-48 rounded-full flex flex-col items-center justify-center text-center p-4 border-2 border-white/80 shadow-[0_20px_50px_-12px_rgba(0,122,255,0.2)] bg-white/60"
                    >
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3">
                           <Settings size={24} className="animate-spin-slow" style={{ animationDuration: '10s' }} />
                        </div>
                        <div className="text-[10px] font-bold text-brand-primary tracking-widest uppercase mb-0.5">Phase 1</div>
                        <div className="font-bold text-slate-900 text-lg">Service</div>
                        <div className="text-[10px] text-slate-500 mt-2 font-medium">
                            Extraktion<br/>Modellierung
                        </div>
                    </motion.div>
                </div>


                {/* 3. PHASE 2: TECH ENGINE (Gear Right) */}
                <div className="relative flex justify-center lg:col-span-1 h-[300px] items-center -ml-16 lg:-ml-20">
                     {/* Outer Gear Ring - Scroll Driven (Counter Rotation) */}
                     <motion.div 
                        style={{ rotate: rotateCounter }}
                        className="w-[280px] h-[280px] rounded-full border-[2px] border-dashed border-brand-secondary/20 absolute"
                    >
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-brand-secondary/20 rounded-full" />
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-4 h-4 bg-brand-secondary/20 rounded-full" />
                    </motion.div>
                    
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                        className="w-64 h-64 rounded-full border border-brand-secondary/10 absolute bg-gradient-to-br from-purple-50/10 to-transparent backdrop-blur-[2px]"
                    />

                    {/* Core Card */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative z-10 glass-card w-48 h-48 rounded-full flex flex-col items-center justify-center text-center p-4 border-2 border-white/80 shadow-[0_20px_50px_-12px_rgba(88,86,214,0.2)] bg-white/60"
                    >
                         <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-3">
                           <Cpu size={24} />
                        </div>
                        <div className="text-[10px] font-bold text-brand-secondary tracking-widest uppercase mb-0.5">Phase 2</div>
                        <div className="font-bold text-slate-900 text-lg">Technologie</div>
                        <div className="text-[10px] text-slate-500 mt-2 font-medium">
                            Org-Graph<br/>Logic Engine
                        </div>
                    </motion.div>
                </div>


                {/* 4. OUTPUT: User */}
                <motion.div style={{ y: yFloating }} className="flex flex-col items-center text-center relative group">
                     <div className="relative mb-6">
                        {/* Pulse Ring */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-brand-accent blur-xl" 
                        />
                        
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#34C759] to-[#30B350] shadow-lg shadow-green-500/30 flex items-center justify-center relative z-10 border-4 border-white/20 group-hover:scale-105 transition-transform">
                            <UserCheck size={48} className="text-white drop-shadow-md" />
                        </div>
                        
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                           <CheckCircle size={16} className="text-brand-accent" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Output</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Productivity</p>
                </motion.div>

            </div>
        </div>

        {/* Feature Grid - Staggered Reveal */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { 
                phase: "Phase 1: Dienstleistung", 
                icon: FileText, 
                color: "text-brand-primary", 
                items: ["Experten-Interviews", "Redaktionelle SOPs", "BPMN Modellierung"] 
              },
              { 
                phase: "Phase 2: Technologie", 
                icon: Network, 
                color: "text-brand-secondary", 
                items: ["Interaktiver Org-Graph", "Logic Engine (DMN)", "Semantic Search"] 
              },
              { 
                phase: "Phase 3: Mehrwert", 
                icon: CheckCircle, 
                color: "text-brand-accent", 
                items: ["30-50% schnellere Produktivität", "70% Entlastung der Experten", "Volle Datensouveränität"] 
              }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm group transition-all"
              >
                  <div className={`flex items-center gap-3 mb-6 ${card.color}`}>
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                        <card.icon size={22} />
                      </div>
                      <h4 className="font-bold text-slate-900">{card.phase}</h4>
                  </div>
                  <ul className="space-y-3.5">
                      {card.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                            <ChevronRight size={14} className={`mt-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ${card.color}`} /> 
                            {item}
                        </li>
                      ))}
                  </ul>
              </motion.div>
            ))}
        </div>

      </SectionWrapper>
    </div>
  );
};