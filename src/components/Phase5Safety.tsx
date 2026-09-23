import { useState } from 'react';
import { PHASE5_SCENARIOS, SafetyScenario } from '../data/gameData';
import { AccessibilitySettings } from '../types/game';
import { AudioNarratorButton } from './AudioNarratorButton';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useInactivityHint } from '../hooks/useInactivityHint';
import { AnimatedHintBanner, HintStatusButton } from './AnimatedHintBanner';
import { LucideHintHighlight } from './LucideHintHighlight';
import { InlineFloatingStars } from './CelebrationParticles';

interface Props {
  onCompletePhase: (points: number, stars: number) => void;
  onOpenCertificate: () => void;
  settings: AccessibilitySettings;
}

export function Phase5Safety({ onCompletePhase, onOpenCertificate, settings }: Props) {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [phaseDone, setPhaseDone] = useState(false);

  const scenario = PHASE5_SCENARIOS[currentScenarioIdx];
  const selectedOption = scenario.options.find((o) => o.id === selectedOptionId);
  const safeOption = scenario.options.find((o) => o.isSafe);

  const {
    showHint,
    secondsLeft,
    isTimeoutReached,
    triggerHintNow,
    dismissHint,
  } = useInactivityHint({
    stepKey: currentScenarioIdx,
    isCompleted: selectedOptionId !== null || phaseDone,
    timeoutSeconds: 30,
    soundEnabled: settings.soundEffects,
  });

  const handleSelectOption = (optionId: string, isSafe: boolean) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optionId);

    if (isSafe) {
      playSound('correct', settings.soundEffects);
      setPoints((prev) => prev + 20);
    } else {
      playSound('wrong', settings.soundEffects);
    }
  };

  const handleAdvance = () => {
    playSound('click', settings.soundEffects);
    setSelectedOptionId(null);

    if (currentScenarioIdx + 1 < PHASE5_SCENARIOS.length) {
      setCurrentScenarioIdx((prev) => prev + 1);
    } else {
      setPhaseDone(true);
      playSound('victory', settings.soundEffects);
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      onCompletePhase(100, 3);
    }
  };

  const handleRestartPhase = () => {
    playSound('click', settings.soundEffects);
    setCurrentScenarioIdx(0);
    setSelectedOptionId(null);
    setPoints(0);
    setPhaseDone(false);
  };

  // Calculate shield power percentage
  const shieldPercent = Math.round(((currentScenarioIdx + (selectedOption?.isSafe ? 1 : 0)) / PHASE5_SCENARIOS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <section
        className={`rounded-2xl border p-6 transition-all ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-800 border-slate-200 shadow-sm'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Fase 5 · O Super Escudo da Internet</span>
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Guardiões da Internet e Segurança Digital 🛡️
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A internet é maravilhosa para aprender e brincar, mas precisamos de superpoderes de proteção!
              Aprenda a proteger seus dados secretos, desviar de armadilhas e navegar com tranquilidade.
            </p>

            {/* 3 Golden Safety Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs md:text-sm">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-950 flex flex-col justify-between">
                <span className="font-bold flex items-center gap-1">
                  <Lock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Senhas Secretas</span>
                </span>
                <span className="text-xs text-slate-600 mt-1">
                  São como escova de dentes: só sua e da sua família!
                </span>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 flex flex-col justify-between">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Prêmios Falsos</span>
                </span>
                <span className="text-xs text-slate-600 mt-1">
                  Se diz que você ganhou sem fazer nada, é golpe!
                </span>
              </div>

              <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-950 flex flex-col justify-between">
                <span className="font-bold flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  <span>Adultos Amigos</span>
                </span>
                <span className="text-xs text-slate-600 mt-1">
                  Viu algo estranho? Chame os pais ou professores na hora!
                </span>
              </div>
            </div>

            <div>
              <AudioNarratorButton
                text="Guardiões da Internet! Vamos aprender a proteger nossos dados pessoais, reconhecer armadilhas e navegar com total segurança."
                label="Ouvir Instruções"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100 shadow-inner">
              <img
                src="/src/assets/images/digital_safety_shield_1790178315802.jpg"
                alt="Escudo de segurança digital protegendo crianças na internet"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Shield Progress Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-800 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" aria-hidden="true" />
          <span className="font-bold text-sm">Escudo de Proteção: {shieldPercent}%</span>
        </div>

        <div className="w-full sm:w-64 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${shieldPercent}%` }}
          />
        </div>
      </div>

      {/* Scenario Challenge */}
      {!phaseDone ? (
        <section
          aria-labelledby="scenario-title"
          className={`rounded-2xl border p-6 md:p-8 space-y-6 transition-all ${
            settings.highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-200 shadow-sm'
          }`}
        >
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm">
                {currentScenarioIdx + 1}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                Situação {currentScenarioIdx + 1} de {PHASE5_SCENARIOS.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <HintStatusButton
                secondsLeft={secondsLeft}
                showHint={showHint}
                onTriggerNow={triggerHintNow}
                settings={settings}
              />
              <AudioNarratorButton
                text={`${scenario.title}. ${scenario.situation}. O que você faz?`}
                label="Ouvir Situação"
                size="sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
                Situação Real:
              </span>
              <h2 id="scenario-title" className="text-xl md:text-2xl font-bold">
                {scenario.title}
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-base md:text-lg leading-relaxed">
              "{scenario.situation}"
            </div>
          </div>

          {/* Animated Hint Banner (Triggered after 30s or on demand) */}
          {showHint && selectedOptionId === null && (
            <AnimatedHintBanner
              hintText={`Dica de Proteção Digital: Lembre-se: senhas, fotos íntimas e dados da sua família nunca devem ser passados na internet. Diante de qualquer dúvida ou aviso suspeito, sempre avise um adulto de confiança! A melhor atitude aqui é: "${safeOption?.action}".`}
              narratorText={`Dica de Segurança: Em situações como essa, sempre avise um adulto responsável e nunca compartilhe informações secretas.`}
              secondsElapsed={30 - secondsLeft}
              isTimeoutReached={isTimeoutReached}
              onDismiss={dismissHint}
              settings={settings}
              targetElementName="Atitude Segura"
            />
          )}

          {/* Action Options (Large touch friendly buttons) */}
          <div className="space-y-3" role="radiogroup" aria-label="Opções de atitude">
            {scenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;
              const isHintTarget = showHint && selectedOptionId === null && opt.isSafe;

              let btnStyle = settings.highContrast
                ? 'border-yellow-400 bg-yellow-950/20 text-yellow-300 hover:bg-yellow-900/40'
                : 'border-slate-200 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50/40';

              if (isHintTarget) {
                btnStyle = settings.highContrast
                  ? 'border-yellow-300 ring-4 ring-yellow-400 bg-yellow-950/90 text-yellow-100 shadow-md'
                  : 'border-amber-400 ring-4 ring-amber-300 bg-amber-50/90 text-amber-950 shadow-md';
              }

              if (hasAnswered) {
                if (opt.isSafe) {
                  btnStyle = settings.highContrast
                    ? 'border-yellow-300 bg-yellow-400 text-black font-bold'
                    : 'border-emerald-400 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300';
                } else if (isSelected && !opt.isSafe) {
                  btnStyle = settings.highContrast
                    ? 'border-red-400 bg-red-950 text-red-200'
                    : 'border-rose-400 bg-rose-50 text-rose-950';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id, opt.isSafe)}
                  disabled={hasAnswered}
                  className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all cursor-pointer text-left flex items-start gap-4 min-h-[64px] focus-visible:ring-4 focus-visible:ring-rose-300 ${btnStyle}`}
                >
                  <span className="mt-1 shrink-0">
                    {hasAnswered && opt.isSafe ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                    ) : hasAnswered && isSelected && !opt.isSafe ? (
                      <ShieldAlert className="w-6 h-6 text-rose-600" aria-hidden="true" />
                    ) : isHintTarget ? (
                      <ShieldCheck className="w-6 h-6 text-amber-600 animate-bounce" aria-hidden="true" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-slate-400" aria-hidden="true" />
                    )}
                  </span>
                  <span className="grow font-medium text-base md:text-lg leading-snug">
                    {opt.action}
                  </span>
                  {isHintTarget && (
                    <div className="shrink-0 self-center">
                      <LucideHintHighlight
                        label="Dica: Escolha Segura!"
                        iconType="shield"
                        settings={settings}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedOption && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-3 animate-in fade-in duration-200 ${
                selectedOption.isSafe
                  ? settings.highContrast
                    ? 'border-yellow-400 bg-yellow-950/40 text-yellow-300'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : settings.highContrast
                    ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                    : 'border-rose-200 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {selectedOption.isSafe
                      ? 'Atitude de Guardião Nota 10! 🛡️'
                      : 'Atenção, Guardião!'}
                  </span>
                </div>
                <AudioNarratorButton text={selectedOption.explanation} label="Ouvir Explicação" size="sm" />
              </div>

              <p className="text-base leading-relaxed">{selectedOption.explanation}</p>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer focus-visible:ring-4"
                >
                  <span>
                    {currentScenarioIdx + 1 < PHASE5_SCENARIOS.length
                      ? 'Próxima Situação de Segurança'
                      : 'Finalizar e Ver Meu Diploma!'}
                  </span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Phase 5 Completed */
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
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
              <Sparkles className="w-10 h-10 animate-bounce" aria-hidden="true" />
            </div>
            <InlineFloatingStars settings={settings} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Você é um Guardião Oficial da Internet! 🛡️
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto">
              Parabéns! Você completou todas as 5 fases da Aventura no Navegador com louvor.
              Você conquistou a insígnia máxima: <strong>Guardião Digital 5 Estrelas</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleRestartPhase}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-sm cursor-pointer"
            >
              Revisar Regras de Segurança
            </button>
            <button
              type="button"
              onClick={onOpenCertificate}
              className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-lg shadow-lg inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>🎓 Ver Meu Diploma Oficial</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
