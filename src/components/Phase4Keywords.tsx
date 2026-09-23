import { useState } from 'react';
import { PHASE4_SCENARIOS, KeywordScenario } from '../data/gameData';
import { AccessibilitySettings } from '../types/game';
import { AudioNarratorButton } from './AudioNarratorButton';
import {
  Key,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
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
  onNextPhase: () => void;
  settings: AccessibilitySettings;
}

export function Phase4Keywords({ onCompletePhase, onNextPhase, settings }: Props) {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [phaseDone, setPhaseDone] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const [customSearchInput, setCustomSearchInput] = useState('');

  const scenario = PHASE4_SCENARIOS[currentScenarioIdx];
  const selectedOption = scenario.options.find((o) => o.id === selectedOptionId);
  const bestOption = scenario.options.find((o) => o.isBest);

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

  const handleSelectOption = (optionId: string, isBest: boolean) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optionId);

    if (isBest) {
      playSound('correct', settings.soundEffects);
      setPoints((prev) => prev + 35);
      setShowLiveSearch(true);
    } else {
      playSound('wrong', settings.soundEffects);
      setShowLiveSearch(true);
    }
  };

  const handleAdvanceScenario = () => {
    playSound('click', settings.soundEffects);
    setSelectedOptionId(null);
    setShowLiveSearch(false);
    setCustomSearchInput('');

    if (currentScenarioIdx + 1 < PHASE4_SCENARIOS.length) {
      setCurrentScenarioIdx((prev) => prev + 1);
    } else {
      setPhaseDone(true);
      playSound('star', settings.soundEffects);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      onCompletePhase(100, 3);
    }
  };

  const handleResetPhase = () => {
    playSound('click', settings.soundEffects);
    setCurrentScenarioIdx(0);
    setSelectedOptionId(null);
    setShowLiveSearch(false);
    setPoints(0);
    setPhaseDone(false);
  };

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
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 flex items-center gap-1.5">
              <Key className="w-4 h-4" aria-hidden="true" />
              <span>Fase 4 · O Segredo das Buscas</span>
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              O Detetive das Palavras-Chave 🔍
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Quando pesquisamos na internet, não precisamos conversar como se o computador fosse uma pessoa!
              Os robôs de busca encontram respostas muito mais rápido quando usamos as <strong>palavras-chave</strong> certas!
            </p>

            {/* Keyword comparison tip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div
                className={`p-3 rounded-xl border ${
                  settings.highContrast
                    ? 'border-red-400 bg-red-950/20 text-red-200'
                    : 'border-rose-200 bg-rose-50/70 text-rose-950'
                }`}
              >
                <div className="font-bold mb-1">❌ Evite Frases Longas:</div>
                <p className="italic">"Oi senhor google por favor me fale se gato dorme muito de dia"</p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  settings.highContrast
                    ? 'border-yellow-400 bg-yellow-950/20 text-yellow-300'
                    : 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                }`}
              >
                <div className="font-bold mb-1">✅ Use Palavras-Chave Diretas:</div>
                <p className="font-semibold">"gatos hábitos sono horas"</p>
              </div>
            </div>

            <div>
              <AudioNarratorButton
                text="Detetive das Palavras-Chave! Descubra as palavras certas que fazem o computador achar exatamente o que você procura na internet, sem frases compridas e sem palavras vagas."
                label="Ouvir Dica do Detetive"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100 shadow-inner">
              <img
                src="/src/assets/images/keyword_detective_kids_1790178305372.jpg"
                alt="Detetive mirim com lupa descobrindo palavras-chave na tela digital"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scenario Challenge */}
      {!phaseDone ? (
        <section
          aria-labelledby="scenario-goal-heading"
          className={`rounded-2xl border p-6 md:p-8 space-y-6 transition-all ${
            settings.highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-200 shadow-sm'
          }`}
        >
          {/* Header of Scenario */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-sm">
                {currentScenarioIdx + 1}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                Missão {currentScenarioIdx + 1} de {PHASE4_SCENARIOS.length}
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
                text={`Missão: ${scenario.goal}. Qual pesquisa é a melhor opção?`}
                label="Ouvir Missão"
                size="sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-violet-600">
              Objetivo da Pesquisa:
            </span>
            <h2 id="scenario-goal-heading" className="text-xl md:text-2xl font-bold tracking-tight">
              🎯 "{scenario.goal}"
            </h2>
            <p className="text-sm text-slate-600">
              Qual das opções abaixo é a busca mais esperta para digitar no navegador?
            </p>
          </div>

          {/* Animated Hint Banner (Triggered after 30s or manually) */}
          {showHint && selectedOptionId === null && (
            <AnimatedHintBanner
              hintText={`Dica do Detetive: Para pesquisar sobre "${scenario.topic}", use palavras-chave diretas e essenciais como "${bestOption?.text}". Evite saudações ("por favor", "oi computador") ou termos genéricos demais!`}
              narratorText={`Dica do Detetive: Escolha a pesquisa que usa palavras-chave diretas e objetivas, sem frases compridas.`}
              secondsElapsed={30 - secondsLeft}
              isTimeoutReached={isTimeoutReached}
              onDismiss={dismissHint}
              settings={settings}
              targetElementName="Palavras-chave essenciais"
            />
          )}

          {/* Search Queries Options */}
          <div className="space-y-3" role="radiogroup" aria-label="Opções de palavras-chave">
            {scenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;
              const isHintTarget = showHint && selectedOptionId === null && opt.isBest;

              let btnStyle = settings.highContrast
                ? 'border-yellow-400 bg-yellow-950/20 text-yellow-300 hover:bg-yellow-900/40'
                : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-violet-300 hover:bg-violet-50/40';

              if (isHintTarget) {
                btnStyle = settings.highContrast
                  ? 'border-yellow-300 ring-4 ring-yellow-400 bg-yellow-950/90 text-yellow-100 shadow-md'
                  : 'border-amber-400 ring-4 ring-amber-300 bg-amber-50/90 text-amber-950 shadow-md';
              }

              if (hasAnswered) {
                if (opt.isBest) {
                  btnStyle = settings.highContrast
                    ? 'border-yellow-300 bg-yellow-400 text-black font-bold'
                    : 'border-emerald-400 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300';
                } else if (isSelected && !opt.isBest) {
                  btnStyle = settings.highContrast
                    ? 'border-red-400 bg-red-950 text-red-200'
                    : 'border-rose-400 bg-rose-50 text-rose-950';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id, opt.isBest)}
                  disabled={hasAnswered}
                  className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all cursor-pointer text-left flex items-start gap-4 min-h-[60px] focus-visible:ring-4 focus-visible:ring-violet-300 ${btnStyle}`}
                >
                  <Search className={`w-5 h-5 mt-1 shrink-0 ${isHintTarget ? 'text-amber-500' : 'text-slate-400'}`} aria-hidden="true" />
                  <div className="grow space-y-1">
                    <div className="font-mono text-base md:text-lg font-bold">
                      "{opt.text}"
                    </div>
                    {hasAnswered && (
                      <div className="text-xs font-bold uppercase tracking-wider opacity-85">
                        Classificação: {opt.rating}
                      </div>
                    )}
                  </div>

                  {isHintTarget && (
                    <div className="shrink-0 self-center">
                      <LucideHintHighlight
                        label="Dica: Busca ideal!"
                        iconType="lightbulb"
                        settings={settings}
                      />
                    </div>
                  )}

                  {hasAnswered && opt.isBest && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
                  )}
                  {hasAnswered && isSelected && !opt.isBest && (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Live Search Results Simulation */}
          {selectedOption && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-4 animate-in fade-in duration-200 ${
                selectedOption.isBest
                  ? settings.highContrast
                    ? 'border-yellow-400 bg-yellow-950/40 text-yellow-300'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : settings.highContrast
                    ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                    : 'border-amber-200 bg-amber-50 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {selectedOption.isBest ? 'Detetive Nota 10! ⭐' : 'Dica do Detetive:'}
                  </span>
                </div>
                <AudioNarratorButton text={selectedOption.feedback} label="Ouvir Análise" size="sm" />
              </div>

              <p className="text-base leading-relaxed">{selectedOption.feedback}</p>

              {/* Simulated Live Search Engine Results */}
              {selectedOption.isBest && (
                <div className="mt-4 p-4 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1.5 text-indigo-600">
                      <Search className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Resultados da SuperBusca Escolar</span>
                    </span>
                    <span>Cerca de 2 resultados encontrados</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {scenario.simulatedResults.map((res, rIdx) => (
                      <div key={rIdx} className="space-y-1">
                        <div className="text-xs text-emerald-700 font-mono truncate">{res.url}</div>
                        <h4 className="text-base font-bold text-indigo-700 hover:underline cursor-pointer flex items-center gap-1.5">
                          <span>{res.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                          {res.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAdvanceScenario}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer focus-visible:ring-4"
                >
                  <span>
                    {currentScenarioIdx + 1 < PHASE4_SCENARIOS.length
                      ? 'Próxima Missão de Busca'
                      : 'Ver Conclusão da Fase!'}
                  </span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Phase Completed Card */
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
            <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 flex items-center justify-center text-violet-600 shadow-inner">
              <Sparkles className="w-10 h-10 animate-bounce" aria-hidden="true" />
            </div>
            <InlineFloatingStars settings={settings} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Você é um Super Detetive da Busca! 🔎
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto">
              Agora você sabe pesquisar como um profissional, usando palavras-chave certeiras e economizando tempo.
              Você conquistou a insígnia <strong>Super Detetive da Busca</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleResetPhase}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-sm cursor-pointer"
            >
              Jogar Novamente
            </button>
            <button
              type="button"
              onClick={onNextPhase}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Ir para a Fase 5: Guardiões da Internet (Segurança)</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
