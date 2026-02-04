import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { Mic, Workflow, Rocket } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const steps = [
  {
    icon: Mic,
    title: "Extraction",
    subtitle: "Audit & Shadowing",
    desc: "Wir führen Interviews und brechen Kopfmonopole auf. Kein Tippen für Sie.",
    color: "bg-blue-500",
    shadow: "shadow-blue-500/30"
  },
  {
    icon: Workflow,
    title: "Construction",
    subtitle: "Modelling & Logic",
    desc: "Wir überführen Arbeitsweisen in Prozesse und Entscheidungslogiken.",
    color: "bg-purple-500",
    shadow: "shadow-purple-500/30"
  },
  {
    icon: Rocket,
    title: "Enablement",
    subtitle: "Launch & Training",
    desc: "Übergabe einer befüllten Instanz. Ihr System ist ab Tag 1 produktiv.",
    color: "bg-green-500",
    shadow: "shadow-green-500/30"
  }
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export const Process: React.FC = () => {
  return (
    <SectionWrapper id="process" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Ihr Weg zum Betriebssystem</h2>
        <p className="text-slate-500 font-medium">Von Chaos zu Struktur in wenigen Wochen.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-8"
      >
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            whileHover={{ y: -10 }}
            className="glass-card p-8 flex flex-col items-center text-center relative group"
          >
            <div className={`w-20 h-20 rounded-2xl ${step.color} ${step.shadow} flex items-center justify-center text-white mb-6 shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
              <step.icon size={32} />
            </div>
            
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phase 0{idx + 1}</span>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h3>
            <span className="text-sm font-semibold text-brand-primary mb-4">{step.subtitle}</span>
            <p className="text-slate-600 text-sm leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};