import React from 'react';
import { ProceduralTemplate } from '../types';

interface TemplateThumbnailProps {
  template: ProceduralTemplate;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ template }) => {
  const { palette, category } = template;

  if (category === 'news') {
    const isNewspaper = template.newsStyle === 'vintage-newspaper';
    return (
      <div
        className="w-full h-24 rounded-md overflow-hidden relative flex flex-col justify-between p-1.5 border"
        style={{ backgroundColor: palette.bg, borderColor: palette.border }}
      >
        <div className="flex items-center justify-between gap-1">
          <span
            className="text-[7px] font-bold px-1 py-0.5 rounded-sm uppercase tracking-wide"
            style={{ backgroundColor: palette.accent, color: '#FFFFFF' }}
          >
            {isNewspaper ? 'DIARIO' : 'EN VIVO'}
          </span>
          <span className="text-[7px] font-mono tabular-nums" style={{ color: palette.muted }}>
            21:14
          </span>
        </div>

        <div
          className="flex-1 my-1 rounded-sm flex items-center justify-center overflow-hidden"
          style={{
            background: isNewspaper
              ? 'linear-gradient(135deg, #d6cfc2, #bfb5a2)'
              : `linear-gradient(135deg, ${palette.surface}, ${palette.accent}33)`,
          }}
        >
          <div className="w-6 h-3 rounded-xs opacity-40" style={{ backgroundColor: palette.text }} />
        </div>

        <div className="space-y-0.5">
          <div
            className="h-1.5 w-4/5 rounded-xs"
            style={{ backgroundColor: palette.text, opacity: 0.85 }}
          />
          <div
            className="h-2 w-full rounded-xs flex items-center px-1"
            style={{ backgroundColor: palette.accent }}
          >
            <div className="h-1 w-3/5 bg-white/90 rounded-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (category === 'chat') {
    const isWa = template.chatPlatform?.startsWith('whatsapp');
    const isIg = template.chatPlatform === 'instagram-dm';
    const isTg = template.chatPlatform === 'telegram';
    const bubbleMe = isWa
      ? palette.isDark
        ? '#005C4B'
        : '#D9FDD3'
      : isIg
        ? '#6366F1'
        : isTg
          ? '#2AABEE'
          : '#007AFF';

    return (
      <div
        className="w-full h-24 rounded-md overflow-hidden flex flex-col border"
        style={{
          backgroundColor: isWa
            ? palette.isDark
              ? '#0B141A'
              : '#EFEAE2'
            : palette.bg,
          borderColor: palette.border,
        }}
      >
        <div
          className="h-4 px-1.5 flex items-center justify-between border-b"
          style={{
            backgroundColor: isWa
              ? palette.isDark
                ? '#202C33'
                : '#008069'
              : palette.surface,
            borderColor: palette.border,
          }}
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div
              className="h-1 w-7 rounded-xs"
              style={{
                backgroundColor: isWa ? '#FFFFFF' : palette.text,
                opacity: 0.85,
              }}
            />
          </div>
          <div className="w-2 h-1 rounded-xs bg-white/40" />
        </div>

        <div className="flex-1 p-1.5 flex flex-col justify-center gap-1">
          <div
            className="self-start h-2.5 w-3/5 rounded-md"
            style={{ backgroundColor: palette.isDark ? '#202C33' : '#FFFFFF' }}
          />
          <div
            className="self-end h-3 w-3/5 rounded-md"
            style={{ backgroundColor: bubbleMe }}
          />
          <div
            className="self-start h-2.5 w-1/2 rounded-md"
            style={{ backgroundColor: palette.isDark ? '#202C33' : '#FFFFFF' }}
          />
        </div>
      </div>
    );
  }

  // Meme / Social thumbnail
  const panels = template.panelCount;
  const isTweet = template.memeLayout === 'x-tweet' || template.memeLayout === 'facebook-post';
  const isQuote = template.memeLayout === 'quote-card';

  return (
    <div
      className="w-full h-24 rounded-md overflow-hidden p-1.5 flex flex-col justify-between border"
      style={{ backgroundColor: palette.bg, borderColor: palette.border }}
    >
      {/* Header miniature */}
      {isTweet || template.headerVariant === 'full' ? (
        <div className="flex items-center gap-1">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: palette.accent }}
          />
          <div className="flex-1 space-y-0.5">
            <div
              className="h-1 w-1/2 rounded-xs"
              style={{ backgroundColor: palette.text, opacity: 0.85 }}
            />
          </div>
        </div>
      ) : (
        <div className="h-1.5 w-3/4 mx-auto rounded-xs" style={{ backgroundColor: palette.text, opacity: 0.7 }} />
      )}

      {/* Content panels */}
      {isQuote ? (
        <div
          className="flex-1 my-1 rounded-sm p-1.5 flex flex-col justify-center items-center gap-1"
          style={{ backgroundColor: palette.surface }}
        >
          <div className="h-1 w-4/5 rounded-xs" style={{ backgroundColor: palette.text }} />
          <div className="h-1 w-3/5 rounded-xs" style={{ backgroundColor: palette.accent }} />
        </div>
      ) : panels === 1 ? (
        <div
          className="flex-1 my-1 rounded-sm"
          style={{
            background: `linear-gradient(135deg, ${palette.surface}, ${palette.accent}40)`,
            border: `1px solid ${palette.border}`,
          }}
        />
      ) : panels === 2 ? (
        <div className="flex-1 my-1 grid grid-cols-2 gap-1">
          <div className="rounded-xs" style={{ backgroundColor: palette.surface, border: `1px solid ${palette.border}` }} />
          <div className="rounded-xs" style={{ backgroundColor: `${palette.accent}35`, border: `1px solid ${palette.border}` }} />
        </div>
      ) : panels === 3 ? (
        <div className="flex-1 my-1 grid grid-cols-3 gap-1">
          <div className="rounded-xs" style={{ backgroundColor: palette.surface }} />
          <div className="rounded-xs" style={{ backgroundColor: `${palette.accent}30` }} />
          <div className="rounded-xs" style={{ backgroundColor: `${palette.secondaryAccent}35` }} />
        </div>
      ) : (
        <div className="flex-1 my-1 grid grid-cols-2 grid-rows-2 gap-0.5">
          <div className="rounded-xs" style={{ backgroundColor: palette.surface }} />
          <div className="rounded-xs" style={{ backgroundColor: `${palette.accent}30` }} />
          <div className="rounded-xs" style={{ backgroundColor: `${palette.secondaryAccent}30` }} />
          <div className="rounded-xs" style={{ backgroundColor: palette.surface }} />
        </div>
      )}

      {/* Footer miniature */}
      <div className="flex items-center justify-between">
        <div className="h-1 w-1/3 rounded-xs" style={{ backgroundColor: palette.muted, opacity: 0.6 }} />
        <div className="h-1.5 w-3 rounded-xs" style={{ backgroundColor: palette.accent }} />
      </div>
    </div>
  );
};
