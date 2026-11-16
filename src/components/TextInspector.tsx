import React from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  Plus,
  Trash2,
  Type,
} from 'lucide-react';
import { FontFamilyOption, TextLayer } from '../types';

interface TextInspectorProps {
  textLayers: TextLayer[];
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onAddTextLayer: () => void;
  onUpdateTextLayer: (id: string, patch: Partial<TextLayer>) => void;
  onDeleteTextLayer: (id: string) => void;
  onDuplicateTextLayer: (id: string) => void;
}

const FONT_OPTIONS: FontFamilyOption[] = [
  'Impact',
  'Montserrat',
  'Plus Jakarta Sans',
  'Playfair Display',
  'Courier Prime',
  'Oswald',
];

export const TextInspector: React.FC<TextInspectorProps> = ({
  textLayers,
  selectedTextId,
  onSelectText,
  onAddTextLayer,
  onUpdateTextLayer,
  onDeleteTextLayer,
  onDuplicateTextLayer,
}) => {
  const selectedLayer =
    textLayers.find((l) => l.id === selectedTextId) || textLayers[0] || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Capas de Texto</h3>
          <p className="text-xs text-slate-400">Arrastra los textos sobre el lienzo</p>
        </div>
        <button
          type="button"
          onClick={onAddTextLayer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir Texto
        </button>
      </div>

      {/* Layer list */}
      {textLayers.length === 0 ? (
        <div className="p-6 text-center bg-[#121419] border border-slate-800/80 rounded-xl space-y-2">
          <Type className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-300 font-medium">
            No hay capas de texto flotantes activas
          </p>
          <p className="text-[11px] text-slate-400">
            Pulsa «Añadir Texto» para crear etiquetas Impact, títulos o stickers arrastrables.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-36 overflow-y-auto studio-scroll pr-1">
          {textLayers.map((layer) => {
            const active = selectedLayer?.id === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectText(layer.id)}
                className={`px-3 py-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  active
                    ? 'bg-indigo-600/20 border-indigo-500 text-slate-100'
                    : 'bg-[#121419] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-medium truncate flex-1">
                  {layer.text || 'Texto vacío'}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateTextLayer(layer.id);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title="Duplicar capa"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTextLayer(layer.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                    title="Eliminar capa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Layer Style Controls */}
      {selectedLayer && (
        <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contenido del texto
            </label>
            <textarea
              rows={2}
              value={selectedLayer.text}
              onChange={(e) =>
                onUpdateTextLayer(selectedLayer.id, { text: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Tipografía</label>
              <select
                value={selectedLayer.fontFamily}
                onChange={(e) =>
                  onUpdateTextLayer(selectedLayer.id, {
                    fontFamily: e.target.value as FontFamilyOption,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Tamaño ({selectedLayer.fontSize}px)
              </label>
              <input
                type="range"
                min={12}
                max={72}
                value={selectedLayer.fontSize}
                onChange={(e) =>
                  onUpdateTextLayer(selectedLayer.id, {
                    fontSize: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-indigo-500 mt-1.5"
              />
            </div>
          </div>

          {/* Alignment & Case */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#181B20] rounded-lg border border-slate-800">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateTextLayer(selectedLayer.id, { align })}
                  className={`p-1.5 rounded-md ${
                    selectedLayer.align === align
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {align === 'left' ? (
                    <AlignLeft className="w-3.5 h-3.5" />
                  ) : align === 'center' ? (
                    <AlignCenter className="w-3.5 h-3.5" />
                  ) : (
                    <AlignRight className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateTextLayer(selectedLayer.id, {
                  uppercase: !selectedLayer.uppercase,
                })
              }
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border ${
                selectedLayer.uppercase
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                  : 'bg-[#181B20] border-slate-800 text-slate-400'
              }`}
            >
              MAYÚS
            </button>

            <button
              type="button"
              onClick={() =>
                onUpdateTextLayer(selectedLayer.id, { shadow: !selectedLayer.shadow })
              }
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border ${
                selectedLayer.shadow
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                  : 'bg-[#181B20] border-slate-800 text-slate-400'
              }`}
            >
              Sombra
            </button>
          </div>

          {/* Colors & Stroke */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Color texto</label>
              <input
                type="color"
                value={selectedLayer.color}
                onChange={(e) =>
                  onUpdateTextLayer(selectedLayer.id, { color: e.target.value })
                }
                className="w-full h-8 rounded-md bg-[#181B20] border border-slate-800 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Color borde</label>
              <input
                type="color"
                value={selectedLayer.strokeColor}
                onChange={(e) =>
                  onUpdateTextLayer(selectedLayer.id, { strokeColor: e.target.value })
                }
                className="w-full h-8 rounded-md bg-[#181B20] border border-slate-800 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Contorno ({selectedLayer.strokeWidth}px)
              </label>
              <input
                type="range"
                min={0}
                max={6}
                step={0.5}
                value={selectedLayer.strokeWidth}
                onChange={(e) =>
                  onUpdateTextLayer(selectedLayer.id, {
                    strokeWidth: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-500 mt-2"
              />
            </div>
          </div>

          {/* Line height & Background box */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Interlineado</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {selectedLayer.lineHeight}
                </span>
              </div>
              <input
                type="range"
                min={0.9}
                max={2}
                step={0.05}
                value={selectedLayer.lineHeight}
                onChange={(e) =>
                  onUpdateTextLayer(selectedLayer.id, {
                    lineHeight: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Fondo caja</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {Math.round(selectedLayer.bgOpacity * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={selectedLayer.bgColor}
                  onChange={(e) =>
                    onUpdateTextLayer(selectedLayer.id, { bgColor: e.target.value })
                  }
                  className="w-7 h-6 rounded bg-[#181B20] border border-slate-800 cursor-pointer shrink-0"
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={selectedLayer.bgOpacity}
                  onChange={(e) =>
                    onUpdateTextLayer(selectedLayer.id, {
                      bgOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
