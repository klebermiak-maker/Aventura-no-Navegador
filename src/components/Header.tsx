import { PhaseId, AccessibilitySettings } from '../types/game';
import { Star, Award, Compass, RotateCcw } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  currentPhase: PhaseId;
  totalScore: number;
  totalStars: number;
  onSelectPhase: (phase: PhaseId) => void;
  onOpenCertificate: () => void;
  onResetGame: () => void;
  settings: AccessibilitySettings;
}

export function Header({
  currentPhase,
  totalScore,
  totalStars,
  onSelectPhase,
  onOpenCertificate,
  onResetGame,
  settings,
}: Props) {
  const phases: { id: PhaseId; label: string }[] = [
    { id: 1, label: '1. O Navegador' },
    { id: 2, label: '2. As Peças' },
    { id: 3, label: '3. Ícones' },
    { id: 4, label: '4. Palavras-Chave' },
    { id: 5, label: '5. Segurança' },
    { id: 6, label: 'Diploma' },
  ];

  const handlePhaseClick = (id: PhaseId) => {
    playSound('navigate', settings.soundEffects);
    onSelectPhase(id);
  };

  return (
    <header
      className={`border-b sticky top-0 z-30 transition-colors ${
        settings.highContrast
          ? 'bg-black text-yellow-300 border-yellow-500'
          : 'bg-white/95 backdrop-blur-md text-slate-900 border-slate-200 shadow-xs'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handlePhaseClick(1)}
          className="text-left group cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2 font-['Fredoka']">
            <Compass className="w-7 h-7 text-indigo-600 animate-spin-slow" aria-hidden="true" />
            <span>Aventura no Navegador</span>
          </span>
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav
          aria-label="Fases da aventura"
          className="hidden lg:flex items-center gap-1.5 text-sm font-medium"
        >
          {phases.map((p) => {
            const isActive = currentPhase === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePhaseClick(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-xs md:text-sm font-semibold focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? settings.highContrast
                      ? 'bg-yellow-400 text-black shadow-xs font-bold'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : settings.highContrast
                      ? 'text-yellow-300 hover:bg-yellow-950/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action / Score badges */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Score & Stars */}
          <div
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border text-xs md:text-sm font-semibold ${
              settings.highContrast
                ? 'border-yellow-400 bg-yellow-950/40 text-yellow-300'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" aria-hidden="true" />
              <span className="tabular-nums">{totalStars}</span>
            </div>
            <span aria-hidden="true" className="opacity-40">·</span>
            <div className="tabular-nums">
              <span>{totalScore} pts</span>
            </div>
          </div>

          {/* Certificate Button */}
          <button
            type="button"
            onClick={onOpenCertificate}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 ${
              settings.highContrast
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-bold focus-visible:ring-yellow-300'
                : 'bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400 active:scale-95'
            }`}
          >
            <Award className="w-4 h-4" aria-hidden="true" />
            <span className="whitespace-nowrap hidden sm:inline">Ver Diploma</span>
          </button>
        </div>
      </div>
    </header>
  );
}
