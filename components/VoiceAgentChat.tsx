import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Play, Square, RotateCcw, Pause, Sparkles, AudioLines, Loader2, Bot, Mail, Check, ShieldCheck, Calendar, HelpCircle, Phone, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- Configuration ---
const N8N_WEBHOOK_URL = "https://n8n.srv1089373.hstgr.cloud/webhook/92b6a763-0d59-4cd2-b533-c85dd5227496";

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isAudioTranscript?: boolean;
  topicLabel?: string; // Label for the topic (e.g., [DEMO])
};

type RecordingState = 'idle' | 'recording' | 'paused' | 'review';
type ProcessingStage = 'idle' | 'transcribing' | 'thinking';

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// --- Helper: Local ISO String with Offset (e.g. 2026-02-06T11:30:00.000+01:00) ---
const toLocalISOString = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const offset = -date.getTimezoneOffset();
    const diff = offset >= 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;

    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.000' +
        diff + pad(offsetHours) + ':' + pad(offsetMinutes);
};

export const VoiceAgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // --- Gatekeeper State ---
  const [hasAccess, setHasAccess] = useState(false);
  const [hasSelectedTopic, setHasSelectedTopic] = useState(false); 
  const [selectedTopic, setSelectedTopic] = useState<string>(''); 
  const [email, setEmail] = useState('');
  const [consentData, setConsentData] = useState(false);
  const [consentContact, setConsentContact] = useState(false);

  // --- Scheduler State ---
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Calendar View State (Fixed to 2026)
  const [viewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(0); // 0 = Jan, 11 = Dec

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (isOpen && hasAccess && hasSelectedTopic && scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
    }
  }, [messages.length, isOpen, hasAccess, hasSelectedTopic, procStage, showScheduler]);

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

  // --- SEND LOGIC (N8N INTEGRATION) ---
  const handleSend = async (overrideMessage?: string, extraPayload?: any) => {
    
    // Basic check for Voice Transcribing Key (Local)
    if (!process.env.API_KEY) {
        alert("API Key für Transkription fehlt.");
        return;
    }

    const hasAudio = recState === 'review' && audioBlob;
    // If no manual input and no override, return
    if (!inputValue && !hasAudio && !overrideMessage) return;

    let messageToSend = overrideMessage || inputValue;

    // 1. Handle Audio (Local Transcribe first via Gemini Client)
    if (hasAudio && audioBlob && !overrideMessage) {
        setProcStage('transcribing');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
            messageToSend = transcriptText;

            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'user', 
                text: transcriptText,
                isAudioTranscript: true
            }]);
            
            discardRecording(); 
        } catch (error) {
            console.error("Transcription Error:", error);
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'assistant', 
                text: "Fehler bei der Audio-Transkription."
            }]);
            setProcStage('idle');
            return;
        }
    } else {
        // Text Message (User typed or System override)
        // If it looks like JSON, render it as code block or let Markdown handle it
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'user', 
            text: messageToSend.startsWith('{') ? '```json\n' + messageToSend + '\n```' : messageToSend 
        }]);
        setInputValue('');
    }

    // 2. Send to N8N Webhook
    setProcStage('thinking');
    
    try {
        const payload = {
            message: messageToSend,
            email: email, 
            topic: selectedTopic, 
            timestamp: new Date().toISOString(),
            ...extraPayload 
        };

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "");
            if (errorText.includes("Unused Respond to Webhook node")) {
                throw new Error("N8N_CONFIG_ERROR");
            }
            console.error(`N8N Response Error (${response.status}):`, errorText);
            throw new Error(`Server Error: ${response.status}`);
        }

        const textData = await response.text();
        if (!textData) throw new Error("EMPTY_RESPONSE");
        
        let data;
        try {
            data = JSON.parse(textData);
        } catch (e) {
             console.error("JSON Parse Error. Raw text:", textData);
             throw new Error("INVALID_JSON");
        }
        
        let aiResponseText = "";
        if (data.text) aiResponseText = data.text;
        else if (data.output) aiResponseText = data.output;
        else if (data.message) aiResponseText = data.message;
        else if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
            if (firstItem?.content?.parts?.[0]?.text) {
                aiResponseText = firstItem.content.parts[0].text;
            } else if (firstItem?.text) {
                aiResponseText = firstItem.text;
            } else if (firstItem?.output) {
                aiResponseText = firstItem.output;
            }
        }
        else if (data?.content?.parts?.[0]?.text) {
            aiResponseText = data.content.parts[0].text;
        }

        if (!aiResponseText) {
            aiResponseText = "Antwort erhalten.";
        }

        setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            text: aiResponseText
        }]);

    } catch (error: any) {
        console.warn("Primary Backend (N8N) failed, attempting fallback...", error);

        // --- FALLBACK: Direct Gemini Call ---
        if (process.env.API_KEY) {
             try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const systemPrompt = `Du bist der 'BetriebsIntelligenz' AI Assistant.
Thema des Nutzers: ${selectedTopic || 'Allgemein'}.
Kontext: Der Nutzer ist auf der Webseite von BetriebsIntelligenz (Prozess-Optimierung & Automation).
Aufgabe: Antworte hilfreich, freundlich und kurz auf die Anfrage.`;

                const fallbackResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: messageToSend,
                    config: {
                        systemInstruction: systemPrompt,
                    }
                });
                
                const fallbackText = fallbackResponse.text;
                if (fallbackText) {
                     setMessages(prev => [...prev, { 
                        id: (Date.now() + 1).toString(), 
                        role: 'assistant', 
                        text: fallbackText 
                    }]);
                    setProcStage('idle');
                    return; 
                }
             } catch (fallbackError) {
                 console.error("Fallback failed:", fallbackError);
             }
        }
        
        let errorMessage = "Ich konnte das System nicht erreichen.";
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'assistant', 
            text: errorMessage
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

  // --- Handle Topic Selection ---
  const handleTopicSelection = (topic: 'demo' | 'service' | 'contact') => {
      setSelectedTopic(topic); 
      let initialText = "Hallo! Wie kann ich helfen?";
      let label = "";
      
      switch(topic) {
          case 'demo':
              label = "Demo buchen";
              initialText = "Klasse! Ich helfe Ihnen gerne bei der Demo-Buchung. Bitte wählen Sie unten Ihren Wunschtermin für 2026 aus.";
              setShowScheduler(true); // TRIGGER SCHEDULER
              break;
          case 'service':
              label = "Fragen zum Service";
              initialText = "Gerne. Stellen Sie mir jede Frage zu unserem Service, den Preisen oder der Technologie.";
              break;
          case 'contact':
              label = "Kontakt";
              initialText = "Wie kann ich Ihnen helfen? Möchten Sie eine Nachricht hinterlassen oder benötigen Sie Kontaktdaten?";
              break;
      }

      setMessages([{ 
          id: '1', 
          role: 'assistant', 
          text: initialText,
          topicLabel: label 
      }]);
      setHasSelectedTopic(true);
  };

  // --- Calendar Helpers ---
  const handleMonthChange = (dir: -1 | 1) => {
      const newMonth = viewMonth + dir;
      if (newMonth >= 0 && newMonth <= 11) {
          setViewMonth(newMonth);
          // Optional: clear selection if changing month? 
          // setSelectedDate(null); 
      }
  };

  const getDaysForMonthView = (month: number, year: number) => {
      // 1. First day of month
      const firstDay = new Date(year, month, 1);
      // 2. Days in month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Calculate offset (JavaScript getDay: 0=Sun, 1=Mon...6=Sat)
      // We want Mon=0, ..., Sun=6
      let startDayOffset = firstDay.getDay() - 1;
      if (startDayOffset === -1) startDayOffset = 6;

      const days = [];
      // Empty slots
      for (let i = 0; i < startDayOffset; i++) {
          days.push(null);
      }
      // Actual days
      for (let i = 1; i <= daysInMonth; i++) {
          days.push(new Date(year, month, i));
      }
      return days;
  };

  // --- Handle Scheduler Submit ---
  const handleScheduleSubmit = () => {
    if (selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        
        const scheduleDate = new Date(selectedDate);
        scheduleDate.setHours(hours, minutes, 0, 0);

        // Generate Single ISO string with local offset (e.g., 2026-02-06T11:30:00.000+01:00)
        const startDateTime = toLocalISOString(scheduleDate);

        // Construct JSON Payload (Single Value)
        const payloadObj = {
            startDateTime: startDateTime
        };
        const payloadString = JSON.stringify(payloadObj, null, 2);

        setShowScheduler(false); // Hide widget
        
        // Send JSON string as message + structured payload to N8N
        handleSend(payloadString, {
            json: payloadObj,      // JSON object in body
            startDateTime: startDateTime // Flat property in body
        });
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

              {/* Header */}
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
                                  Ready to listen (n8n connected)
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
              
              {/* --- 1. GATEKEEPER --- */}
              {!hasAccess ? (
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

                         {/* Checkboxes */}
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
                            Weiter <Send size={18} />
                         </button>
                      </form>
                   </div>
                </div>
              ) : !hasSelectedTopic ? (
                // --- 2. SELECTION SCREEN ---
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth flex flex-col justify-center items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md text-center"
                    >
                        <h3 className="text-2xl font-bold mb-8 text-white">Wie können wir helfen?</h3>
                        
                        <div className="grid gap-4">
                            <button 
                                onClick={() => handleTopicSelection('demo')}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 p-5 rounded-2xl flex items-center gap-4 transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <Calendar className="text-white" size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">Demo buchen</div>
                                    <div className="text-xs text-white/60">Terminvereinbarung & Live-Präsentation</div>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleTopicSelection('service')}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 p-5 rounded-2xl flex items-center gap-4 transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <HelpCircle className="text-white" size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white group-hover:text-purple-200 transition-colors">Fragen zum Service</div>
                                    <div className="text-xs text-white/60">Preise, Features & Umsetzung</div>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleTopicSelection('contact')}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 p-5 rounded-2xl flex items-center gap-4 transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <Phone className="text-white" size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white group-hover:text-green-200 transition-colors">Kontakt</div>
                                    <div className="text-xs text-white/60">Support & Allgemeine Anfragen</div>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </div>
              ) : (
                // --- 3. CHAT INTERFACE ---
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
                                  
                                  {/* Visual Topic Label */}
                                  {msg.topicLabel && (
                                      <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 border border-slate-200">
                                          [{msg.topicLabel}]
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

                      {/* --- SCHEDULER WIDGET (MONTH VIEW 2026) --- */}
                      {showScheduler && (
                          <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg mb-4 text-white"
                          >
                             {/* Header (Month Navigation) */}
                             <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                <button 
                                    onClick={() => handleMonthChange(-1)} 
                                    disabled={viewMonth === 0}
                                    className="p-1 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="font-bold text-lg">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                                <button 
                                    onClick={() => handleMonthChange(1)} 
                                    disabled={viewMonth === 11}
                                    className="p-1 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                             </div>

                             {/* Days Grid */}
                             <div className="mb-4">
                                {/* Weekday Labels */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {WEEKDAYS.map(d => (
                                        <div key={d} className="text-center text-[10px] font-bold text-white/50 uppercase">{d}</div>
                                    ))}
                                </div>
                                {/* Day Cells */}
                                <div className="grid grid-cols-7 gap-1">
                                    {getDaysForMonthView(viewMonth, viewYear).map((date, i) => {
                                        if (!date) return <div key={`empty-${i}`} className="w-8 h-8" />;
                                        
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                                        // Simple heuristic: Disable weekends
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                                disabled={isWeekend}
                                                className={`h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                                                    isSelected 
                                                        ? 'bg-blue-600 text-white shadow-md font-bold' 
                                                        : isWeekend
                                                            ? 'text-white/20 cursor-not-allowed'
                                                            : 'text-white hover:bg-white/20'
                                                }`}
                                            >
                                                {date.getDate()}
                                            </button>
                                        );
                                    })}
                                </div>
                             </div>

                             {/* Time Grid (Only shows if date selected) */}
                             {selectedDate && (
                                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                                     <label className="text-xs text-white/50 mb-2 block uppercase font-bold tracking-wider">Uhrzeit</label>
                                     <div className="grid grid-cols-4 gap-2">
                                         {TIME_SLOTS.map((time) => (
                                             <button
                                                 key={time}
                                                 onClick={() => setSelectedTime(time)}
                                                 className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
                                                     selectedTime === time 
                                                     ? 'bg-green-500 text-white shadow-sm' 
                                                     : 'bg-white/5 hover:bg-white/10'
                                                 }`}
                                             >
                                                 {time}
                                             </button>
                                         ))}
                                     </div>
                                 </motion.div>
                             )}

                             {/* Submit Action */}
                             <button
                                 disabled={!selectedDate || !selectedTime}
                                 onClick={handleScheduleSubmit}
                                 className="w-full py-3 rounded-xl bg-white text-blue-900 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                             >
                                 Termin anfragen <Send size={16} />
                             </button>
                          </motion.div>
                      )}

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
                                  <span className="text-xs font-medium">Assistant is thinking...</span>
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
                                    onClick={() => handleSend()}
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