import { Lightbulb, Sparkles, Clock, X, HelpCircle, ArrowRight } from 'lucide-react';
import { AccessibilitySettings } from '../types/game';
import { AudioNarratorButton } from './AudioNarratorButton';
import { playSound } from '../utils/audio';

interface AnimatedHintBannerProps {
  hintText: string;
  narratorText?: string;
  secondsElapsed?: number;
  isTimeoutReached?: boolean;
  onDismiss: () => void;
  settings: AccessibilitySettings;
  targetElementName?: string;
}

export function AnimatedHintBanner({
  hintText,
  narratorText,
  secondsElapsed,
  isTimeoutReached = true,
  onDismiss,
  settings,
  targetElementName,
}: AnimatedHintBannerProps) {
  const speechText = narratorText || hintText;

  const handleDismiss = () => {
    playSound('click', settings.soundEffects);
    onDismiss();
  };

  return (
    <aside
      aria-live="polite"
      role="region"
      aria-label="Dica pedagógica animada"
      className={`rounded-2xl border-2 p-4 md:p-5 relative transition-all duration-300 animate-in fade-in slide-in-from-top-3 shadow-lg ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300 shadow-yellow-400/20'
          : 'bg-linear-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-300 text-amber-950 shadow-amber-200/50'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Animated Lightbulb Icon */}
          <div
            className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
              settings.highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-amber-400 text-amber-950 shadow-inner'
            }`}
          >
            <Lightbulb className="w-5 h-5 animate-bounce" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-sm md:text-base font-['Fredoka']">
              Dica Amiga do Mascote!
            </span>
            {isTimeoutReached && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  settings.highContrast
                    ? 'bg-yellow-400/20 text-yellow-200 border border-yellow-400'
                    : 'bg-amber-200/80 text-amber-900 border border-amber-300'
                }`}
              >
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>Mais de 30s de exploração</span>
              </span>
            )}
            {targetElementName && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  settings.highContrast
                    ? 'bg-yellow-300 text-black'
                    : 'bg-orange-200 text-orange-900'
                }`}
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>Olhe: {targetElementName}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Narrate & Dismiss */}
        <div className="flex items-center gap-1.5">
          <AudioNarratorButton text={speechText} label="Ouvir Dica" size="sm" />
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fechar dica"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              settings.highContrast
                ? 'text-yellow-300 hover:bg-yellow-900/50'
                : 'text-amber-800 hover:bg-amber-200/60'
            }`}
            title="Fechar dica"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-1 space-y-2">
        <p className="text-sm md:text-base font-medium leading-relaxed">
          {hintText}
        </p>

        <div className="flex items-center justify-between text-xs pt-1 opacity-90">
          <span className="flex items-center gap-1 font-semibold text-amber-800 dark:text-yellow-400">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Veja o elemento com destaque brilhante piscando na tela abaixo!</span>
          </span>

          <button
            type="button"
            onClick={handleDismiss}
            className="font-bold underline hover:no-underline cursor-pointer"
          >
            Entendi, vou tentar!
          </button>
        </div>
      </div>
    </aside>
  );
}

interface HintStatusButtonProps {
  secondsLeft: number;
  showHint: boolean;
  onTriggerNow: () => void;
  settings: AccessibilitySettings;
}

export function HintStatusButton({
  secondsLeft,
  showHint,
  onTriggerNow,
  settings,
}: HintStatusButtonProps) {
  if (showHint) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all animate-pulse ${
          settings.highContrast
            ? 'bg-yellow-400 text-black'
            : 'bg-amber-400 text-amber-950 shadow-sm'
        }`}
      >
        <Lightbulb className="w-3.5 h-3.5 animate-bounce" aria-hidden="true" />
        <span>Dica Ativada!</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        playSound('click', settings.soundEffects);
        onTriggerNow();
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
        settings.highContrast
          ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
          : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 shadow-xs'
      }`}
      title="Precisa de ajuda? Clique para receber a dica agora mesmo ou espere 30 segundos!"
    >
      <Lightbulb className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
      <span>Pedir Dica {secondsLeft > 0 ? `(${secondsLeft}s)` : ''}</span>
    </button>
  );
}
