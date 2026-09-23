import { useState } from 'react';
import { PHASE2_MISSIONS, BrowserMission } from '../data/gameData';
import { AccessibilitySettings } from '../types/game';
import { AudioNarratorButton } from './AudioNarratorButton';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  Star,
  Lock,
  Home,
  Globe,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Lightbulb,
  ExternalLink,
  ChevronRight,
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

type ClickableKey = 'address-bar' | 'back-button' | 'forward-button' | 'refresh-button' | 'new-tab' | 'bookmark-star' | 'security-lock' | 'home-button';

export function Phase2BrowserWindow({ onCompletePhase, onNextPhase, settings }: Props) {
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    title: string;
    message: string;
    tip?: string;
  } | null>(null);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [phaseDone, setPhaseDone] = useState(false);
  const [tabs, setTabs] = useState(['Aventura na Escola', 'Biblioteca Virtual']);
  const [activeTab, setActiveTab] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [refreshSpinning, setRefreshSpinning] = useState(false);

  const currentMission: BrowserMission | undefined = PHASE2_MISSIONS[currentMissionIdx];

  const {
    showHint: autoShowHint,
    secondsLeft,
    isTimeoutReached,
    triggerHintNow,
    dismissHint,
  } = useInactivityHint({
    stepKey: currentMission?.id || currentMissionIdx,
    isCompleted: feedback?.success === true || phaseDone,
    timeoutSeconds: 30,
    soundEnabled: settings.soundEffects,
  });

  const isHintActive = autoShowHint || showHint;

  const handleElementClick = (key: ClickableKey, elementName: string, defaultActionExpl: string) => {
    if (phaseDone && !currentMission) {
      // Free exploration mode after completion
      playSound('click', settings.soundEffects);
      setFeedback({
        success: true,
        title: `Você clicou em: ${elementName}`,
        message: defaultActionExpl,
      });
      return;
    }

    if (!currentMission) return;

    if (currentMission.targetKey === key) {
      // Mission Success!
      playSound('correct', settings.soundEffects);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

      if (key === 'bookmark-star') setIsBookmarked(!isBookmarked);
      if (key === 'refresh-button') {
        setRefreshSpinning(true);
        setTimeout(() => setRefreshSpinning(false), 800);
      }
      if (key === 'new-tab') {
        setTabs((prev) => [...prev, 'Nova Página']);
        setActiveTab(tabs.length);
      }

      setFeedback({
        success: true,
        title: 'Acertou em cheio! 🎯',
        message: currentMission.successMessage,
        tip: currentMission.detailedTip,
      });

      if (!completedMissionIds.includes(currentMission.id)) {
        setCompletedMissionIds((prev) => [...prev, currentMission.id]);
      }
    } else {
      // Wrong element clicked
      playSound('wrong', settings.soundEffects);
      setFeedback({
        success: false,
        title: `Esse é o botão: ${elementName}`,
        message: `${defaultActionExpl} Mas para esta missão, queremos outra coisa. Dê uma olhada na pergunta!`,
      });
    }
  };

  const handleAdvanceMission = () => {
    playSound('click', settings.soundEffects);
    setFeedback(null);
    setShowHint(false);

    if (currentMissionIdx + 1 < PHASE2_MISSIONS.length) {
      setCurrentMissionIdx((prev) => prev + 1);
    } else {
      // Phase completed!
      setPhaseDone(true);
      playSound('star', settings.soundEffects);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      onCompletePhase(100, 3);
    }
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Fase 2 · Simulador Interativo</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              As Peças do Navegador
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Interaja com a janela do navegador abaixo para cumprir as missões e aprender onde fica cada peça!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500">
              Missão {Math.min(currentMissionIdx + 1, PHASE2_MISSIONS.length)} de {PHASE2_MISSIONS.length}
            </span>
            <div className="flex gap-1">
              {PHASE2_MISSIONS.map((m, idx) => (
                <div
                  key={m.id}
                  className={`w-3 h-3 rounded-full ${
                    completedMissionIds.includes(m.id)
                      ? 'bg-emerald-500'
                      : idx === currentMissionIdx
                      ? 'bg-indigo-600 ring-2 ring-indigo-300 animate-pulse'
                      : 'bg-slate-200'
                  }`}
                  title={m.title}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Mission Target Box */}
      {!phaseDone && currentMission && (
        <section
          aria-live="polite"
          className={`p-5 rounded-2xl border-2 transition-all ${
            settings.highContrast
              ? 'bg-yellow-950/30 border-yellow-400 text-yellow-300'
              : 'bg-indigo-50/80 border-indigo-200 text-indigo-950 shadow-xs'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 grow">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {currentMission.title}
                </span>
                <span className="text-xs text-slate-500 font-medium">Clique no elemento correto abaixo</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold leading-snug">
                {currentMission.instruction}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <HintStatusButton
                secondsLeft={secondsLeft}
                showHint={isHintActive}
                onTriggerNow={() => {
                  setShowHint(true);
                  triggerHintNow();
                }}
                settings={settings}
              />
              <AudioNarratorButton
                text={`${currentMission.title}. ${currentMission.instruction}`}
                label="Ouvir Missão"
              />
            </div>
          </div>

          {isHintActive && (
            <div className="mt-3">
              <AnimatedHintBanner
                hintText={currentMission.kidHint}
                narratorText={currentMission.kidHint}
                secondsElapsed={30 - secondsLeft}
                isTimeoutReached={isTimeoutReached}
                onDismiss={() => {
                  dismissHint();
                  setShowHint(false);
                }}
                settings={settings}
                targetElementName={currentMission.targetLabel}
              />
            </div>
          )}
        </section>
      )}

      {/* Simulated Interactive Browser Window */}
      <div
        className={`rounded-2xl border-4 overflow-hidden shadow-xl transition-all ${
          settings.highContrast
            ? 'border-yellow-400 bg-black text-yellow-300'
            : 'border-slate-300 bg-slate-100 text-slate-800'
        }`}
      >
        {/* Window Top Controls & Tabs */}
        <div className="bg-slate-200/80 dark:bg-slate-800 px-3 pt-2.5 pb-0 flex items-center gap-2 border-b border-slate-300">
          {/* OS Dots */}
          <div className="flex items-center gap-1.5 mr-2" aria-hidden="true">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-400 inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 inline-block" />
          </div>

          {/* Browser Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5" role="tablist">
            {tabs.map((tabTitle, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeTab === idx}
                onClick={() => {
                  playSound('click', settings.soundEffects);
                  setActiveTab(idx);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs md:text-sm font-semibold transition-all cursor-pointer border-t border-x ${
                  activeTab === idx
                    ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
                    : 'bg-slate-200 text-slate-600 border-transparent hover:bg-slate-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                <span className="truncate max-w-[120px]">{tabTitle}</span>
              </button>
            ))}

            {/* New Tab Button (+) with Lucide Hint Highlight */}
            <div className="relative">
              {isHintActive && currentMission?.targetKey === 'new-tab' && (
                <LucideHintHighlight
                  position="pointer"
                  label="Dica: Nova Aba (+)"
                  iconType="sparkles"
                  settings={settings}
                />
              )}
              <button
                type="button"
                onClick={() =>
                  handleElementClick(
                    'new-tab',
                    'Botão Nova Aba (+)',
                    'Abre uma nova página para você navegar em mais de um site sem fechar o anterior!'
                  )
                }
                aria-label="Abrir Nova Aba"
                className={`p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-300/70 cursor-pointer transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isHintActive && currentMission?.targetKey === 'new-tab'
                    ? 'ring-4 ring-amber-400 bg-amber-200 text-amber-950 scale-110 shadow-lg'
                    : currentMission?.targetKey === 'new-tab'
                    ? 'ring-4 ring-indigo-400 bg-indigo-100 animate-pulse'
                    : ''
                }`}
                title="Nova Aba (+)"
              >
                <Plus className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Toolbar (Address Bar & Buttons) */}
        <div className="bg-white p-3 border-b border-slate-200 flex flex-wrap items-center gap-2 md:gap-3">
          {/* Back Button with Lucide Hint Highlight */}
          <div className="relative">
            {isHintActive && currentMission?.targetKey === 'back-button' && (
              <LucideHintHighlight
                position="pointer"
                label="Dica: Botão Voltar"
                iconType="arrow"
                settings={settings}
              />
            )}
            <button
              type="button"
              onClick={() =>
                handleElementClick(
                  'back-button',
                  'Botão Voltar (⬅️)',
                  'Volta para a página anterior que você estava visitando.'
                )
              }
              aria-label="Voltar página"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:bg-slate-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isHintActive && currentMission?.targetKey === 'back-button'
                  ? 'ring-4 ring-amber-400 border-amber-500 bg-amber-50 text-amber-900 scale-105 shadow-lg'
                  : currentMission?.targetKey === 'back-button'
                  ? 'ring-4 ring-indigo-400 border-indigo-500 bg-indigo-50 animate-pulse'
                  : 'border-slate-200 text-slate-700'
              }`}
              title="Voltar para a página anterior"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Forward Button */}
          <div className="relative">
            {isHintActive && currentMission?.targetKey === 'forward-button' && (
              <LucideHintHighlight
                position="pointer"
                label="Dica: Botão Avançar"
                iconType="arrow"
                settings={settings}
              />
            )}
            <button
              type="button"
              onClick={() =>
                handleElementClick(
                  'forward-button',
                  'Botão Avançar (➡️)',
                  'Avança para a próxima página do histórico depois que você clicou em voltar.'
                )
              }
              aria-label="Avançar página"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:bg-slate-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isHintActive && currentMission?.targetKey === 'forward-button'
                  ? 'ring-4 ring-amber-400 border-amber-500 bg-amber-50 text-amber-900 scale-105 shadow-lg'
                  : currentMission?.targetKey === 'forward-button'
                  ? 'ring-4 ring-indigo-400 border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 text-slate-700'
              }`}
              title="Avançar página"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Refresh Button with Lucide Hint Highlight */}
          <div className="relative">
            {isHintActive && currentMission?.targetKey === 'refresh-button' && (
              <LucideHintHighlight
                position="pointer"
                label="Dica: Recarregar (🔄)"
                iconType="sparkles"
                settings={settings}
              />
            )}
            <button
              type="button"
              onClick={() =>
                handleElementClick(
                  'refresh-button',
                  'Botão Recarregar (🔄)',
                  'Recarrega a página atual para buscar novidades ou corrigir se ela travou!'
                )
              }
              aria-label="Recarregar página"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:bg-slate-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isHintActive && currentMission?.targetKey === 'refresh-button'
                  ? 'ring-4 ring-amber-400 border-amber-500 bg-amber-50 text-amber-900 scale-105 shadow-lg'
                  : currentMission?.targetKey === 'refresh-button'
                  ? 'ring-4 ring-indigo-400 border-indigo-500 bg-indigo-50 animate-pulse'
                  : 'border-slate-200 text-slate-700'
              }`}
              title="Recarregar página atual"
            >
              <RotateCw
                className={`w-5 h-5 ${refreshSpinning ? 'animate-spin text-emerald-600' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Home Button */}
          <button
            type="button"
            onClick={() =>
              handleElementClick(
                'home-button',
                'Botão Início (🏠)',
                'Te leva direto para a página inicial configurada no seu navegador.'
              )
            }
            aria-label="Página inicial"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Ir para a página inicial"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Address Bar (URL Omnibox) - Centerpiece with Lucide Hint Highlight */}
          <div className="relative grow">
            {isHintActive && currentMission?.targetKey === 'address-bar' && (
              <LucideHintHighlight
                position="pointer"
                label="Dica: Barra de Endereço!"
                iconType="arrow"
                settings={settings}
              />
            )}
            <div
              onClick={() =>
                handleElementClick(
                  'address-bar',
                  'Barra de Endereço (URL)',
                  'Aqui digitamos o endereço exato do site (como www.escola.com.br) ou fazemos pesquisas!'
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleElementClick(
                    'address-bar',
                    'Barra de Endereço (URL)',
                    'Aqui digitamos o endereço do site!'
                  );
                }
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer select-none min-h-[48px] ${
                isHintActive && currentMission?.targetKey === 'address-bar'
                  ? 'ring-4 ring-amber-400 border-amber-500 bg-amber-50/90 shadow-lg text-slate-900'
                  : currentMission?.targetKey === 'address-bar'
                  ? 'ring-4 ring-indigo-400 border-indigo-600 bg-indigo-50/70 animate-pulse text-slate-900'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 text-slate-800'
              }`}
            >
              {/* Security Lock Button with Lucide Highlight */}
              <div className="relative">
                {isHintActive && currentMission?.targetKey === 'security-lock' && (
                  <LucideHintHighlight
                    position="pointer"
                    label="Cadeado 🔒"
                    iconType="sparkles"
                    settings={settings}
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementClick(
                      'security-lock',
                      'Cadeado de Segurança (🔒)',
                      'Mostra que a conexão com o site é protegida e segura com HTTPS!'
                    );
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isHintActive && currentMission?.targetKey === 'security-lock'
                      ? 'ring-4 ring-emerald-500 bg-emerald-100 shadow-md scale-110'
                      : currentMission?.targetKey === 'security-lock'
                      ? 'ring-4 ring-emerald-400 bg-emerald-100'
                      : 'hover:bg-slate-200'
                  }`}
                  title="Informações de segurança do site"
                >
                  <Lock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                </button>
              </div>

              {/* URL Display */}
              <span className="font-mono text-sm md:text-base font-medium grow truncate text-slate-700">
                <span className="text-emerald-700 font-bold">https://</span>
                <span>www.escola-aventura.edu.br</span>
              </span>

              {/* Bookmark Star Button with Lucide Highlight */}
              <div className="relative">
                {isHintActive && currentMission?.targetKey === 'bookmark-star' && (
                  <LucideHintHighlight
                    position="pointer"
                    label="Favoritos ⭐"
                    iconType="star"
                    settings={settings}
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementClick(
                      'bookmark-star',
                      'Estrela de Favoritos (⭐)',
                      'Guarda este site especial na sua lista de favoritos para você achar rapidinho depois!'
                    );
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isHintActive && currentMission?.targetKey === 'bookmark-star'
                      ? 'ring-4 ring-amber-400 bg-amber-100 shadow-md scale-110'
                      : currentMission?.targetKey === 'bookmark-star'
                      ? 'ring-4 ring-amber-400 bg-amber-100'
                      : 'hover:bg-slate-200'
                  }`}
                  title="Salvar nos Favoritos"
                >
                  <Star
                    className={`w-5 h-5 transition-transform ${
                      isBookmarked
                        ? 'text-amber-500 fill-amber-400 scale-110'
                        : 'text-slate-400 hover:text-amber-500'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Webpage Content Display */}
        <div className="bg-slate-50 p-6 md:p-10 min-h-[280px] flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Globe className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold font-['Fredoka'] text-slate-900">
              Página do Colégio Aventura Digital
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Você está navegando com sucesso! Repare como a página inteira fica dentro da janela do navegador.
              Use os botões acima para interagir.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Feedback & Next Mission Controller */}
      {feedback && (
        <section
          aria-live="assertive"
          className={`p-5 rounded-2xl border-2 space-y-3 animate-in fade-in zoom-in-95 duration-200 ${
            feedback.success
              ? settings.highContrast
                ? 'border-yellow-400 bg-yellow-950/50 text-yellow-300'
                : 'border-emerald-400 bg-emerald-50 text-emerald-950'
              : settings.highContrast
                ? 'border-red-400 bg-red-950/50 text-red-200'
                : 'border-amber-300 bg-amber-50 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              {feedback.success ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
              )}
              <span>{feedback.title}</span>
            </h3>

            <AudioNarratorButton
              text={`${feedback.title}. ${feedback.message} ${feedback.tip || ''}`}
              label="Ouvir"
              size="sm"
            />
          </div>

          <p className="text-base leading-relaxed">{feedback.message}</p>

          {feedback.tip && (
            <p className="text-sm font-medium opacity-90 border-t pt-2 mt-1">
              💡 {feedback.tip}
            </p>
          )}

          {feedback.success && !phaseDone && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleAdvanceMission}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer focus-visible:ring-4"
              >
                <span>
                  {currentMissionIdx + 1 < PHASE2_MISSIONS.length
                    ? 'Ir para a Próxima Missão'
                    : 'Concluir Fase 2!'}
                </span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Phase Completed State */}
      {phaseDone && (
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
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <Sparkles className="w-10 h-10 animate-bounce" aria-hidden="true" />
            </div>
            <InlineFloatingStars settings={settings} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Fredoka']">
              Sensacional! Todas as Peças Foram Descobertas! 🌟
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto">
              Você dominou a Barra de Endereço, abas, botões de navegação e o cadeado de segurança.
              Você conquistou a insígnia <strong>Mestre da Barra de Endereço</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                playSound('click', settings.soundEffects);
                setPhaseDone(false);
                setCurrentMissionIdx(0);
                setCompletedMissionIds([]);
                setFeedback(null);
              }}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-sm cursor-pointer"
            >
              Jogar Missões Novamente
            </button>
            <button
              type="button"
              onClick={onNextPhase}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Ir para a Fase 3: Classificador de Ícones</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
