import React, { useRef } from 'react';
import { Upload, RotateCcw, Eye, EyeOff } from 'lucide-react';
import {
  AvatarCropShape,
  CreatorProfile as CreatorProfileType,
  VerifiedBadgeType,
  WatermarkPosition,
} from '../types';
import { CreatorBadge } from './CreatorBadge';
import { DEFAULT_CREATOR_PROFILE } from '../utils/templateGenerator';

interface CreatorProfileProps {
  profile: CreatorProfileType;
  onChange: (updated: CreatorProfileType) => void;
}

const BADGE_OPTIONS: Array<{ value: VerifiedBadgeType; label: string }> = [
  { value: 'blue', label: 'Azul' },
  { value: 'gold', label: 'Dorada' },
  { value: 'gray', label: 'Gris' },
  { value: 'none', label: 'Ninguna' },
];

const POSITION_OPTIONS: Array<{ value: WatermarkPosition; label: string }> = [
  { value: 'integrated', label: 'Integrada en post' },
  { value: 'top-left', label: 'Superior izquierda' },
  { value: 'top-right', label: 'Superior derecha' },
  { value: 'bottom-left', label: 'Inferior izquierda' },
  { value: 'bottom-right', label: 'Inferior derecha' },
  { value: 'floating', label: 'Flotante centrada' },
];

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ profile, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...profile, avatarDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Perfil del Creador / Marca</h3>
          <p className="text-xs text-slate-400 mt-0.5">Guardado automático en tu navegador</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_CREATOR_PROFILE)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-[#22262E] hover:bg-[#2B303A] rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Restablecer perfil"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer
        </button>
      </div>

      {/* Avatar Upload & Crop Shape */}
      <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 overflow-hidden bg-slate-800 border border-slate-700 shrink-0 ${
              profile.avatarShape === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
          >
            <img
              src={profile.avatarDataUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-100 truncate">
                {profile.name || 'Sin nombre'}
              </span>
              <CreatorBadge type={profile.verified} size={15} />
            </div>
            <p className="text-xs text-slate-400 truncate">{profile.handle || '@usuario'}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir Logo / Foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-xs font-medium text-slate-300">Recorte de avatar</span>
          <div className="flex items-center gap-1 p-1 bg-[#181B20] rounded-lg border border-slate-800">
            {(['circle', 'square'] as AvatarCropShape[]).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => onChange({ ...profile, avatarShape: shape })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  profile.avatarShape === shape
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {shape === 'circle' ? 'Circular' : 'Cuadrado'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Name & Handle */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nombre del creador o medio
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            placeholder="Ej. Noticias 24/7"
            className="w-full px-3 py-2 text-sm bg-[#121419] border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Usuario / Handle o Subtítulo
          </label>
          <input
            type="text"
            value={profile.handle}
            onChange={(e) => onChange({ ...profile, handle: e.target.value })}
            placeholder="Ej. @tumarca"
            className="w-full px-3 py-2 text-sm bg-[#121419] border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Verified Badge */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-2">
          Insignia de verificado
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {BADGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...profile, verified: opt.value })}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                profile.verified === opt.value
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                  : 'bg-[#121419] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.value !== 'none' && <CreatorBadge type={opt.value} size={13} />}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Watermark Settings */}
      <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">Marca de agua en lienzo</span>
          <button
            type="button"
            onClick={() => onChange({ ...profile, showWatermark: !profile.showWatermark })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              profile.showWatermark
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {profile.showWatermark ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {profile.showWatermark ? 'Visible' : 'Oculta'}
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Posición</label>
          <select
            value={profile.watermarkPosition}
            onChange={(e) =>
              onChange({ ...profile, watermarkPosition: e.target.value as WatermarkPosition })
            }
            className="w-full px-3 py-2 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {POSITION_OPTIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Opacidad</span>
            <span className="font-mono tabular-nums text-slate-200">
              {Math.round(profile.watermarkOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.15}
            max={1}
            step={0.05}
            value={profile.watermarkOpacity}
            onChange={(e) =>
              onChange({ ...profile, watermarkOpacity: parseFloat(e.target.value) })
            }
            className="w-full accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
