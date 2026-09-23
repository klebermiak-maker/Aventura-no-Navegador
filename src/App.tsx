import { useState, useMemo } from 'react';
import { PhaseId, AccessibilitySettings, PhaseScore } from './types/game';
import { Header } from './components/Header';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { Phase1Intro } from './components/Phase1Intro';
import { Phase2BrowserWindow } from './components/Phase2BrowserWindow';
import { Phase3IconClassifier } from './components/Phase3IconClassifier';
import { Phase4Keywords } from './components/Phase4Keywords';
import { Phase5Safety } from './components/Phase5Safety';
import { CertificateModal } from './components/CertificateModal';
import { CelebrationParticles } from './components/CelebrationParticles';
import { PHASES_CONFIG } from './data/gameData';
import { playSound } from './utils/audio';
import { Compass, Sparkles, Award, Star, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<PhaseId>(1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [celebration, setCelebration] = useState<{
    active: boolean;
    phaseNumber: number;
    phaseTitle: string;
    stars: number;
    points: number;
  } | null>(null);

  // Accessibility State
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    soundEffects: true,
    autoNarrate: false,
  });

  // Score tracking per phase
  const [scores, setScores] = useState<Record<number, PhaseScore>>({
    1: { phaseId: 1, points: 0, maxPoints: 100, completed: false, stars: 0 },
    2: { phaseId: 2, points: 0, maxPoints: 100, completed: false, stars: 0 },
    3: { phaseId: 3, points: 0, maxPoints: 100, completed: false, stars: 0 },
    4: { phaseId: 4, points: 0, maxPoints: 100, completed: false, stars: 0 },
    5: { phaseId: 5, points: 0, maxPoints: 100, completed: false, stars: 0 },
  });

  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((acc, s) => acc + s.points, 0);
  }, [scores]);

  const totalStars = useMemo(() => {
    return Object.values(scores).reduce((acc, s) => acc + s.stars, 0);
  }, [scores]);

  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...newSettings }));
  };

  const handlePhaseComplete = (phaseNum: number, points: number, stars: number) => {
    setScores((prev) => ({
      ...prev,
      [phaseNum]: {
        phaseId: phaseNum as PhaseId,
        points: Math.max(prev[phaseNum]?.points || 0, points),
        maxPoints: 100,
        completed: true,
        stars: Math.max(prev[phaseNum]?.stars || 0, stars),
      },
    }));

    const config = PHASES_CONFIG.find((p) => p.id === phaseNum);
    setCelebration({
      active: true,
      phaseNumber: phaseNum,
      phaseTitle: config ? `${config.title} · ${config.subtitle}` : `Fase ${phaseNum}`,
      stars,
      points,
    });
  };

  const handleNavigateNext = (fromPhase: PhaseId) => {
    const next = (fromPhase + 1) as PhaseId;
    if (next <= 5) {
      setCurrentPhase(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowCertificate(true);
    }
  };

  const handleResetAll = () => {
    playSound('click', accessibility.soundEffects);
    setScores({
      1: { phaseId: 1, points: 0, maxPoints: 100, completed: false, stars: 0 },
      2: { phaseId: 2, points: 0, maxPoints: 100, completed: false, stars: 0 },
      3: { phaseId: 3, points: 0, maxPoints: 100, completed: false, stars: 0 },
      4: { phaseId: 4, points: 0, maxPoints: 100, completed: false, stars: 0 },
      5: { phaseId: 5, points: 0, maxPoints: 100, completed: false, stars: 0 },
    });
    setCurrentPhase(1);
    setShowCertificate(false);
  };

  // Font size multiplier class
  const fontClass =
    accessibility.fontSize === 'extralarge'
      ? 'text-lg leading-relaxed'
      : accessibility.fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${fontClass} ${
        accessibility.highContrast
          ? 'bg-black text-yellow-300'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Accessibility Controls Toolbar */}
      <AccessibilityToolbar
        settings={accessibility}
        onUpdate={handleUpdateAccessibility}
      />

      {/* Primary Header */}
      <Header
        currentPhase={currentPhase}
        totalScore={totalScore}
        totalStars={totalStars}
        onSelectPhase={(phase) => {
          if (phase === 6) {
            setShowCertificate(true);
          } else {
            setCurrentPhase(phase);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenCertificate={() => setShowCertificate(true)}
        onResetGame={handleResetAll}
        settings={accessibility}
      />

      {/* Main Content Viewport */}
      <main className="grow max-w-6xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Phase Progress Tracker Roadmap */}
        <section aria-label="Progresso das Fases" className="hidden sm:block">
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              accessibility.highContrast
                ? 'bg-yellow-950/20 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Mapa da Aventura (3º Ano)</span>
              <span>
                {Object.values(scores).filter((s) => s.completed).length} de 5 Fases Concluídas
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PHASES_CONFIG.map((phase) => {
                const isCurrent = currentPhase === phase.id;
                const isDone = scores[phase.id]?.completed;

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => {
                      playSound('click', accessibility.soundEffects);
                      setCurrentPhase(phase.id as PhaseId);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? accessibility.highContrast
                          ? 'border-yellow-400 bg-yellow-400 text-black font-bold'
                          : 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-400'
                        : isDone
                        ? accessibility.highContrast
                          ? 'border-yellow-600 bg-yellow-950/40 text-yellow-300'
                          : 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                        : accessibility.highContrast
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs truncate">Fase {phase.id}</span>
                      {isDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <div className="text-xs truncate font-medium">{phase.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Phase Components */}
        {currentPhase === 1 && (
          <Phase1Intro
            onCompletePhase={(pts, stars) => handlePhaseComplete(1, pts, stars)}
            onNextPhase={() => handleNavigateNext(1)}
            settings={accessibility}
          />
        )}

        {currentPhase === 2 && (
          <Phase2BrowserWindow
            onCompletePhase={(pts, stars) => handlePhaseComplete(2, pts, stars)}
            onNextPhase={() => handleNavigateNext(2)}
            settings={accessibility}
          />
        )}

        {currentPhase === 3 && (
          <Phase3IconClassifier
            onCompletePhase={(pts, stars) => handlePhaseComplete(3, pts, stars)}
            onNextPhase={() => handleNavigateNext(3)}
            settings={accessibility}
          />
        )}

        {currentPhase === 4 && (
          <Phase4Keywords
            onCompletePhase={(pts, stars) => handlePhaseComplete(4, pts, stars)}
            onNextPhase={() => handleNavigateNext(4)}
            settings={accessibility}
          />
        )}

        {currentPhase === 5 && (
          <Phase5Safety
            onCompletePhase={(pts, stars) => handlePhaseComplete(5, pts, stars)}
            onOpenCertificate={() => setShowCertificate(true)}
            settings={accessibility}
          />
        )}
      </main>

      {/* Festive Confetti & Particles Celebration (framer-motion) */}
      {celebration && celebration.active && (
        <CelebrationParticles
          isActive={celebration.active}
          phaseNumber={celebration.phaseNumber}
          phaseTitle={celebration.phaseTitle}
          stars={celebration.stars}
          points={celebration.points}
          onClose={() => {
            setCelebration(null);
            if (celebration.phaseNumber === 5) {
              setShowCertificate(true);
            }
          }}
          onNextPhase={() => {
            const nextPhaseNum = (celebration.phaseNumber + 1) as PhaseId;
            setCelebration(null);
            if (nextPhaseNum <= 5) {
              setCurrentPhase(nextPhaseNum);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setShowCertificate(true);
            }
          }}
          settings={accessibility}
        />
      )}

      {/* Diploma Modal */}
      {showCertificate && (
        <CertificateModal
          totalScore={totalScore}
          totalStars={totalStars}
          onClose={() => setShowCertificate(false)}
          onRestartAll={handleResetAll}
          settings={accessibility}
        />
      )}

      {/* Educational Footer */}
      <footer
        className={`border-t mt-12 py-8 transition-colors ${
          accessibility.highContrast
            ? 'bg-black text-yellow-300 border-yellow-500'
            : 'bg-white text-slate-600 border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            <span className="font-bold text-slate-800 dark:text-yellow-300">
              Aventura no Navegador · Letramento Digital para o 3º Ano
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-yellow-400">
            <span>BNCC Computação</span>
            <span aria-hidden="true">·</span>
            <span>Segurança na Web</span>
            <span aria-hidden="true">·</span>
            <span>Interface Acessível</span>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs text-indigo-600 hover:underline cursor-pointer"
          >
            Reiniciar pontuação
          </button>
        </div>
      </footer>
    </div>
  );
}
