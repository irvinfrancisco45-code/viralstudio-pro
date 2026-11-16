import React from 'react';
import { MemeSocialData, NewsData, ProceduralTemplate } from '../types';

interface ContentInspectorProps {
  template: ProceduralTemplate;
  memeData: MemeSocialData;
  newsData: NewsData;
  onChangeMemeData: (patch: Partial<MemeSocialData>) => void;
  onChangeNewsData: (patch: Partial<NewsData>) => void;
}

export const ContentInspector: React.FC<ContentInspectorProps> = ({
  template,
  memeData,
  newsData,
  onChangeMemeData,
  onChangeNewsData,
}) => {
  if (template.category === 'news') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Contenido de Noticia</h3>
            <p className="text-xs text-slate-400">{template.subCategory}</p>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={newsData.isLive}
              onChange={(e) => onChangeNewsData({ isLive: e.target.checked })}
              className="rounded accent-rose-500"
            />
            Etiqueta EN VIVO
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Canal / Medio</label>
            <input
              type="text"
              value={newsData.channelName}
              onChange={(e) => onChangeNewsData({ channelName: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Cintillo / Alerta</label>
            <input
              type="text"
              value={newsData.breakingTag}
              onChange={(e) => onChangeNewsData({ breakingTag: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Titular Principal
          </label>
          <textarea
            rows={2}
            value={newsData.headline}
            onChange={(e) => onChangeNewsData({ headline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Subtítulo / Bajada
          </label>
          <textarea
            rows={2}
            value={newsData.subheadline}
            onChange={(e) => onChangeNewsData({ subheadline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Ticker Inferior (ÚLTIMA HORA)
          </label>
          <textarea
            rows={2}
            value={newsData.tickerText}
            onChange={(e) => onChangeNewsData({ tickerText: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Reloj</label>
            <input
              type="text"
              value={newsData.clockText}
              onChange={(e) => onChangeNewsData({ clockText: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#121419] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Ubicación</label>
            <input
              type="text"
              value={newsData.locationText}
              onChange={(e) => onChangeNewsData({ locationText: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Etiqueta reportero</label>
            <input
              type="text"
              value={newsData.reporterTag}
              onChange={(e) => onChangeNewsData({ reporterTag: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
        </div>
      </div>
    );
  }

  // Meme & Social Content
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">Contenido Social / Meme</h3>
        <p className="text-xs text-slate-400">
          {template.subCategory} · {template.themeName}
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Texto de la publicación / Título
        </label>
        <textarea
          rows={3}
          value={memeData.socialCaption}
          onChange={(e) => onChangeMemeData({ socialCaption: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {template.panelCount > 1 && (
        <div className="p-3 bg-[#121419] border border-slate-800/80 rounded-xl space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-200">
            Textos por panel ({template.panelCount})
          </h4>
          {Array.from({ length: template.panelCount }, (_, idx) => (
            <div key={idx}>
              <label className="block text-[11px] text-slate-400 mb-1">
                Panel {idx + 1}
              </label>
              <input
                type="text"
                value={memeData.panelCaptions[idx] || ''}
                onChange={(e) => {
                  const next = [...memeData.panelCaptions];
                  next[idx] = e.target.value;
                  onChangeMemeData({ panelCaptions: next });
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
              />
            </div>
          ))}
        </div>
      )}

      {template.memeLayout === 'quote-card' && (
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Autor de la cita</label>
          <input
            type="text"
            value={memeData.quoteAuthor}
            onChange={(e) => onChangeMemeData({ quoteAuthor: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100"
          />
        </div>
      )}

      {template.memeLayout === 'reddit-card' && (
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Comunidad Subreddit</label>
          <input
            type="text"
            value={memeData.subreddit}
            onChange={(e) => onChangeMemeData({ subreddit: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100"
          />
        </div>
      )}

      {/* Editable Social Metrics */}
      <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3">
        <h4 className="text-xs font-semibold text-slate-200">Métricas editables de red social</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Me gusta / Likes</label>
            <input
              type="text"
              value={memeData.likesCount}
              onChange={(e) => onChangeMemeData({ likesCount: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">RTs / Compartidos</label>
            <input
              type="text"
              value={memeData.sharesCount}
              onChange={(e) => onChangeMemeData({ sharesCount: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Comentarios</label>
            <input
              type="text"
              value={memeData.commentsCount}
              onChange={(e) => onChangeMemeData({ commentsCount: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Vistas</label>
            <input
              type="text"
              value={memeData.viewsCount}
              onChange={(e) => onChangeMemeData({ viewsCount: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Fecha y hora</label>
          <input
            type="text"
            value={memeData.timestampText}
            onChange={(e) => onChangeMemeData({ timestampText: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
