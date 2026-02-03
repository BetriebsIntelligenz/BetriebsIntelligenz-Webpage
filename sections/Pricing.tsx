import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { Check } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <SectionWrapper id="pricing">
      <div className="text-center mb-12">
         <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Transparentes Modell</h2>
         <p className="text-slate-500 font-medium">Finanzierung des Aufbaus durch einmalige Fee. <br/>Danach sichert eine faire Pauschale den Betrieb.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
         {/* Setup Package */}
         <div className="glass-card p-8 rounded-3xl border border-white/60 bg-white/40">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Setup Paket</h3>
            <div className="text-3xl font-extrabold text-slate-900 mb-6">Einmalig</div>
            <p className="text-slate-500 text-sm mb-8 min-h-[40px] font-medium">
               Der komplette Aufbau Ihres Systems durch unsere Process Architects.
            </p>
            <ul className="space-y-4 mb-8">
               {['Analyse & Shadowing', 'Technische Installation', 'Content Erstellung (Init)', 'Admin Schulung'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                     <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs"><Check size={12} /></div> 
                     {item}
                  </li>
               ))}
            </ul>
            <button className="w-full py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold transition-colors shadow-sm">
               Pakete vergleichen
            </button>
         </div>

         {/* SaaS License */}
         <div className="glass-card p-8 rounded-3xl border-2 border-brand-primary/20 bg-white/70 shadow-2xl shadow-brand-primary/10 relative">
            <div className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-brand-primary/30">POPULAR</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Betrieb & Lizenz</h3>
            <div className="text-3xl font-extrabold text-slate-900 mb-6">Monatlich</div>
            <p className="text-slate-500 text-sm mb-8 min-h-[40px] font-medium">
               Laufende Wartung, KI-Updates und Hosting auf dediziertem Server.
            </p>
            <ul className="space-y-4 mb-8">
               {['Dedizierte Instanz', 'KI-Modell Updates', 'Sicherheits-Patches', 'Hypercare Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                     <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs"><Check size={12} /></div>
                     {item}
                  </li>
               ))}
            </ul>
            <button className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:scale-[1.02]">
               Angebot anfordern
            </button>
         </div>
      </div>
    </SectionWrapper>
  );
};