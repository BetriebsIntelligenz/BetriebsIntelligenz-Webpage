import React, { useState } from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const faqs = [
  { q: "Wie viel Zeit müssen unsere Experten investieren?", a: "Wir minimieren den Aufwand durch Interviews und Shadowing. Den Rest (Dokumentation, Modellierung) übernehmen unsere Process Architects." },
  { q: "Was passiert mit unseren bestehenden Dokumenten?", a: "Wir sichten und importieren relevante PDF/Word-Dokumente als Teil des Setups." },
  { q: "Wo liegen unsere Daten?", a: "Sie erhalten eine dedizierte Server-Instanz (z. B. Hetzner Cloud / AWS), keine geteilte Datenbank." },
  { q: "Können wir das System später selbst pflegen?", a: "Ja, Ihre Key-User werden geschult ('Enablement Phase'), um Inhalte via PageBuilder selbst zu aktualisieren." },
  { q: "Ist das System DSGVO-konform?", a: "Ja, durch lokales Hosting, verschlüsselte Backups und granulare Berechtigungen." },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
         <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Häufige Fragen</h2>
         <div className="space-y-4">
            {faqs.map((faq, idx) => (
               <motion.div 
                 key={idx} 
                 className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow-sm"
                 initial={false}
               >
                  <button 
                     onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                     className="w-full p-5 flex items-center justify-between text-left font-semibold text-slate-800 hover:bg-white/40 transition-colors"
                  >
                     {faq.q}
                     <div className={`p-1 rounded-full bg-slate-100 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                       <ChevronDown size={18} className="text-slate-500" />
                     </div>
                  </button>
                  <AnimatePresence>
                     {openIndex === idx && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                           <div className="p-5 pt-0 text-sm text-slate-500 leading-relaxed font-medium">
                              {faq.a}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </motion.div>
            ))}
         </div>
      </div>
    </SectionWrapper>
  );
};