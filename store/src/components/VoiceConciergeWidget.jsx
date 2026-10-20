import React, { useState, useEffect, useRef } from 'react';
import storeConfig from '../config/store.config';
import { 
  Play, 
  Pause, 
  Mic, 
  Phone, 
  X, 
  Volume2, 
  Sparkles,
  MessageCircle,
  Headphones
} from 'lucide-react';

export default function VoiceConciergeWidget({ consultantPhone, consultantName }) {
  const activePhone = consultantPhone || storeConfig.contact.phone;
  const activeName = consultantName || storeConfig.contact.ownerName;

  if (storeConfig.features.enableVoiceConcierge === false) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioIntervalRef = useRef(null);

  // Playback simulation with animated soundwaves
  const handleTogglePlay = () => {
    if (isPlaying) {
      clearInterval(audioIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Play a soft high-end audio frequency cue via Web Audio API
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // audio context fallback
      }

      audioIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(audioIntervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500); // 10 second voice message simulation
    }
  };

  useEffect(() => {
    return () => clearInterval(audioIntervalRef.current);
  }, []);

  const waVoiceText = encodeURIComponent(
    `Hello ${activeName}! I just listened to your voice message on your store. I would like a personalized consultation via voice note.`
  );
  const waUrl = `https://wa.me/${activePhone}?text=${waVoiceText}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40">
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-zinc-200 shadow-2xl transition-all hover:scale-105 cursor-pointer border border-[#DEB573]/40 group"
          aria-label="Open voice concierge"
        >
          <div className="relative">
            <Mic className="w-4 h-4 text-[#DEB573] dark:text-[#C48B3B]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            {activeName.split(' ')[0]}'s Voice Note
          </span>
        </button>
      )}

      {/* Expanded Voice Concierge Card */}
      {isOpen && (
        <div className="w-[320px] sm:w-[350px] bg-white dark:bg-[#0E0E10] text-[#1A1615] dark:text-white rounded-3xl p-5 shadow-2xl border border-[#EADBCE] dark:border-white/10 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5EFEB] dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/catalog/page_11.jpg"
                  alt={activeName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#DEB573]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{activeName}</h4>
                <p className="text-[10px] text-[#8C7B72] dark:text-zinc-400">{storeConfig.contact.ownerTitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-[#8C7B72] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Player Body */}
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-3 bg-[#FAF6F0] dark:bg-zinc-900 p-3 rounded-2xl border border-[#EADBCE] dark:border-zinc-800">
              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              {/* Soundwaves Visualization */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-1 h-6">
                  {[40, 75, 90, 50, 30, 85, 100, 60, 45, 80, 95, 35, 70, 85, 50, 30, 65, 80].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        isPlaying && i <= (progress / 100) * 18
                          ? 'bg-[#DEB573]'
                          : 'bg-[#EADBCE] dark:bg-zinc-700'
                      }`}
                      style={{ height: isPlaying ? `${Math.max(20, (h * (progress % 20 + 10)) / 25)}%` : `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8C7B72] dark:text-zinc-400">
                  <span>{isPlaying ? `0:0${Math.floor((progress / 100) * 10)}` : '0:10'}</span>
                  <span>Audio Greeting & Consultation</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#6E5D53] dark:text-zinc-300 italic leading-relaxed">
              "{storeConfig.contact.voiceNoteGreeting}"
            </p>
          </div>

          {/* WhatsApp Direct Voice Note Action */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Reply via WhatsApp Voice Note</span>
          </a>
        </div>
      )}
    </div>
  );
}
