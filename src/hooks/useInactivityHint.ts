import { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audio';

interface UseInactivityHintOptions {
  stepKey: string | number;
  isCompleted: boolean;
  timeoutSeconds?: number;
  soundEnabled?: boolean;
  onHintTrigger?: () => void;
}

export function useInactivityHint({
  stepKey,
  isCompleted,
  timeoutSeconds = 30,
  soundEnabled = true,
  onHintTrigger,
}: UseInactivityHintOptions) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const hasPlayedSoundRef = useRef(false);

  // Reset timer whenever stepKey changes or completed changes
  useEffect(() => {
    setSecondsElapsed(0);
    setShowHint(false);
    hasPlayedSoundRef.current = false;
  }, [stepKey]);

  useEffect(() => {
    if (isCompleted) {
      setShowHint(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        if (next >= timeoutSeconds && !showHint) {
          setShowHint(true);
          if (!hasPlayedSoundRef.current) {
            playSound('hint', soundEnabled);
            hasPlayedSoundRef.current = true;
            onHintTrigger?.();
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted, timeoutSeconds, showHint, soundEnabled, onHintTrigger, stepKey]);

  const triggerHintNow = () => {
    setShowHint(true);
    if (!hasPlayedSoundRef.current) {
      playSound('hint', soundEnabled);
      hasPlayedSoundRef.current = true;
      onHintTrigger?.();
    }
  };

  const dismissHint = () => {
    setShowHint(false);
  };

  const secondsLeft = Math.max(0, timeoutSeconds - secondsElapsed);

  return {
    showHint,
    secondsElapsed,
    secondsLeft,
    isTimeoutReached: secondsElapsed >= timeoutSeconds,
    triggerHintNow,
    dismissHint,
  };
}
