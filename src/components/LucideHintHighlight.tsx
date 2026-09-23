import { Sparkles, Lightbulb, ArrowDown, Hand, Check, Star, ShieldCheck } from 'lucide-react';
import { AccessibilitySettings } from '../types/game';

interface LucideHintHighlightProps {
  label?: string;
  iconType?: 'sparkles' | 'lightbulb' | 'arrow' | 'hand' | 'star' | 'shield';
  position?: 'top' | 'right' | 'badge' | 'pointer';
  settings: AccessibilitySettings;
}

export function LucideHintHighlight({
  label = 'Dica de Ouro!',
  iconType = 'lightbulb',
  position = 'badge',
  settings,
}: LucideHintHighlightProps) {
  const IconComponent =
    iconType === 'sparkles'
      ? Sparkles
      : iconType === 'arrow'
      ? ArrowDown
      : iconType === 'hand'
      ? Hand
      : iconType === 'star'
      ? Star
      : iconType === 'shield'
      ? ShieldCheck
      : Lightbulb;

  if (position === 'pointer') {
    return (
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center animate-bounce"
        aria-hidden="true"
      >
        <div
          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-md flex items-center gap-1 whitespace-nowrap ${
            settings.highContrast
              ? 'bg-yellow-400 text-black border-2 border-black'
              : 'bg-amber-400 text-amber-950 border border-amber-500 shadow-amber-500/30'
          }`}
        >
          <IconComponent className="w-3.5 h-3.5 animate-spin-slow" />
          <span>{label}</span>
        </div>
        <ArrowDown
          className={`w-5 h-5 -mt-1 ${
            settings.highContrast ? 'text-yellow-400 fill-yellow-400' : 'text-amber-500 fill-amber-500'
          }`}
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm animate-pulse ${
        settings.highContrast
          ? 'bg-yellow-400 text-black border border-black'
          : 'bg-amber-300/90 text-amber-950 border border-amber-400 shadow-amber-300/50'
      }`}
    >
      <IconComponent className="w-3.5 h-3.5 animate-bounce" aria-hidden="true" />
      <span>{label}</span>
      <Sparkles className="w-3 h-3 text-amber-600 animate-spin-slow" aria-hidden="true" />
    </span>
  );
}
