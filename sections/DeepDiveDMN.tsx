import React, { useState } from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { Check, X, RefreshCw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DeepDiveDMN: React.FC = () => {
  const [amount, setAmount] = useState<number>(3000);
  const [role, setRole] = useState('manager');
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null);

  const calculate = () => {
    // Simple logic simulation
    if (amount > 5000 && role !== 'cfo') {
      setResult('rejected');
    } else {
      setResult('approved');
    }
  };

  return (
    <SectionWrapper id="deep-dive">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Vom Lesen zum Handeln</h2>
        <p className="text-slate-500 font-medium">
           Mitarbeiter müssen keine Handbücher wälzen. <br/>
           Sie geben Daten ein, das System liefert die Entscheidung.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left: The Old Way (Static Text) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative opacity-60 scale-95 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-100 transition-all duration-500">
          <div className="absolute -top-3 -left-3 bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-bold transform -rotate-6 shadow-md">OLD WAY</div>
          <div className="prose prose-sm max-w-none text-slate-500 font-serif">
             <h4 className="text-slate-800 font-bold font-sans mb-4">Richtlinie 4.2: Budgetfreigabe</h4>
             <p className="leading-loose italic">
                "...beträgt der Nettoauftragswert mehr als 5.000 EUR, ist gemäß Absatz 3 die Zustimmung des CFOs einzuholen, es sei denn, der Antragsteller befindet sich in der Kostenstelle 304..."
             </p>
             <div className="space-y-2 mt-4 opacity-30">
                <div className="h-2 bg-slate-300 rounded w-full" />
                <div className="h-2 bg-slate-300 rounded w-5/6" />
                <div className="h-2 bg-slate-300 rounded w-4/6" />
             </div>
          </div>
        </div>

        {/* Right: The New Way (DMN Calculator - iOS Style) */}
        <motion.div 
          initial={{ rotateY: 10 }}
          whileInView={{ rotateY: 0 }}
          className="glass-panel p-8 rounded-[32px] border-white/80 shadow-2xl shadow-brand-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />
          
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900">Budget Check</h3>
             <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Active Guidance</span>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Betrag</label>
                 <span className="font-mono font-bold text-brand-primary">{amount} €</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="10000" 
                step="500"
                value={amount}
                onChange={(e) => { setAmount(Number(e.target.value)); setResult(null); }}
                className="w-full accent-brand-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rolle</label>
               <div className="relative">
                  <select 
                    value={role} 
                    onChange={(e) => { setRole(e.target.value); setResult(null); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium appearance-none focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  >
                    <option value="junior">Junior Associate</option>
                    <option value="manager">Senior Manager</option>
                    <option value="cfo">Chief Financial Officer (CFO)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
               </div>
            </div>

            <button 
              onClick={calculate}
              className="w-full py-3.5 bg-brand-primary rounded-xl text-white font-bold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Entscheidung prüfen
            </button>
          </div>

          <div className="mt-6 min-h-[70px]">
             <AnimatePresence mode="wait">
                {result === 'approved' && (
                   <motion.div 
                     key="approved"
                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                     className="bg-green-500 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-green-500/20"
                   >
                      <div className="bg-white/20 p-2 rounded-full"><Check size={20} /></div>
                      <div>
                         <div className="font-bold">Genehmigt</div>
                         <div className="text-xs opacity-90">Freigabe erteilt. Prozess fortsetzen.</div>
                      </div>
                   </motion.div>
                )}
                {result === 'rejected' && (
                   <motion.div 
                     key="rejected"
                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                     className="bg-red-500 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-red-500/20"
                   >
                      <div className="bg-white/20 p-2 rounded-full"><X size={20} /></div>
                      <div>
                        <span className="font-bold block">Abgelehnt</span>
                        <span className="text-xs opacity-90">Erfordert CFO Freigabe (>5000€)</span>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};