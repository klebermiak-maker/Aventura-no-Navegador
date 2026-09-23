import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Award, Trophy, PartyPopper, CheckCircle2, ArrowRight } from 'lucide-react';
import { AccessibilitySettings } from '../types/game';
import { playSound } from '../utils/audio';

interface Particle {
  id: number;
  type: 'confetti' | 'star' | 'circle' | 'streamer' | 'emoji';
  x: number;
  initialY: number;
  targetY: number;
  targetX: number;
  scale: number;
  rotate: number;
  rotateY: number;
  duration: number;
  delay: number;
  color: string;
  emoji?: string;
  size: number;
}

interface CelebrationParticlesProps {
  isActive: boolean;
  phaseNumber: number;
  phaseTitle: string;
  stars?: number;
  points?: number;
  onClose: () => void;
  onNextPhase?: () => void;
  settings: AccessibilitySettings;
}

const CONFETTI_COLORS = [
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#facc15', // gold yellow
  '#ff7849', // orange
];

const CELEBRATION_EMOJIS = ['⭐', '🌟', '✨', '🎈', '🏆', '🎉', '🚀', '🎯', '💫'];

export function CelebrationParticles({
  isActive,
  phaseNumber,
  phaseTitle,
  stars = 3,
  points = 100,
  onClose,
  onNextPhase,
  settings,
}: CelebrationParticlesProps) {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1000
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate randomized particles once per celebration trigger
  const particles = useMemo<Particle[]>(() => {
    if (!isActive) return [];

    const list: Particle[] = [];
    const count = 55; // rich density without dropping frames

    for (let i = 0; i < count; i++) {
      const typeChoice = Math.random();
      const type: Particle['type'] =
        typeChoice < 0.45
          ? 'confetti'
          : typeChoice < 0.65
          ? 'circle'
          : typeChoice < 0.8
          ? 'star'
          : typeChoice < 0.9
          ? 'emoji'
          : 'streamer';

      const startX = Math.random() * 100; // percent across screen width
      const targetXDrift = (Math.random() - 0.5) * 120; // horizontal drift px
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];

      list.push({
        id: i,
        type,
        x: startX,
        initialY: -20 - Math.random() * 60, // starts above the screen
        targetY: 900 + Math.random() * 400,
        targetX: targetXDrift,
        scale: 0.6 + Math.random() * 0.9,
        rotate: Math.random() * 720 - 360,
        rotateY: Math.random() * 1080 - 540,
        duration: 2.8 + Math.random() * 2.2,
        delay: Math.random() * 0.9,
        color,
        emoji,
        size: type === 'streamer' ? 24 : type === 'confetti' ? 12 : 16,
      });
    }

    return list;
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`Comemoração: Fase ${phaseNumber} Concluída com Sucesso!`}
      >
        {/* Soft Backdrop with gentle blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Ambient Expanding Shockwave Rings */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: [0.2, 1.8, 2.5], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-96 h-96 rounded-full border-4 border-amber-300 pointer-events-none"
        />
        <motion.div
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: [0.1, 1.4, 2.2], opacity: [0.7, 0.3, 0] }}
          transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-96 h-96 rounded-full border-4 border-indigo-400 pointer-events-none"
        />

        {/* Animated Particles Falling & Fluttering (framer-motion) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => {
            if (p.type === 'emoji') {
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: `${p.x}vw`,
                    y: `${p.initialY}px`,
                    rotate: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: `${p.targetY}px`,
                    x: `calc(${p.x}vw + ${p.targetX}px)`,
                    rotate: p.rotate,
                    scale: [0, p.scale * 1.3, p.scale],
                    opacity: [1, 1, 0.2],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute text-2xl select-none"
                >
                  {p.emoji}
                </motion.div>
              );
            }

            if (p.type === 'star') {
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: `${p.x}vw`,
                    y: `${p.initialY}px`,
                    rotate: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: `${p.targetY}px`,
                    x: `calc(${p.x}vw + ${p.targetX}px)`,
                    rotate: [0, 180, 360],
                    scale: [0, p.scale * 1.4, p.scale * 0.8],
                    opacity: [1, 1, 0.3],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 0.6,
                    ease: 'easeInOut',
                  }}
                  className="absolute text-yellow-400 drop-shadow-md select-none"
                >
                  <Star className="w-6 h-6 fill-yellow-400" />
                </motion.div>
              );
            }

            if (p.type === 'streamer') {
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: `${p.x}vw`,
                    y: `${p.initialY}px`,
                    rotate: 0,
                    scaleY: 0,
                    opacity: 0.9,
                  }}
                  animate={{
                    y: `${p.targetY}px`,
                    x: [
                      `calc(${p.x}vw + 0px)`,
                      `calc(${p.x}vw + ${p.targetX * 0.6}px)`,
                      `calc(${p.x}vw - ${p.targetX * 0.4}px)`,
                      `calc(${p.x}vw + ${p.targetX}px)`,
                    ],
                    rotate: p.rotate,
                    rotateY: p.rotateY,
                    scaleY: [0, 1.4, 1],
                    opacity: [0.9, 1, 0.4],
                  }}
                  transition={{
                    duration: p.duration * 1.1,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 0.4,
                    ease: 'linear',
                  }}
                  style={{
                    backgroundColor: p.color,
                    width: '6px',
                    height: `${p.size}px`,
                    borderRadius: '4px',
                  }}
                  className="absolute shadow-sm"
                />
              );
            }

            if (p.type === 'circle') {
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: `${p.x}vw`,
                    y: `${p.initialY}px`,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: `${p.targetY}px`,
                    x: `calc(${p.x}vw + ${p.targetX}px)`,
                    scale: [0, p.scale, p.scale * 0.8],
                    opacity: [1, 1, 0.2],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 0.4,
                    ease: 'easeOut',
                  }}
                  style={{
                    backgroundColor: p.color,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                  }}
                  className="absolute rounded-full shadow-xs"
                />
              );
            }

            // Standard Rectangular Confetti with 3D Flip
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}vw`,
                  y: `${p.initialY}px`,
                  rotate: 0,
                  rotateY: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  y: `${p.targetY}px`,
                  x: [
                    `calc(${p.x}vw + 0px)`,
                    `calc(${p.x}vw + ${p.targetX * 0.5}px)`,
                    `calc(${p.x}vw - ${p.targetX * 0.3}px)`,
                    `calc(${p.x}vw + ${p.targetX}px)`,
                  ],
                  rotate: p.rotate,
                  rotateY: p.rotateY,
                  scale: [0, p.scale, p.scale * 0.8],
                  opacity: [1, 1, 0.2],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.5,
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundColor: p.color,
                  width: `${p.size}px`,
                  height: `${p.size * 0.6}px`,
                  borderRadius: '2px',
                }}
                className="absolute shadow-xs"
              />
            );
          })}
        </div>

        {/* Central Celebratory Trophy & Star Card with Bouncy Spring Animation */}
        <motion.div
          initial={{ scale: 0.3, y: 70, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.6, y: 40, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 260,
          }}
          className={`relative max-w-lg w-full rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 z-10 ${
            settings.highContrast
              ? 'bg-black text-yellow-300 border-yellow-400 shadow-yellow-400/30'
              : 'bg-white text-slate-900 border-amber-300 shadow-amber-500/25'
          }`}
        >
          {/* Top Floating Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              delay: 0.2,
              damping: 12,
              stiffness: 200,
            }}
            className="absolute -top-7 left-1/2 -translate-x-1/2"
          >
            <div
              className={`px-5 py-2 rounded-full font-black text-sm md:text-base flex items-center gap-2 shadow-lg border-2 ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 border-white'
              }`}
            >
              <PartyPopper className="w-5 h-5 animate-bounce" />
              <span>SUPER CONQUISTA!</span>
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
          </motion.div>

          {/* Trophy Icon with Shimmer & Pulse */}
          <div className="pt-3 pb-2 flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 220 }}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center shadow-inner relative ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-linear-to-br from-amber-300 via-yellow-400 to-orange-400 text-amber-950'
              }`}
            >
              <Trophy className="w-12 h-12 md:w-14 md:h-14 animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-dashed border-white/60 rounded-3xl pointer-events-none"
              />
            </motion.div>
          </div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-2xl md:text-3xl font-black font-['Fredoka'] tracking-tight mt-2 text-balance"
          >
            Fase {phaseNumber} Concluída! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-sm md:text-base font-semibold mt-1 ${
              settings.highContrast ? 'text-yellow-200' : 'text-slate-600'
            }`}
          >
            {phaseTitle}
          </motion.p>

          {/* Interactive Staggered Stars Reward */}
          <div className="flex justify-center items-center gap-3 my-4 py-2">
            {[1, 2, 3].map((starIdx) => {
              const isEarned = starIdx <= stars;
              return (
                <motion.div
                  key={starIdx}
                  initial={{ scale: 0, rotate: -60 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 14,
                    delay: 0.45 + starIdx * 0.15,
                  }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`p-2.5 rounded-2xl border-2 transition-transform transform hover:scale-110 ${
                      isEarned
                        ? settings.highContrast
                          ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                          : 'border-amber-400 bg-amber-100 text-amber-500 shadow-md shadow-amber-300/40'
                        : 'border-slate-200 bg-slate-100 text-slate-300'
                    }`}
                  >
                    <Star
                      className={`w-7 h-7 md:w-8 md:h-8 ${
                        isEarned ? 'fill-current animate-pulse' : ''
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Score Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm md:text-base ${
              settings.highContrast
                ? 'bg-yellow-950 border border-yellow-400 text-yellow-300'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>+ {points} Pontos Conquistados!</span>
          </motion.div>

          {/* Action Buttons: Next Phase or Continue */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {onNextPhase && phaseNumber < 5 ? (
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.soundEffects);
                  onNextPhase();
                }}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                  settings.highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25'
                }`}
              >
                <span>Ir para a Fase {phaseNumber + 1}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                playSound('click', settings.soundEffects);
                onClose();
              }}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl font-bold text-base border-2 transition-all cursor-pointer ${
                settings.highContrast
                  ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {phaseNumber === 5 ? 'Ver Meu Diploma! 📜' : 'Explorar Esta Fase'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface InlineFloatingStarsProps {
  settings: AccessibilitySettings;
}

/**
 * Animated floating particle burst for inline phase completion cards
 */
export function InlineFloatingStars({ settings }: InlineFloatingStarsProps) {
  const sparkItems = [
    { id: 1, x: -35, y: -25, delay: 0, icon: '⭐' },
    { id: 2, x: 35, y: -30, delay: 0.2, icon: '🌟' },
    { id: 3, x: -45, y: 20, delay: 0.4, icon: '✨' },
    { id: 4, x: 45, y: 25, delay: 0.6, icon: '🎉' },
    { id: 5, x: 0, y: -45, delay: 0.3, icon: '💫' },
  ];

  return (
    <div className="relative inline-block" aria-hidden="true">
      {sparkItems.map((item) => (
        <motion.span
          key={item.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 1, 0],
            scale: [0, 1.3, 1, 1.2, 0],
            x: item.x,
            y: item.y,
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeOut',
          }}
          className="absolute text-lg pointer-events-none select-none"
        >
          {item.icon}
        </motion.span>
      ))}
    </div>
  );
}
