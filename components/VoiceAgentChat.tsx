import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Play, Square, RotateCcw, Pause, Sparkles, AudioLines, Loader2, Bot, Mail, Check, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isAudioTranscript?: boolean;
};

type RecordingState = 'idle' | 'recording' | 'paused' | 'review';
type ProcessingStage = 'idle' | 'transcribing' | 'thinking';

export const VoiceAgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // --- Gatekeeper State ---
  const [hasAccess, setHasAccess] = useState(false);
  const [email, setEmail] = useState('');
  const [consentData, setConsentData] = useState(false);
  const [consentContact, setConsentContact] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Hallo! Ich bin Ihr Prozess-Assistent. Wie kann ich helfen?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [procStage, setProcStage] = useState<ProcessingStage>('idle');

  // Audio State
  const [recState, setRecState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  // Ref for the scrollable container instead of a dummy div
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Robust scrolling logic: set scrollTop to scrollHeight
    if (isOpen && hasAccess && scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
    }
  }, [messages.length, isOpen, hasAccess, procStage]);

  // --- Recorder Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        if (audioPlayerRef.current) {
            audioPlayerRef.current.src = URL.createObjectURL(blob);
        }
      };

      recorder.start();
      setRecState('recording');
      
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Bitte erlauben Sie den Zugriff auf das Mikrofon.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecState('paused');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecState('recording');
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setRecState('review');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const discardRecording = () => {
    setRecState('idle');
    setAudioBlob(null);
    setRecordingTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePreviewPlay = () => {
      if (audioPlayerRef.current) {
          if (isPlayingPreview) {
              audioPlayerRef.current.pause();
          } else {
              audioPlayerRef.current.play();
          }
          setIsPlayingPreview(!isPlayingPreview);
      }
  };

  // --- Gemini Logic ---
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSend = async () => {
    if (!process.env.API_KEY) {
        alert("API Key fehlt.");
        return;
    }

    const hasAudio = recState === 'review' && audioBlob;
    if (!inputValue && !hasAudio) return;

    // Optimistic UI for text
    if (!hasAudio) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: inputValue }]);
        setInputValue('');
        setProcStage('thinking');
    } else {
        setProcStage('transcribing');
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let userPrompt = inputValue;
        
        // 1. Handle Audio (Transcribe first)
        if (hasAudio && audioBlob) {
            const base64Audio = await blobToBase64(audioBlob);
            
            const transcriptionResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'audio/webm', data: base64Audio } },
                        { text: "Transkribiere diese Audioaufnahme exakt. Gib NUR den Text zurück." }
                    ]
                }
            });

            const transcriptText = transcriptionResponse.text || "(Keine Sprache erkannt)";
            userPrompt = transcriptText;

            // Add transcript as user message
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'user', 
                text: transcriptText,
                isAudioTranscript: true
            }]);
            
            discardRecording(); // Clear audio UI
            setProcStage('thinking'); // Move to thinking stage
        }

        // 2. Get AI Response
        const replyResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Du bist ein hilfreicher Assistent für eine Firmen-Wissensdatenbank. Antworte mit gut strukturiertem Markdown (Nutze Fettungen, Listen und Absätze wo sinnvoll). Antworte auf: "${userPrompt}"`
        });
        
        setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            text: replyResponse.text || "Ich konnte das leider nicht verarbeiten."
        }]);

    } catch (error) {
        console.error("Gemini Error:", error);
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'assistant', 
            text: "Verbindungsfehler zum AI Gehirn."
        }]);
    } finally {
        setProcStage('idle');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && consentData && consentContact) {
      setHasAccess(true);
    }
  };

  return (
    <>
      {/* --- Floating Action Button --- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_40px_rgba(79,70,229,0.5)] flex items-center justify-center z-[60] group border border-white/20"
          >
            <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-30" />
            <Mic size={28} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- Overlay & Modal --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            
            {/* Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Main Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl h-[700px] max-h-[90vh] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20 text-white"
            >
              
              {/* Decorative Glows */}
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-400/20 rounded-full blur-[80px] pointer-events-none" />

              {/* Header - Shrink-0 ensures it keeps its size */}
              <div className="relative z-20 px-6 py-5 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Bot size={20} className="text-white" />
                      </div>
                      <div>
                          <div className="font-bold text-white leading-tight">AI Assistant</div>
                          <div className="text-[10px] text-blue-200 font-medium flex items-center gap-1.5">
                              {hasAccess ? (
                                <>
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                  </span>
                                  Ready to listen
                                </>
                              ) : (
                                <span className="text-white/60">Authentication required</span>
                              )}
                          </div>
                      </div>
                  </div>
                  <button 
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/80"
                  >
                      <X size={18} />
                  </button>
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 flex flex-col min-h-0 relative z-10">
              {!hasAccess ? (
                // --- GATEKEEPER FORM (Centered) ---
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth flex flex-col justify-center">
                   <div className="w-full max-w-sm mx-auto">
                      <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-lg backdrop-blur-md mx-auto shrink-0">
                         <ShieldCheck size={40} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-center text-white drop-shadow-md">Willkommen</h3>
                      <p className="text-white/80 text-sm mb-8 text-center leading-relaxed">
                         Bevor wir starten, benötigen wir Ihre E-Mail zur Personalisierung und Ihre Zustimmung.
                      </p>

                      <form onSubmit={handleAccessSubmit} className="w-full space-y-4">
                         {/* Email Input */}
                         <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="ihre.email@firma.de"
                              className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all"
                            />
                         </div>

                         {/* Checkbox 1: Data Processing */}
                         <label className="flex items-start gap-3 text-left p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                             <div className="relative flex items-center mt-0.5 shrink-0">
                                <input 
                                  type="checkbox" 
                                  required
                                  checked={consentData}
                                  onChange={(e) => setConsentData(e.target.checked)}
                                  className="peer appearance-none w-5 h-5 border-2 border-white/30 rounded checked:bg-green-500 checked:border-green-500 transition-all"
                                />
                                <Check size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                             </div>
                             <span className="text-xs text-white/80 leading-relaxed group-hover:text-white transition-colors">
                                Ich stimme der <strong>Verarbeitung meiner Chat-Daten</strong> zu.
                             </span>
                         </label>

                         {/* Checkbox 2: Contact */}
                         <label className="flex items-start gap-3 text-left p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                             <div className="relative flex items-center mt-0.5 shrink-0">
                                <input 
                                  type="checkbox" 
                                  required
                                  checked={consentContact}
                                  onChange={(e) => setConsentContact(e.target.checked)}
                                  className="peer appearance-none w-5 h-5 border-2 border-white/30 rounded checked:bg-blue-500 checked:border-blue-500 transition-all"
                                />
                                <Check size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                             </div>
                             <span className="text-xs text-white/80 leading-relaxed group-hover:text-white transition-colors">
                                Ich stimme zu, dass mich BetriebsIntelligenz <strong>per E-Mail kontaktieren</strong> darf.
                             </span>
                         </label>

                         <button 
                            type="submit"
                            disabled={!email || !consentData || !consentContact}
                            className="w-full py-4 mt-4 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                         >
                            Chat Starten <Send size={18} />
                         </button>
                      </form>
                   </div>
                </div>
              ) : (
                // --- CHAT INTERFACE ---
                <div className="flex flex-col h-full w-full overflow-hidden">
                  {/* Message List: Flex-1 takes available space */}
                  <div 
                      ref={scrollContainerRef}
                      className="flex-1 overflow-y-auto px-6 pt-10 pb-4 space-y-6 scroll-smooth"
                  >
                      {messages.map((msg) => (
                          <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                              <div 
                                  className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed shadow-lg backdrop-blur-sm ${
                                      msg.role === 'user' 
                                          ? 'bg-blue-600 text-white rounded-br-sm' 
                                          : 'bg-white text-slate-800 rounded-bl-sm'
                                  }`}
                              >
                                  {msg.isAudioTranscript && (
                                      <div className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full w-fit mb-2 font-bold uppercase tracking-wider ${
                                          msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                                      }`}>
                                          <Mic size={10} /> Voice Transcript
                                      </div>
                                  )}
                                  
                                  {/* Markdown Rendering */}
                                  <div className={`prose prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:mb-2 prose-headings:mt-4 prose-headings:text-base prose-strong:font-bold max-w-none ${
                                    msg.role === 'user' 
                                        ? 'prose-invert prose-p:text-white prose-headings:text-white' 
                                        : 'prose-slate prose-p:text-slate-700 prose-headings:text-slate-900'
                                  }`}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                  </div>
                              </div>
                          </motion.div>
                      ))}

                      {/* --- Animation: Transcribing --- */}
                      {procStage === 'transcribing' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                              <div className="bg-blue-600 border border-blue-500 backdrop-blur-md p-4 rounded-2xl rounded-br-sm text-white flex items-center gap-3">
                                  <div className="flex gap-1 h-4 items-center">
                                      {[1,2,3,4,5].map(i => (
                                          <motion.div 
                                              key={i}
                                              animate={{ height: [4, 16, 4] }}
                                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                              className="w-1 bg-white rounded-full"
                                          />
                                      ))}
                                  </div>
                                  <span className="text-xs font-bold tracking-wide">Transcribing...</span>
                              </div>
                          </motion.div>
                      )}

                      {/* --- Animation: Thinking --- */}
                      {procStage === 'thinking' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                              <div className="bg-white border border-white/50 backdrop-blur-md p-3 rounded-2xl rounded-bl-sm flex items-center gap-2 text-slate-600">
                                  <Loader2 size={16} className="animate-spin text-blue-600" />
                                  <span className="text-xs font-medium">AI is thinking...</span>
                              </div>
                          </motion.div>
                      )}
                  </div>

                  {/* Input Area: Shrink-0 stays at bottom */}
                  <div className="px-4 pb-6 pt-2 shrink-0 z-20">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-xl relative">
                          {/* Darker overlay for better contrast since we are on gradient */}
                          <div className="absolute inset-0 bg-black/10 rounded-3xl pointer-events-none" /> 
                          
                          {/* Content wrapper to be above overlay */}
                          <div className="relative z-10">
                            {/* Audio Player UI inside Input */}
                            <AnimatePresence>
                                {(recState !== 'idle') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mb-2 bg-black/20 rounded-2xl overflow-hidden"
                                    >
                                        <div className="p-4 flex flex-col items-center">
                                            {recState === 'review' ? (
                                                <div className="w-full flex items-center justify-between">
                                                    <audio ref={audioPlayerRef} onEnded={() => setIsPlayingPreview(false)} className="hidden" />
                                                    <button onClick={togglePreviewPlay} className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
                                                        {isPlayingPreview ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                                                    </button>
                                                    <div className="flex-1 mx-4 h-1 bg-white/20 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-400 w-full" />
                                                    </div>
                                                    <button onClick={discardRecording} className="p-2 text-white/50 hover:text-red-400 transition-colors">
                                                        <RotateCcw size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full flex flex-col items-center">
                                                    <div className="font-mono text-2xl font-bold text-white mb-2 tracking-widest">
                                                        {formatTime(recordingTime)}
                                                    </div>
                                                    <div className="flex items-center gap-1 h-8 mb-4">
                                                        {[...Array(12)].map((_, i) => (
                                                            <motion.div 
                                                                key={i}
                                                                animate={recState === 'recording' ? { height: [10, Math.random() * 32 + 8, 10] } : { height: 4 }}
                                                                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                                                                className="w-1.5 bg-red-500 rounded-full"
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button onClick={recState === 'recording' ? pauseRecording : resumeRecording} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                                            {recState === 'recording' ? <Pause size={20} /> : <Mic size={20} />}
                                                        </button>
                                                        <button onClick={stopRecording} className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors">
                                                            <Square size={20} fill="currentColor" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-end gap-2">
                                <div className="flex-1 relative">
                                    <textarea 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder={recState === 'review' ? "Notiz zur Aufnahme..." : "Nachricht eingeben..."}
                                        className="w-full bg-transparent text-white placeholder:text-white/40 border-none outline-none px-4 py-3 text-sm resize-none max-h-[100px]"
                                        rows={1}
                                    />
                                </div>

                                {recState === 'idle' && (
                                    <button 
                                        onClick={startRecording}
                                        className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <AudioLines size={22} />
                                    </button>
                                )}

                                <button 
                                    onClick={handleSend}
                                    disabled={(procStage !== 'idle') || (!inputValue && recState !== 'review')}
                                    className={`p-3 rounded-xl transition-all ${
                                        (inputValue || recState === 'review') 
                                            ? 'bg-white text-blue-600 hover:scale-105 shadow-lg' 
                                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
              )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};