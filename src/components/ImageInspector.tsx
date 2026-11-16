import React, { useRef, useState } from 'react';
import { Image as ImageIcon, RotateCcw, Upload } from 'lucide-react';
import { AspectRatio, ImageSlotState } from '../types';

interface ImageInspectorProps {
  images: ImageSlotState[];
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  onUpdateSlot: (slotId: string, patch: Partial<ImageSlotState>) => void;
}

const RATIOS: Array<{ value: AspectRatio; label: string; desc: string }> = [
  { value: '1:1', label: '1:1', desc: 'Cuadrado' },
  { value: '4:5', label: '4:5', desc: 'Instagram' },
  { value: '9:16', label: '9:16', desc: 'Historias' },
  { value: '16:9', label: '16:9', desc: 'Noticias' },
];

export const ImageInspector: React.FC<ImageInspectorProps> = ({
  images,
  aspectRatio,
  onChangeAspectRatio,
  onUpdateSlot,
}) => {
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeIndex = Math.min(activeSlotIndex, Math.max(0, images.length - 1));
  const activeSlot = images[safeIndex];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files)
      .slice(0, images.length)
      .forEach((file, idx) => {
        const targetSlot = files.length === 1 ? activeSlot : images[idx];
        if (!targetSlot) return;
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onUpdateSlot(targetSlot.id, {
              dataUrl: reader.result,
              scale: 1,
              offsetX: 0,
              offsetY: 0,
              rotation: 0,
            });
          }
        };
        reader.readAsDataURL(file);
      });
  };

  return (
    <div className="space-y-5">
      {/* Aspect Ratio Switcher */}
      <div>
        <label className="block text-xs font-semibold text-slate-200 mb-2">
          Relación de aspecto del lienzo
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {RATIOS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onChangeAspectRatio(r.value)}
              className={`py-2 px-1.5 rounded-lg border text-center transition-colors ${
                aspectRatio === r.value
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                  : 'bg-[#121419] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold font-mono tabular-nums">{r.label}</div>
              <div className="text-[10px] opacity-80 truncate">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-panel Slot Selector */}
      {images.length > 1 && (
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Seleccionar panel ({images.length} paneles)
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {images.map((slot, idx) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setActiveSlotIndex(idx)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                  safeIndex === idx
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#121419] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {activeSlot && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-center space-y-2 ${
              isDraggingOver
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-slate-700/80 bg-[#121419] hover:border-indigo-500/70'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/15 text-indigo-400 mx-auto flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Arrastra {images.length > 1 ? 'una o varias fotos' : 'tu imagen aquí'} o haz clic
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, WEBP · Arrastra la foto en el lienzo para encuadrarla
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={images.length > 1}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Transform Controls */}
          <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                Encuadre y Transformación
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateSlot(activeSlot.id, {
                    scale: 1,
                    offsetX: 0,
                    offsetY: 0,
                    rotation: 0,
                  })
                }
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
              >
                <RotateCcw className="w-3 h-3" />
                Centrar
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Zoom</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {Math.round(activeSlot.scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.05}
                value={activeSlot.scale}
                onChange={(e) =>
                  onUpdateSlot(activeSlot.id, { scale: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Posición X</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {activeSlot.offsetX}px
                  </span>
                </div>
                <input
                  type="range"
                  min={-150}
                  max={150}
                  value={activeSlot.offsetX}
                  onChange={(e) =>
                    onUpdateSlot(activeSlot.id, { offsetX: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Posición Y</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {activeSlot.offsetY}px
                  </span>
                </div>
                <input
                  type="range"
                  min={-150}
                  max={150}
                  value={activeSlot.offsetY}
                  onChange={(e) =>
                    onUpdateSlot(activeSlot.id, { offsetY: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Rotación</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {activeSlot.rotation}°
                </span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                value={activeSlot.rotation}
                onChange={(e) =>
                  onUpdateSlot(activeSlot.id, { rotation: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Filtros Rápidos</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateSlot(activeSlot.id, {
                    brightness: 100,
                    contrast: 100,
                    grayscale: 0,
                    saturate: 100,
                  })
                }
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Original
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateSlot(activeSlot.id, {
                    grayscale: 100,
                    contrast: 120,
                    brightness: 100,
                    saturate: 100,
                  })
                }
                className="py-1.5 px-2 text-[11px] font-medium rounded-lg bg-[#181B20] border border-slate-800 text-slate-300 hover:border-indigo-500"
              >
                Blanco y Negro
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSlot(activeSlot.id, {
                    grayscale: 0,
                    contrast: 130,
                    brightness: 105,
                    saturate: 135,
                  })
                }
                className="py-1.5 px-2 text-[11px] font-medium rounded-lg bg-[#181B20] border border-slate-800 text-slate-300 hover:border-indigo-500"
              >
                Vívido HD
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSlot(activeSlot.id, {
                    grayscale: 20,
                    contrast: 115,
                    brightness: 95,
                    saturate: 70,
                  })
                }
                className="py-1.5 px-2 text-[11px] font-medium rounded-lg bg-[#181B20] border border-slate-800 text-slate-300 hover:border-indigo-500"
              >
                Cine Oscuro
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { key: 'brightness' as const, label: 'Brillo', min: 50, max: 150, unit: '%' },
                { key: 'contrast' as const, label: 'Contraste', min: 50, max: 160, unit: '%' },
                { key: 'saturate' as const, label: 'Saturación', min: 0, max: 200, unit: '%' },
                { key: 'grayscale' as const, label: 'Blanco y Negro', min: 0, max: 100, unit: '%' },
              ].map((ctrl) => (
                <div key={ctrl.key}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">{ctrl.label}</span>
                    <span className="font-mono tabular-nums text-slate-300">
                      {activeSlot[ctrl.key]}
                      {ctrl.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    value={activeSlot[ctrl.key]}
                    onChange={(e) =>
                      onUpdateSlot(activeSlot.id, {
                        [ctrl.key]: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
