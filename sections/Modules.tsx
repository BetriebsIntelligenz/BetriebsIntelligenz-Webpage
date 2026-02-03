import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { BrainCircuit, GitGraph, Calculator, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  {
    icon: BrainCircuit,
    title: "Living Knowledge",
    desc: "Semantische Suche ('The Brain').",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: GitGraph,
    title: "Org Clarity Hub",
    desc: "Interaktiver Org-Graph & RACI.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Calculator,
    title: "Active Guidance",
    desc: "Ausführbare DMN-Tabellen.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: LayoutDashboard,
    title: "Visual Intelligence",
    desc: "Concept Boards.",
    color: "bg-amber-100 text-amber-600",
  }
];

export const Modules: React.FC = () => {
  return (
    <SectionWrapper>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
            Mehr als ein Wiki. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Ein aktives Nervensystem.</span>
          </h2>
          <p className="text-lg text-slate-600 mb-10 font-medium">
            Unsere Plattform verbindet statisches Wissen mit dynamischer Ausführung und organisatorischer Klarheit.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.02 }}
                className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm flex flex-col gap-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color}`}>
                  <mod.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{mod.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{mod.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Abstract Visualization - Bento Grid Style */}
        <div className="relative h-[500px] w-full rounded-[40px] bg-slate-100 border border-white/50 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Mock Dashboard UI */}
          <div className="absolute top-8 left-8 right-8 bottom-8 glass-panel rounded-3xl flex flex-col overflow-hidden shadow-2xl">
             {/* Header */}
             <div className="h-14 border-b border-gray-100 bg-white/50 flex items-center px-6 gap-3">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-400/80" />
                   <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                   <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 ml-4 h-8 bg-gray-100/50 rounded-lg max-w-xs" />
             </div>
             {/* Content */}
             <div className="flex-1 p-6 flex gap-6 bg-white/40">
                <div className="w-1/3 space-y-4">
                   <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="h-24 bg-gradient-to-br from-brand-primary to-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 p-4"
                   >
                      <div className="h-2 w-12 bg-white/40 rounded mb-2" />
                      <div className="h-2 w-20 bg-white/20 rounded" />
                   </motion.div>
                   <div className="h-32 bg-white/60 rounded-2xl shadow-sm border border-white/50" />
                </div>
                <div className="flex-1 bg-white/60 rounded-2xl border border-white/50 p-6 relative shadow-sm">
                   {/* Connection lines mock */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-dashed border-brand-secondary/30 rounded-full animate-spin-slow" />
                   <div className="flex items-center justify-center h-full text-brand-secondary font-bold text-sm bg-purple-50 rounded-xl">
                      Live Graph View
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};