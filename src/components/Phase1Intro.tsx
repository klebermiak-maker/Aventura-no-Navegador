import { useState } from 'react';
import { PHASE1_ITEMS } from '../data/gameData';
import { AccessibilitySettings } from '../types/game';
import { AudioNarratorButton } from './AudioNarratorButton';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Globe, Monitor, HelpCircle } from 'lucide-react';
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

const PHASE1_HINTS: Record<number, { text: string; narrator: string; targetHint: string }> = {
  0: {
    text: 'Dica do Mascote: O navegador é o aplicativo que abre as janelas para a internet, como o Google Chrome ou Firefox! Ele não é videogame nem o computador físico.',
    narrator: 'Dica do Mascote: O navegador é o programa que abre a janela para a gente entrar e visitar todos os sites da internet.',
    targetHint: 'Programa que abre janelas para a internet',
  },
  1: {
    text: 'Dica do Mascote: Pense no navegador como o veículo (o carro) e os sites como os destinos que visitamos (como o YouTube ou a Wikipédia)!',
    narrator: 'Dica do Mascote: O navegador é o veículo e o site é o lugar que visitamos.',
    targetHint: 'Navegador é o veículo e o site é o lugar',
  },
  2: {
    text: 'Dica do Mascote: Procure o nome do Google Chrome, Mozilla Firefox ou Microsoft Edge. A calculadora faz contas e o Paint faz desenhos!',
    narrator: 'Dica do Mascote: Google Chrome, Firefox e Edge são exemplos de navegadores de verdade.',
    targetHint: 'Google Chrome / Firefox / Edge',
  },
  3: {
    text: 'Dica do Mascote: Para navegar pelo mundo e abrir páginas, o computador precisa estar conectado à Internet (pelo Wi-Fi ou cabo de rede)!',
    narrator: 'Dica do Mascote: O que o navegador precisa para abrir sites é estar conectado à Internet.',
    targetHint: 'Estar conectado à Internet',
  },
};

