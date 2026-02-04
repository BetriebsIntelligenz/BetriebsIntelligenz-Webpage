// ... (imports) ...
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Lock, Save, Edit3, ArrowLeft, Image as ImageIcon, Layout, Eye, Trash2, CheckCircle2 } from 'lucide-react';

// --- Types ---
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  htmlContent: string;
  category: string;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Die Zukunft der Prozessautomatisierung',
    excerpt: 'Warum KI nicht den Menschen ersetzt, sondern ihn befähigt. Ein Deep Dive in hybride Arbeitsmodelle.',
    author: 'Dr. Sarah Weber',
    date: '2025-05-12',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    htmlContent: `
      <h2>Hybride Intelligenz</h2>
      <p>Die Angst vor der Automatisierung ist so alt wie die Maschine selbst. Doch was wir heute erleben, ist keine Verdrängung, sondern eine Symbiose.</p>
      <p>In unseren Analysen bei über 50 Mittelständlern haben wir festgestellt: <strong>Prozesse, die von KI unterstützt werden, laufen 3x schneller.</strong></p>
      <blockquote>"Der Mensch liefert den Kontext, die Maschine die Skalierung."</blockquote>
      <h3>Fazit</h3>
      <p>Wer jetzt nicht automatisiert, verwaltet nur noch den Mangel.</p>
    `
  },
  {
    id: '2',
    title: 'Onboarding in 2 Tagen statt 2 Wochen',
    excerpt: 'Wie strukturierte Wissensdatenbanken die Einarbeitungszeit drastisch reduzieren.',
    author: 'Markus Events',
    date: '2025-06-01',
    category: 'Productivity',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    htmlContent: `
      <h2>Das Problem des "Tribal Knowledge"</h2>
      <p>Wenn Wissen nur in Köpfen existiert, verlässt es das Unternehmen jeden Abend durch die Drehtür.</p>
      <ul>
        <li>Keine Dokumentation</li>
        <li>Fehleranfällige mündliche Überlieferung</li>
        <li>Frustration bei neuen Talenten</li>
      </ul>
      <p>Mit dem <strong>BetriebsIntelligenz Ecosystem</strong> ändern wir das fundamental.</p>
    `
  },
  {
    id: '3',
    title: 'DMN vs. LLM: Wann nutze ich was?',
    excerpt: 'Entscheidungsbäume (DMN) für Regeln, Large Language Models (LLM) für Kreativität.',
    author: 'Tech Team',
    date: '2025-06-15',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    htmlContent: `
      <h2>Determinismus trifft Probabilistik</h2>
      <p>Ein LLM halluziniert. Eine DMN-Tabelle (Decision Model and Notation) irrt nie.</p>
      <p>Für Gehaltsfreigaben nutzen wir DMN. Für den Entwurf der E-Mail an den Mitarbeiter nutzen wir LLMs. Die Kombination ist unschlagbar.</p>
    `
  }
];

