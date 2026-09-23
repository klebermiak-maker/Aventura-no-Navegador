export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6; // 6 is Certificate / Conclusion

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extralarge';
  highContrast: boolean;
  soundEffects: boolean;
  autoNarrate: boolean;
}

export interface BrowserElement {
  id: string;
  name: string;
  shortDesc: string;
  fullExplanation: string;
  iconName: string;
  targetArea: 'address-bar' | 'back-button' | 'forward-button' | 'refresh-button' | 'new-tab' | 'bookmark-star' | 'security-lock' | 'home-button';
}

export interface PhaseScore {
  phaseId: PhaseId;
  points: number;
  maxPoints: number;
  completed: boolean;
  stars: number; // 1 to 3
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtPhase: PhaseId;
}