export function Phase1Intro({ onCompletePhase, onNextPhase, settings }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [phaseDone, setPhaseDone] = useState(false);

  const currentItem = PHASE1_ITEMS[currentIndex];

  const { showHint, secondsLeft, isTimeoutReached, triggerHintNow, dismissHint } = useInactivityHint({
    stepKey: currentIndex,
    isCompleted: selectedOption !== null || phaseDone,
    timeoutSeconds: 30,
    soundEnabled: settings.soundEffects,
  });

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (selectedOption !== null) return; // already answered

    setSelectedOption(optionId);
    setAnsweredCorrectly(isCorrect);

    if (isCorrect) {
      playSound('correct', settings.soundEffects);
      setPoints((prev) => prev + 25);
    } else {
      playSound('wrong', settings.soundEffects);
    }
  };

  const handleNextQuestion = () => {
    playSound('click', settings.soundEffects);
    setSelectedOption(null);
    setAnsweredCorrectly(null);

    if (currentIndex + 1 < PHASE1_ITEMS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed phase
      const finalPoints = points + (answeredCorrectly ? 25 : 0);
      const stars = finalPoints >= 75 ? 3 : finalPoints >= 50 ? 2 : 1;
      setPhaseDone(true);
      playSound('star', settings.soundEffects);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompletePhase(finalPoints, stars);
    }
  };

  const handleRestartPhase = () => {
    playSound('click', settings.soundEffects);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnsweredCorrectly(null);
    setPoints(0);
    setPhaseDone(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Hero Card */}
      <section
        className={`rounded-2xl border overflow-hidden transition-all ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-800 border-slate-200 shadow-sm'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-8">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Fase 1 · O Começo de Tudo</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-['Fredoka'] text-balance">
              O que é um Navegador de Internet?
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Imagine que a <strong>Internet</strong> é uma cidade gigante cheia de lugares divertidos, como bibliotecas,
              jogos e vídeos. O <strong>Navegador</strong> (como o Chrome, Firefox ou Edge) é a sua nave espacial:
              o veículo que te leva para visitar esses lugares!
            </p>

            {/* Metaphor Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  settings.highContrast
                    ? 'border-yellow-400 bg-yellow-950/30'
                    : 'border-indigo-100 bg-indigo-50/70 text-indigo-950'
                }`}
              >
                <Globe className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-bold text-sm">O Navegador é o Veículo</h4>
                  <p className="text-xs text-slate-600">Exemplos: Chrome, Edge, Safari, Firefox.</p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  settings.highContrast
                    ? 'border-yellow-400 bg-yellow-950/30'
                    : 'border-emerald-100 bg-emerald-50/70 text-emerald-950'
                }`}
              >
                <Monitor className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-bold text-sm">O Site é o Destino</h4>
                  <p className="text-xs text-slate-600">Exemplos: Wikipédia, YouTube, Site da Escola.</p>
                </div>
              </div>
            </div>

            <div>
              <AudioNarratorButton
                text="O Navegador de internet é como a sua nave espacial que te leva para visitar todos os sites da internet, como a Wikipédia, o YouTube e o site da sua escola!"
                label="Ouvir Explicação"
              />
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video md:aspect-4/3 bg-slate-100 shadow-inner">
              <img
                src="/src/assets/images/hero_browser_adventure_1790178279754.jpg"
                alt="Ilustração colorida de crianças explorando o universo digital dentro de um navegador"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Mission Card */}
      {!phaseDone ? (
        <section
          aria-labelledby="quiz-question-heading"
          className={`rounded-2xl border p-6 md:p-8 space-y-6 transition-all ${
            settings.highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-200 shadow-sm'
          }`}
        >
          {/* Progress and Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                {currentIndex + 1}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                Pergunta {currentIndex + 1} de {PHASE1_ITEMS.length}
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
                text={`${currentItem.question} ${currentItem.description}`}
                label="Ouvir Pergunta"
                size="sm"
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 id="quiz-question-heading" className="text-xl md:text-2xl font-bold tracking-tight">
              {currentItem.question}
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              {currentItem.description}
            </p>
          </div>

          {/* Animated Hint Banner (Triggered after 30s or manually) */}
          {showHint && selectedOption === null && (
            <AnimatedHintBanner
              hintText={PHASE1_HINTS[currentIndex]?.text || 'Preste atenção nas opções de resposta!'}
              narratorText={PHASE1_HINTS[currentIndex]?.narrator}
              isTimeoutReached={isTimeoutReached}
              onDismiss={dismissHint}
              settings={settings}
              targetElementName={PHASE1_HINTS[currentIndex]?.targetHint}
            />
          )}

          {/* Option Buttons (Big, Touch-Friendly, Accessible) */}
          <div className="space-y-3" role="radiogroup" aria-label={currentItem.question}>
            {currentItem.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const showResult = selectedOption !== null;
              const isHintTarget = showHint && selectedOption === null && opt.isCorrect;

              let btnStyle = settings.highContrast
                ? 'bg-yellow-950/20 text-yellow-300 border-yellow-400 hover:bg-yellow-900/40'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-300';

              if (isHintTarget) {
                btnStyle = settings.highContrast
                  ? 'bg-yellow-950/80 text-yellow-200 border-yellow-300 ring-4 ring-yellow-400 shadow-lg'
                  : 'bg-amber-50 text-amber-950 border-amber-400 ring-4 ring-amber-300 shadow-md';
              }

              if (showResult) {
                if (opt.isCorrect) {
                  btnStyle = settings.highContrast
                    ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-300';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = settings.highContrast
                    ? 'bg-red-950 text-red-300 border-red-500'
                    : 'bg-rose-50 text-rose-900 border-rose-300';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all cursor-pointer font-medium text-base md:text-lg flex items-start gap-4 focus-visible:ring-4 focus-visible:ring-indigo-300 min-h-[58px] ${btnStyle}`}
                >
                  <span className="mt-1 shrink-0">
                    {showResult && opt.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                    ) : showResult && isSelected && !opt.isCorrect ? (
                      <XCircle className="w-6 h-6 text-rose-600" aria-hidden="true" />
                    ) : isHintTarget ? (
                      <Sparkles className="w-6 h-6 text-amber-500 animate-spin-slow" aria-hidden="true" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-slate-400" aria-hidden="true" />
                    )}
                  </span>
                  <span className="grow leading-snug">{opt.text}</span>

                  {isHintTarget && (
                    <div className="shrink-0 self-center">
                      <LucideHintHighlight
                        label="Dica: Escolha esta!"
                        iconType="lightbulb"
                        settings={settings}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {selectedOption !== null && (
            <div
              className={`p-5 rounded-xl border-2 space-y-3 animate-in fade-in zoom-in-95 duration-200 ${
                answeredCorrectly
                  ? settings.highContrast
                    ? 'border-yellow-400 bg-yellow-950/40 text-yellow-300'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : settings.highContrast
                    ? 'border-red-400 bg-red-950/40 text-red-200'
                    : 'border-amber-300 bg-amber-50 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {answeredCorrectly ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                      <span>Incrível! Resposta Correta! 🎉</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />
                      <span>Quase lá! Vamos aprender juntos:</span>
                    </>
                  )}
                </h3>
                <AudioNarratorButton
                  text={
                    currentItem.options.find((o) => o.id === selectedOption)?.explanation ||
                    'Explicação'
                  }
                  label="Ouvir Explicação"
                  size="sm"
                />
              </div>

              <p className="text-base leading-relaxed">
                {currentItem.options.find((o) => o.id === selectedOption)?.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all cursor-pointer shadow-md focus-visible:ring-4 ${
                    settings.highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <span>
                    {currentIndex + 1 < PHASE1_ITEMS.length
                      ? 'Próxima Pergunta'
                      : 'Ver Resultado da Fase'}
                  </span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Phase Completed Banner */
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
            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <Sparkles className="w-10 h-10 animate-bounce" aria-hidden="true" />
            </div>
            <InlineFloatingStars settings={settings} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Parabéns! Você concluiu a Fase 1! 🚀
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto">
              Agora você já sabe a diferença entre navegador e site. Você ganhou a insígnia de{' '}
              <strong>Capitão dos Navegadores</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleRestartPhase}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-sm cursor-pointer"
            >
              Jogar Esta Fase de Novo
            </button>
            <button
              type="button"
              onClick={onNextPhase}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Ir para a Fase 2: Peças do Navegador</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
