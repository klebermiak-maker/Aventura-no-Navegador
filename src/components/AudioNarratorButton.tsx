import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/audio';

interface Props {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function AudioNarratorButton({ text, size = 'md', label = 'Ouvir', className = '' }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, () => {
        setIsSpeaking(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSpeaking ? 'Parar leitura de voz' : `Ouvir em voz alta: ${label}`}
      className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer select-none focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:outline-none shrink-0 ${
        isSpeaking
          ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400 animate-pulse'
          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 active:scale-95'
      } ${sizeClasses[size]} ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-5 h-5 text-white" aria-hidden="true" />
          <span className="font-semibold">Parar Leitura</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-amber-800" aria-hidden="true" />
          <span className="font-semibold">{label}</span>
        </>
      )}
    </button>
  );
}
