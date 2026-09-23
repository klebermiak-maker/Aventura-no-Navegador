import { useState, useEffect } from 'react';
import { AccessibilitySettings } from '../types/game';
import { Award, Star, Printer, X, CheckCircle, Sparkles, Compass, ShieldCheck, Download } from 'lucide-react';
import { playSound } from '../utils/audio';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  totalScore: number;
  totalStars: number;
  onClose: () => void;
  onRestartAll: () => void;
  settings: AccessibilitySettings;
}

export function CertificateModal({
  totalScore,
  totalStars,
  onClose,
  onRestartAll,
  settings,
}: Props) {
  const [studentName, setStudentName] = useState('Navegador Mirim');
  const [isEditing, setIsEditing] = useState(false);

  const badges = [
    { title: 'Capitão dos Navegadores', icon: '🧭', desc: 'Diferenciou navegador e site' },
    { title: 'Mestre da Barra de Endereço', icon: '🔍', desc: 'Dominou os botões e a URL' },
    { title: 'Decifrador de Ícones', icon: '⭐', desc: 'Decodificou os símbolos da web' },
    { title: 'Detetive das Palavras-Chave', icon: '🔑', desc: 'Aprendeu a buscar com precisão' },
    { title: 'Guardião Digital', icon: '🛡️', desc: 'Navega com segurança e proteção' },
  ];

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    playSound('click', settings.soundEffects);
    window.print();
  };

  useEffect(() => {
    playSound('victory', settings.soundEffects);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, [settings.soundEffects]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className={`w-full max-w-3xl rounded-3xl border-4 shadow-2xl overflow-hidden print:border-none print:shadow-none transition-all ${
          settings.highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-amber-300'
        }`}
      >
        {/* Modal Top Bar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
            <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span>Diploma de Conclusão · 3º Ano do Ensino Fundamental</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
              aria-label="Fechar diploma"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-8 md:p-12 relative bg-linear-to-b from-amber-50/50 via-white to-amber-50/30 print:p-8">
          {/* Certificate Decorative Border */}
          <div className="border-4 border-double border-amber-400 rounded-2xl p-6 md:p-8 relative space-y-6 text-center">
            {/* Top Seal */}
            <div className="flex items-center justify-center gap-3 text-amber-600">
              <Sparkles className="w-6 h-6 text-amber-500" aria-hidden="true" />
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-amber-800">
                Certificado Oficial de Mérito Digital
              </span>
              <Sparkles className="w-6 h-6 text-amber-500" aria-hidden="true" />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 id="certificate-title" className="text-3xl md:text-4xl font-extrabold font-['Fredoka'] text-indigo-950">
                DIPLOMA DE NAVEGADOR OFICIAL
              </h1>
              <p className="text-sm md:text-base text-slate-600 font-medium">
                Concedido com distinção e louvor na jornada
              </p>
              <p className="text-xl md:text-2xl font-bold font-['Fredoka'] text-indigo-600">
                "Aventura no Navegador"
              </p>
            </div>

            {/* Student Name Section */}
            <div className="py-2 max-w-md mx-auto">
              <div className="text-xs text-slate-500 font-semibold uppercase mb-1">
                Certificamos que o(a) aluno(a):
              </div>

              {isEditing ? (
                <div className="flex gap-2 justify-center">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Digite seu nome completo..."
                    className="px-4 py-2 border-2 border-indigo-400 rounded-xl font-bold text-lg text-center text-slate-900 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditing(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditing(true);
                  }}
                  className="group cursor-pointer border-b-2 border-indigo-300 pb-1 hover:border-indigo-600 transition-colors"
                  title="Clique para alterar o nome no diploma"
                >
                  <span className="text-2xl md:text-3xl font-extrabold text-indigo-900 font-['Fredoka']">
                    {studentName}
                  </span>
                  <span className="text-xs text-indigo-500 block print:hidden">
                    (Clique aqui para digitar seu nome)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
              Completou todas as 5 missões educativas do 3º ano, aprendendo a reconhecer os elementos do navegador,
              usar a barra de endereço com sabedoria, classificar ícones, pesquisar com palavras-chave e navegar
              com segurança e responsabilidade digital!
            </p>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/80 text-center space-y-1"
                >
                  <div className="text-2xl" aria-hidden="true">
                    {b.icon}
                  </div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {b.title}
                  </div>
                </div>
              ))}
            </div>

            {/* Score and Stars Banner */}
            <div className="flex flex-wrap items-center justify-around gap-4 pt-3 border-t border-amber-200 text-sm font-bold text-slate-800">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" aria-hidden="true" />
                <span>Estrelas: {totalStars} / 15</span>
              </div>
              <div>
                <span>Pontuação Final: {totalScore} pontos</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Data: {currentDate}
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-2 gap-8 pt-6 max-w-md mx-auto text-xs text-slate-500">
              <div className="border-t border-slate-400 pt-1 text-center">
                <span className="font-bold block text-slate-700">Professora / Educador(a)</span>
                <span>Turma do 3º Ano</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-center">
                <span className="font-bold block text-slate-700">Aventura no Navegador</span>
                <span>Selo de Cidadão Digital</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (hidden on print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onRestartAll}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border border-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            Jogar Toda a Aventura Novamente
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Imprimir Certificado</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
