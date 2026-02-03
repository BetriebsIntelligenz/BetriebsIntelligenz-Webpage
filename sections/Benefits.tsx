import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { TrendingUp, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
   { icon: TrendingUp, val: "30-50%", label: "Schnellere Produktivität", sub: "Neue Mitarbeiter sind Wochen früher voll einsatzfähig.", color: "text-blue-500 bg-blue-50" },
   { icon: Clock, val: "70%", label: "Entlastung der Experten", sub: "Automatisieren Sie die Basics. Fokus auf Wertschöpfung.", color: "text-purple-500 bg-purple-50" },
   { icon: Shield, val: "100%", label: "Datensouveränität", sub: "Dedizierte Server-Instanz. Kein Public Cloud Risiko.", color: "text-green-500 bg-green-50" }
];

export const Benefits: React.FC = () => {
  return (
    <SectionWrapper id="benefits">
      <div className="grid md:grid-cols-3 gap-6">
         {benefits.map((b, i) => (
            <motion.div 
               key={i}
               whileHover={{ y: -8 }}
               className="glass-card p-8 rounded-3xl text-center border-t-4 border-t-white"
            >
               <div className={`mx-auto w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center mb-6 shadow-sm`}>
                  <b.icon size={26} />
               </div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2">{b.val}</div>
               <div className="text-sm font-bold text-slate-700 mb-3">{b.label}</div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">{b.sub}</p>
            </motion.div>
         ))}
      </div>
      
      <div className="mt-12 text-center">
         <button className="text-slate-500 hover:text-brand-primary font-semibold text-sm transition-colors border-b border-transparent hover:border-brand-primary pb-0.5">
            Detaillierten Business Case ansehen (PDF)
         </button>
      </div>
    </SectionWrapper>
  );
};