interface BlogOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlogOverlay: React.FC<BlogOverlayProps> = ({ isOpen, onClose }) => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [view, setView] = useState<'list' | 'read' | 'admin'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [autoCleaned, setAutoCleaned] = useState(false);
  
  // Admin State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [editorPost, setEditorPost] = useState<BlogPost>({
    id: '', title: '', excerpt: '', author: 'Admin', date: new Date().toISOString().split('T')[0], imageUrl: '', htmlContent: '', category: 'General'
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setView('read');
  };

  const handleAdminAuth = () => {
    if (passwordInput === '1991') {
      setShowPasswordModal(false);
      setPasswordInput('');
      resetEditor();
      setView('admin');
    } else {
      alert("Zugriff verweigert.");
      setPasswordInput('');
    }
  };

  const resetEditor = () => {
    setEditorPost({
      id: '', 
      title: '', 
      excerpt: '', 
      author: 'BetriebsIntelligenz Team', 
      date: new Date().toISOString().split('T')[0], 
      imageUrl: 'https://images.unsplash.com/photo-1499750310159-52f0f83ad497?auto=format&fit=crop&q=80&w=800', 
      htmlContent: '<h1>Neuer Beitrag</h1><p>Hier Inhalt einfügen...</p>', 
      category: 'News'
    });
  };

  const sanitizeAndScopeHtml = (raw: string) => {
    let clean = raw;
    let modified = false;

    // 1. Remove Markdown fences (common when copying from AI)
    if (clean.includes('```html') || clean.includes('```')) {
        clean = clean.replace(/```html\s*([\s\S]*?)\s*```/gi, '$1');
        clean = clean.replace(/```\s*([\s\S]*?)\s*```/gi, '$1');
        modified = true;
    }

    // 2. Check for full document structure
    if (clean.match(/<!doctype|<html|<head|<body/i)) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(clean, 'text/html');

        // Extract Styles & Scope them
        const styleTags = Array.from(doc.querySelectorAll('style'));
        let cssContent = styleTags.map(s => s.innerHTML).join('\n');
        
        // --- Scoping Magic ---
        // We replace 'body' and 'html' selectors with a class wrapper to prevent breaking the main app.
        // Also handle :root to keep variables somewhat working locally
        cssContent = cssContent.replace(/(^|}|,)\s*body/gi, '$1 .blog-content-wrapper');
        cssContent = cssContent.replace(/(^|}|,)\s*html/gi, '$1 .blog-content-wrapper');
        cssContent = cssContent.replace(/:root/gi, '.blog-content-wrapper');

        // Extract Body Content
        const bodyInner = doc.body.innerHTML;

        // Reassemble
        clean = `<style>${cssContent}</style><div class="blog-content-wrapper w-full h-full">${bodyInner}</div>`;
        modified = true;
    }

    if (modified) {
        setAutoCleaned(true);
        setTimeout(() => setAutoCleaned(false), 3000);
    }
    
    return clean;
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newVal = e.target.value;
      // We process strictly on change. If the user pastes a full doc, it gets transformed immediately.
      // We could also do this onPaste, but onChange catches everything.
      // However, to allow editing, we only trigger heavy sanitization if we detect the dangerous tags.
      
      if (newVal.match(/<!doctype|<html|<head|<body|```/i)) {
          const sanitized = sanitizeAndScopeHtml(newVal);
          setEditorPost({ ...editorPost, htmlContent: sanitized });
      } else {
          setEditorPost({ ...editorPost, htmlContent: newVal });
      }
  };

  const handleSavePost = () => {
    if (!editorPost.title) return alert("Titel fehlt!");
    let newPosts = [...posts];
    if (editorPost.id) {
      newPosts = newPosts.map(p => p.id === editorPost.id ? editorPost : p);
    } else {
      const newPost = { ...editorPost, id: Date.now().toString() };
      newPosts.unshift(newPost);
    }
    setPosts(newPosts);
    alert("Post gespeichert!");
    setView('list');
  };

  const handleDeletePost = (id: string) => {
    if(window.confirm("Wirklich löschen?")) {
        setPosts(posts.filter(p => p.id !== id));
        resetEditor();
    }
  }

  const handleEditorSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'new') {
          resetEditor();
      } else {
          const p = posts.find(post => post.id === val);
          if (p) setEditorPost(p);
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-[#F5F5F7] overflow-hidden flex flex-col"
        >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            if (view !== 'list') setView('list');
                            else onClose();
                        }}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                    >
                        {view === 'list' ? <X size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <h2 className="text-xl font-bold text-slate-900">
                        {view === 'list' ? 'Knowledge Blog' : view === 'read' ? 'Artikel lesen' : 'Content Editor'}
                    </h2>
                </div>
                
                {view === 'list' && (
                     <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg"
                     >
                        <Plus size={16} /> Neuer Post
                     </button>
                )}
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto bg-[#F5F5F7] p-4 md:p-8 relative">
                
                {/* --- VIEW: LIST --- */}
                {view === 'list' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12 text-center max-w-2xl mx-auto">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Insights & Updates</h1>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Suche nach Themen..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-lg"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    layoutId={`card-${post.id}`}
                                    onClick={() => handleOpenPost(post)}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 cursor-pointer group flex flex-col h-full"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wide">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="text-xs text-slate-400 font-medium mb-2">{post.date} • {post.author}</div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-brand-primary transition-colors">{post.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-brand-primary font-bold text-sm mt-auto">
                                            Weiterlesen <ArrowLeft size={16} className="rotate-180" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIEW: READ --- */}
                {view === 'read' && selectedPost && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden min-h-[80vh] flex flex-col"
                    >
                         <div className="h-[40vh] w-full relative shrink-0">
                             <img src={selectedPost.imageUrl} className="w-full h-full object-cover" alt="Cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                             <div className="absolute bottom-0 left-0 p-8 text-white max-w-2xl">
                                <div className="flex items-center gap-4 text-sm font-medium opacity-80 mb-2">
                                    <span>{selectedPost.category}</span>
                                    <span>•</span>
                                    <span>{selectedPost.date}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight">{selectedPost.title}</h1>
                             </div>
                         </div>
                         {/* Content Wrapper ensures scoped CSS works if user pasted full page */}
                         <div className="p-8 md:p-12 prose prose-lg prose-slate max-w-none w-full blog-content-wrapper">
                             <div dangerouslySetInnerHTML={{ __html: selectedPost.htmlContent }} />
                         </div>
                    </motion.div>
                )}

                {/* --- VIEW: ADMIN EDITOR --- */}
                {view === 'admin' && (
                    <div className="max-w-7xl mx-auto h-full flex flex-col">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            
                            {/* Editor Sidebar */}
                            <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-y-auto space-y-6">
                                {/* ... Same Inputs as before ... */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Beitrag wählen</label>
                                    <select 
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium outline-none"
                                        onChange={handleEditorSelectionChange}
                                        value={editorPost.id || 'new'}
                                    >
                                        <option value="new">+ Neuen Beitrag erstellen</option>
                                        {posts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <input type="text" placeholder="Titel" value={editorPost.title} onChange={e => setEditorPost({...editorPost, title: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                                    <input type="text" placeholder="Kategorie" value={editorPost.category} onChange={e => setEditorPost({...editorPost, category: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                                    <input type="text" placeholder="Autor" value={editorPost.author} onChange={e => setEditorPost({...editorPost, author: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" />
                                    <input type="text" placeholder="Bild URL" value={editorPost.imageUrl} onChange={e => setEditorPost({...editorPost, imageUrl: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-xs" />
                                    <textarea placeholder="Kurzbeschreibung" rows={3} value={editorPost.excerpt} onChange={e => setEditorPost({...editorPost, excerpt: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm" />
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex gap-2">
                                    <button onClick={handleSavePost} className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><Save size={18} /> Speichern</button>
                                    {editorPost.id && <button onClick={() => handleDeletePost(editorPost.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={18} /></button>}
                                </div>
                            </div>

                            {/* HTML Editor Area */}
                            <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                                <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <Edit3 size={14} /> HTML Source Editor
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <AnimatePresence>
                                            {autoCleaned && (
                                                <motion.div initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0}} className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                                                    <CheckCircle2 size={12}/> Auto-Fixed HTML
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <span className="text-xs text-slate-400">Paste your raw HTML here</span>
                                    </div>
                                </div>
                                <textarea 
                                    className="flex-1 p-6 font-mono text-sm outline-none resize-none text-slate-700 bg-white"
                                    value={editorPost.htmlContent}
                                    onChange={handleHtmlChange}
                                    spellCheck={false}
                                    placeholder="<h1>Your Title</h1><p>Content...</p>"
                                />
                                <div className="h-1/3 border-t border-slate-200 bg-slate-50 overflow-y-auto p-6">
                                     <div className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Eye size={14}/> Live Preview</div>
                                     <div className="prose prose-sm max-w-none prose-slate bg-white p-4 rounded-xl border border-slate-200 shadow-sm blog-content-wrapper">
                                         <div dangerouslySetInnerHTML={{ __html: editorPost.htmlContent }} />
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- PASSWORD MODAL --- */}
            {showPasswordModal && (
                 <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4"><Lock className="text-slate-900" /></div>
                        <h3 className="text-center font-bold text-xl mb-6">Admin Access</h3>
                        <input type="password" autoFocus placeholder="Access Code" className="w-full text-center text-2xl tracking-widest p-3 border border-slate-200 rounded-xl mb-6 outline-none" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                        <div className="flex gap-3">
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
                            <button onClick={handleAdminAuth} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold">Unlock</button>
                        </div>
                    </div>
                 </div>
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
