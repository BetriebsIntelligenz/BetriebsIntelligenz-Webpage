import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/40 backdrop-blur-xl pt-16 pb-8">
       <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
             <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-sm shadow-md">B</div>
                   <span className="font-bold text-slate-900">BetriebsIntelligenz</span>
                </div>
                <p className="text-slate-500 text-sm max-w-sm font-medium">
                   Verwandeln Sie implizites Wissen in ein ausführbares System. Das erste digitale Gehirn für den Mittelstand.
                </p>
             </div>
             
             <div>
                <h4 className="font-bold text-slate-900 mb-4">Produkt</h4>
                <ul className="space-y-3 text-sm text-slate-500 font-medium">
                   <li><a href="#" className="hover:text-brand-primary transition-colors">Living Knowledge</a></li>
                   <li><a href="#" className="hover:text-brand-primary transition-colors">Active Guidance</a></li>
                   <li><a href="#" className="hover:text-brand-primary transition-colors">Org-Graph</a></li>
                </ul>
             </div>

             <div>
                <h4 className="font-bold text-slate-900 mb-4">Unternehmen</h4>
                <ul className="space-y-3 text-sm text-slate-500 font-medium">
                   <li><a href="#" className="hover:text-brand-primary transition-colors">Über uns</a></li>
                   <li><a href="#" className="hover:text-brand-primary transition-colors">Kontakt</a></li>
                   <li><a href="#" className="hover:text-brand-primary transition-colors">Impressum</a></li>
                </ul>
             </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 text-center text-xs text-slate-400 font-medium">
             &copy; {new Date().getFullYear()} BetriebsIntelligenz Ecosystem. Made with Intent.
          </div>
       </div>
    </footer>
  );
};