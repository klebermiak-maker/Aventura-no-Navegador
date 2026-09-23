import { AccessibilitySettings } from '../types/game';
import { Type, Volume2, VolumeX, Eye, Sun, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  settings: AccessibilitySettings;
  onUpdate: (newSettings: Partial<AccessibilitySettings>) => void;
}

export function AccessibilityToolbar({ settings, onUpdate }: Props) {
  const cycleFontSize = () => {
    playSound('click', settings.soundEffects);
    if (settings.fontSize === 'normal') onUpdate({ fontSize: 'large' });
    else if (settings.fontSize === 'large') onUpdate({ fontSize: 'extralarge' });
    else onUpdate({ fontSize: 'normal' });
  };

  const toggleContrast = () => {
    playSound('click', settings.soundEffects);
    onUpdate({ highContrast: !settings.highContrast });
  };

  const toggleSound = () => {
    const nextVal = !settings.soundEffects;
    if (nextVal) playSound('click', true);
    onUpdate({ soundEffects: nextVal });
  };

  const fontSizeLabels = {
    normal: 'Texto: Normal (A)',
    large: 'Texto: Grande (A+)',
    extralarge: 'Texto: Extra (A++)',
  };

  return (
    <nav
      aria-label="Ferramentas de acessibilidade"
      className={`border-b transition-colors ${
        settings.highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-500" aria-hidden="true" />
          <span className="font-semibold">Recursos de Acessibilidade do 3º Ano</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Font Size Toggle */}
          <button
            type="button"
            onClick={cycleFontSize}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              settings.highContrast
                ? 'bg-yellow-900/40 text-yellow-300 border-yellow-400 hover:bg-yellow-900/60'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
            title="Alterar o tamanho da letra para facilitar a leitura"
          >
            <Type className="w-4 h-4" aria-hidden="true" />
            <span className="whitespace-nowrap font-medium">{fontSizeLabels[settings.fontSize]}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleContrast}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              settings.highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
            title="Ativar modo de alto contraste para melhor visibilidade"
          >
            <Sun className="w-4 h-4" aria-hidden="true" />
            <span className="whitespace-nowrap font-medium">
              {settings.highContrast ? 'Alto Contraste: Ligado' : 'Alto Contraste'}
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              settings.soundEffects
                ? settings.highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-200 text-slate-600 border-slate-300'
            }`}
            title="Ligar ou desligar sons das conquistas"
          >
            {settings.soundEffects ? (
              <Volume2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
            <span className="whitespace-nowrap font-medium">
              {settings.soundEffects ? 'Sons: Ligados' : 'Sons: Mudos'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
