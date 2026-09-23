import { useState } from 'react';
import { PHASE3_ICONS, IconMatchItem } from '../data/gameData';
import { AccessibilitySettings } from '../types/game';
import { AudioNarratorButton } from './AudioNarratorButton';
import { Sparkles, CheckCircle2, RefreshCw, ArrowRight, Layers, HelpCircle, Lightbulb } from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useInactivityHint } from '../hooks/useInactivityHint';
import { AnimatedHintBanner, HintStatusButton } from './AnimatedHintBanner';
import { LucideHintHighlight } from './LucideHintHighlight';
import { InlineFloatingStars } from './CelebrationParticles';

interface Props {
  onCompletePhase: (points: number, stars: number) => void;
  onNextPhase: () => void;
  settings: AccessibilitySettings;
}

export function Phase3IconClassifier({ onCompletePhase, onNextPhase, settings }: Props) {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [lastMatchFeedback, setLastMatchFeedback] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [phaseDone, setPhaseDone] = useState(false);

  // Inactivity hint hook (resets whenever a new match is achieved)
  const {
    showHint,
    secondsLeft,
    isTimeoutReached,
    triggerHintNow,
    dismissHint,
  } = useInactivityHint({
    stepKey: matchedIds.length,
    isCompleted: phaseDone || matchedIds.length === PHASE3_ICONS.length,
    timeoutSeconds: 30,
    soundEnabled: settings.soundEffects,
  });

  const nextUnmatched = PHASE3_ICONS.find((i) => !matchedIds.includes(i.id));

  // Shuffle order of actions for an engaging game
  const [shuffledActions] = useState(() => {
    return [...PHASE3_ICONS].sort(() => Math.random() - 0.5);
  });

  const handleSelectIcon = (id: string) => {
    if (matchedIds.includes(id)) return;
    playSound('click', settings.soundEffects);
    setSelectedIconId(id);

    // If an action was already selected, check match
    if (selectedActionId) {
      checkMatch(id, selectedActionId);
    }
  };

  const handleSelectAction = (id: string) => {
    if (matchedIds.includes(id)) return;
    playSound('click', settings.soundEffects);
    setSelectedActionId(id);

    // If an icon was already selected, check match
    if (selectedIconId) {
      checkMatch(selectedIconId, id);
    }
  };

  const checkMatch = (iconId: string, actionId: string) => {
    if (iconId === actionId) {
      // MATCH!
      playSound('correct', settings.soundEffects);
      const iconItem = PHASE3_ICONS.find((i) => i.id === iconId);
      const newMatched = [...matchedIds, iconId];
      setMatchedIds(newMatched);
      setSelectedIconId(null);
      setSelectedActionId(null);
      setLastMatchFeedback({
        success: true,
        text: `Excelente! ${iconItem?.name} serve para: ${iconItem?.actionDescription}`,
      });

      if (newMatched.length === PHASE3_ICONS.length) {
        // All matched!
        setPhaseDone(true);
        playSound('star', settings.soundEffects);
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        onCompletePhase(100, 3);
      }
    } else {
      // MISMATCH
      playSound('wrong', settings.soundEffects);
      setLastMatchFeedback({
        success: false,
        text: 'Ainda não é esse par! Tente ligar o símbolo à sua função real.',
      });
      setTimeout(() => {
        setSelectedIconId(null);
        setSelectedActionId(null);
      }, 700);
    }
  };

  const handleResetPhase = () => {
    playSound('click', settings.soundEffects);
    setSelectedIconId(null);
    setSelectedActionId(null);
    setMatchedIds([]);
    setLastMatchFeedback(null);
    setPhaseDone(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section
        className={`rounded-2xl border p-6 transition-all ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-800 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Fase 3 · Jogo de Associação</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Classificador de Ícones e Superpoderes
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Clique em um <strong>ícone à esquerda</strong> e depois na <strong>função correspondente à direita</strong>{' '}
              para formar os pares corretos!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-500">
              Pares: {matchedIds.length} de {PHASE3_ICONS.length}
            </span>
            <HintStatusButton
              secondsLeft={secondsLeft}
              showHint={showHint}
              onTriggerNow={triggerHintNow}
              settings={settings}
            />
            <AudioNarratorButton
              text="Clique em um ícone da esquerda e depois encontre a frase certa na coluna da direita para ligar cada botão ao seu superpoder!"
              label="Ouvir Regras"
            />
          </div>
        </div>
      </section>

      {/* Animated Hint Banner (After 30s of inactivity or requested) */}
      {showHint && nextUnmatched && !phaseDone && (
        <AnimatedHintBanner
          hintText={`Dica Amiga: Procure o ícone "${nextUnmatched.name}" (${nextUnmatched.iconChar}) na esquerda e ligue com o superpoder na direita: "${nextUnmatched.actionDescription}"!`}
          narratorText={`Dica do Mascote: O ícone ${nextUnmatched.name} serve para: ${nextUnmatched.actionDescription}`}
          secondsElapsed={30 - secondsLeft}
          isTimeoutReached={isTimeoutReached}
          onDismiss={dismissHint}
          settings={settings}
          targetElementName={`${nextUnmatched.name} (${nextUnmatched.iconChar})`}
        />
      )}

      {/* Live Feedback Bar */}
      {lastMatchFeedback && (
        <aside
          aria-live="polite"
          className={`p-4 rounded-xl border-2 flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            lastMatchFeedback.success
              ? settings.highContrast
                ? 'bg-yellow-950/40 border-yellow-400 text-yellow-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : settings.highContrast
                ? 'bg-red-950/40 border-red-400 text-red-200'
                : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {lastMatchFeedback.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm md:text-base font-semibold">{lastMatchFeedback.text}</span>
          </div>

          <AudioNarratorButton text={lastMatchFeedback.text} label="Ouvir" size="sm" />
        </aside>
      )}

      {/* Two Column Matching Board */}
      {!phaseDone ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Icons */}
          <div className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>1. Escolha o Ícone:</span>
            </h2>

            <div className="space-y-2.5">
              {PHASE3_ICONS.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedIconId === item.id;
                const isHintTarget = showHint && nextUnmatched?.id === item.id && !isMatched;

                let stateClasses = settings.highContrast
                  ? 'border-yellow-400 bg-yellow-950/20 text-yellow-300 hover:bg-yellow-900/40'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50/40';

                if (isHintTarget) {
                  stateClasses = settings.highContrast
                    ? 'border-yellow-300 ring-4 ring-yellow-400 bg-yellow-950/90 text-yellow-100 shadow-md'
                    : 'border-amber-400 ring-4 ring-amber-300 bg-amber-50/90 text-amber-950 shadow-md';
                }

                if (isMatched) {
                  stateClasses = settings.highContrast
                    ? 'border-yellow-300 bg-yellow-400 text-black font-bold opacity-75'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-900 opacity-80';
                } else if (isSelected) {
                  stateClasses = settings.highContrast
                    ? 'border-yellow-400 ring-4 ring-yellow-300 bg-yellow-950/80 text-yellow-200'
                    : 'border-amber-500 ring-4 ring-amber-300 bg-amber-50 text-amber-950 scale-102';
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectIcon(item.id)}
                    disabled={isMatched}
                    className={`w-full p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left min-h-[58px] focus-visible:ring-4 focus-visible:ring-amber-300 ${stateClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl" aria-hidden="true">
                        {item.iconChar}
                      </span>
                      <div>
                        <div className="font-bold text-base">{item.name}</div>
                        <div className="text-xs text-slate-500">Categoria: {item.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isHintTarget && (
                        <LucideHintHighlight
                          label="Dica: Escolha este!"
                          iconType="lightbulb"
                          settings={settings}
                        />
                      )}
                      {isMatched && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Actions / Superpowers */}
          <div className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>2. Escolha o Superpoder correspondente:</span>
            </h2>

            <div className="space-y-2.5">
              {shuffledActions.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedActionId === item.id;
                const isHintTarget = showHint && nextUnmatched?.id === item.id && !isMatched;

                let stateClasses = settings.highContrast
                  ? 'border-yellow-400 bg-yellow-950/20 text-yellow-300 hover:bg-yellow-900/40'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50/40';

                if (isHintTarget) {
                  stateClasses = settings.highContrast
                    ? 'border-yellow-300 ring-4 ring-yellow-400 bg-yellow-950/90 text-yellow-100 shadow-md'
                    : 'border-amber-400 ring-4 ring-amber-300 bg-amber-50/90 text-amber-950 shadow-md';
                }

                if (isMatched) {
                  stateClasses = settings.highContrast
                    ? 'border-yellow-300 bg-yellow-400 text-black font-bold opacity-75'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-900 opacity-80';
                } else if (isSelected) {
                  stateClasses = settings.highContrast
                    ? 'border-yellow-400 ring-4 ring-yellow-300 bg-yellow-950/80 text-yellow-200'
                    : 'border-amber-500 ring-4 ring-amber-300 bg-amber-50 text-amber-950 scale-102';
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectAction(item.id)}
                    disabled={isMatched}
                    className={`w-full p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left min-h-[58px] focus-visible:ring-4 focus-visible:ring-amber-300 ${stateClasses}`}
                  >
                    <div className="space-y-0.5 grow">
                      <p className="font-semibold text-sm md:text-base leading-snug">
                        {item.actionDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isHintTarget && (
                        <LucideHintHighlight
                          label="Dica: Ligue aqui!"
                          iconType="sparkles"
                          settings={settings}
                        />
                      )}
                      {isMatched && (
                        <span className="text-xl shrink-0" aria-hidden="true">
                          {item.iconChar}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Completed Celebration */
        <motion.section
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          className={`rounded-2xl border p-8 text-center space-y-6 relative overflow-hidden ${
            settings.highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-800 border-slate-200 shadow-md'
          }`}
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
              <Sparkles className="w-10 h-10 animate-bounce" aria-hidden="true" />
            </div>
            <InlineFloatingStars settings={settings} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Todos os Ícones Decifrados com Sucesso! 🏆
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto">
              Você sabe exatamente o que cada símbolo significa no navegador. Você conquistou a insígnia de{' '}
              <strong>Decifrador de Ícones</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleResetPhase}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-sm cursor-pointer"
            >
              Jogar Esta Fase de Novo
            </button>
            <button
              type="button"
              onClick={onNextPhase}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Ir para a Fase 4: O Detetive das Palavras-Chave</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
