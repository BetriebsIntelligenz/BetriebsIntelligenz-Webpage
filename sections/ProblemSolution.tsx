import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { Archive, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemSolution: React.FC = () => {
  return (
    <SectionWrapper id="solutions">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold mb-4 text-slate-900">Warum Wikis scheitern</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Der Kauf einer Software löst kein Problem. Meistens kauft man einen leeren Container.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
        {/* The Problem Side */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 md:p-10 rounded-[32px] relative overflow-hidden group border-red-100 bg-white/60"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <Archive size={120} className="text-red-500 transform rotate-12" />
          </div>
          
          <div className="relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-red-50 shadow-sm border border-red-100 flex items-center justify-center text-red-500 mb-8">
                <AlertTriangle size={28} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-4">Das "Empty State" Problem</h3>
             <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4 text-slate-600">
                   <div className="mt-1 p-1 bg-red-100 rounded-full text-red-500 shrink-0">
                      <XCircle size={14} />
                   </div>
                   <span className="leading-relaxed">"Datenfriedhöfe": Informationen veralten schneller als sie gelesen werden.</span>
                </li>
                <li className="flex items-start gap-4 text-slate-600">
                   <div className="mt-1 p-1 bg-red-100 rounded-full text-red-500 shrink-0">
                      <XCircle size={14} />
                   </div>
                   <span className="leading-relaxed">Top-Performer verlieren 70% Zeit mit Erklären von Basics.</span>
                </li>
             </ul>
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-xs font-bold text-red-600 uppercase tracking-wide">
                Status: Critical
             </div>
          </div>
        </motion.div>

        {/* The Solution Side */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 md:p-10 rounded-[32px] relative overflow-hidden group border-brand-primary/20 bg-white/80 shadow-xl shadow-brand-primary/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5" />
          
          <div className="relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/30 flex items-center justify-center text-white mb-8">
                <CheckCircle2 size={28} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-4">Productized Service</h3>
             <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                Wir liefern nicht das Werkzeug. Wir liefern das Ergebnis. Unser Team übernimmt den Aufbau – von der Analyse bis zum Go-Live.
             </p>
             <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4 text-slate-800 font-medium">
                   <div className="mt-1 p-1 bg-brand-primary rounded-full text-white shrink-0 shadow-sm">
                      <CheckCircle2 size={14} />
                   </div>
                   <span>Schlüsselfertiges System statt leerer Hülle.</span>
                </li>
                <li className="flex items-start gap-4 text-slate-800 font-medium">
                    <div className="mt-1 p-1 bg-brand-primary rounded-full text-white shrink-0 shadow-sm">
                      <CheckCircle2 size={14} />
                   </div>
                   <span>Garantierte Operationalisierung vor dem ersten Login.</span>
                </li>
             </ul>
             <button className="text-brand-primary font-bold hover:text-brand-secondary flex items-center gap-2 transition-colors group/btn">
                Unser Service-Modell <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};