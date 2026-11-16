import React, { useRef, useState } from 'react';
import {
  AspectRatio,
  CreatorProfile,
  FontFamilyOption,
  ImageSlotState,
  ProceduralTemplate,
  StudioDocument,
  TextLayer,
} from '../types';
import { CreatorBadge } from './CreatorBadge';
import {
  BatteryCharging,
  Bookmark,
  Camera,
  Check,
  CheckCheck,
  ChevronLeft,
  Heart,
  Info,
  MessageCircle,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Play,
  Plus,
  Repeat2,
  Share2,
  Smile,
  ThumbsUp,
  Video,
  Wifi,
} from 'lucide-react';

interface CanvasPreviewProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  template: ProceduralTemplate;
  doc: StudioDocument;
  creatorProfile: CreatorProfile;
  zoom: number;
  showGuides: boolean;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onUpdateTextLayer: (id: string, patch: Partial<TextLayer>) => void;
  onUpdateImageSlot: (slotId: string, patch: Partial<ImageSlotState>) => void;
  isExporting?: boolean;
}

export const CANVAS_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 540, height: 540 },
  '4:5': { width: 500, height: 625 },
  '9:16': { width: 410, height: 728 },
  '16:9': { width: 640, height: 360 },
};

function resolveFontFamily(font: FontFamilyOption): string {
  switch (font) {
    case 'Impact':
      return "'Oswald', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
    case 'Montserrat':
      return "'Montserrat', sans-serif";
    case 'Playfair Display':
      return "'Playfair Display', Georgia, serif";
    case 'Courier Prime':
      return "'Courier Prime', monospace";
    case 'Oswald':
      return "'Oswald', sans-serif";
    default:
      return "'Plus Jakarta Sans', system-ui, sans-serif";
  }
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  canvasRef,
  template,
  doc,
  creatorProfile,
  zoom,
  showGuides,
  selectedTextId,
  onSelectText,
  onUpdateTextLayer,
  onUpdateImageSlot,
  isExporting = false,
}) => {
  const dims = CANVAS_DIMENSIONS[doc.aspectRatio];
  const [snapX, setSnapX] = useState(false);
  const [snapY, setSnapY] = useState(false);
  const dragModeRef = useRef<'none' | 'text' | 'image'>('none');

  const handleTextPointerDown = (e: React.PointerEvent, layer: TextLayer) => {
    e.stopPropagation();
    onSelectText(layer.id);
    dragModeRef.current = 'text';

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = layer.x;
    const origY = layer.y;

    const onMove = (moveEvt: PointerEvent) => {
      if (dragModeRef.current !== 'text') return;
      const dx = ((moveEvt.clientX - startX) / (dims.width * zoom)) * 100;
      const dy = ((moveEvt.clientY - startY) / (dims.height * zoom)) * 100;

      let nextX = Math.max(4, Math.min(96, origX + dx));
      let nextY = Math.max(4, Math.min(96, origY + dy));

      if (Math.abs(nextX - 50) < 2.2) {
        nextX = 50;
        setSnapX(true);
      } else {
        setSnapX(false);
      }

      if (Math.abs(nextY - 50) < 2.2) {
        nextY = 50;
        setSnapY(true);
      } else {
        setSnapY(false);
      }

      onUpdateTextLayer(layer.id, { x: Number(nextX.toFixed(1)), y: Number(nextY.toFixed(1)) });
    };

    const onUp = () => {
      dragModeRef.current = 'none';
      setSnapX(false);
      setSnapY(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleImagePointerDown = (e: React.PointerEvent, slot: ImageSlotState) => {
    e.stopPropagation();
    onSelectText(null);
    dragModeRef.current = 'image';

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = slot.offsetX;
    const origY = slot.offsetY;

    const onMove = (moveEvt: PointerEvent) => {
      if (dragModeRef.current !== 'image') return;
      const dx = (moveEvt.clientX - startX) / zoom;
      const dy = (moveEvt.clientY - startY) / zoom;
      onUpdateImageSlot(slot.id, {
        offsetX: Math.round(Math.max(-200, Math.min(200, origX + dx))),
        offsetY: Math.round(Math.max(-200, Math.min(200, origY + dy))),
      });
    };

    const onUp = () => {
      dragModeRef.current = 'none';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const renderManagedImage = (slot: ImageSlotState, className = 'w-full h-full') => {
    if (!slot) return null;
    return (
      <div
        onPointerDown={(e) => handleImagePointerDown(e, slot)}
        className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none bg-slate-900 ${className}`}
      >
        <img
          src={slot.dataUrl}
          alt={slot.label}
          referrerPolicy="no-referrer"
          draggable={false}
          className="w-full h-full object-cover pointer-events-none"
          style={{
            transform: `translate(${slot.offsetX}px, ${slot.offsetY}px) scale(${slot.scale}) rotate(${slot.rotation}deg)`,
            filter: `brightness(${slot.brightness}%) contrast(${slot.contrast}%) grayscale(${slot.grayscale}%) saturate(${slot.saturate}%)`,
            transformOrigin: 'center center',
          }}
        />
      </div>
    );
  };

  const renderWatermarkOverlay = () => {
    if (!creatorProfile.showWatermark || creatorProfile.watermarkPosition === 'integrated') {
      return null;
    }

    const posClass =
      creatorProfile.watermarkPosition === 'top-left'
        ? 'top-3 left-3'
        : creatorProfile.watermarkPosition === 'top-right'
          ? 'top-3 right-3'
          : creatorProfile.watermarkPosition === 'bottom-left'
            ? 'bottom-3 left-3'
            : creatorProfile.watermarkPosition === 'bottom-right'
              ? 'bottom-3 right-3'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

    return (
      <div
        className={`absolute ${posClass} z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/55 border border-white/15 text-white shadow-sm`}
        style={{ opacity: creatorProfile.watermarkOpacity }}
      >
        {creatorProfile.avatarDataUrl && (
          <img
            src={creatorProfile.avatarDataUrl}
            alt={creatorProfile.name}
            referrerPolicy="no-referrer"
            className={`w-4 h-4 object-cover ${
              creatorProfile.avatarShape === 'circle' ? 'rounded-full' : 'rounded-xs'
            }`}
          />
        )}
        <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
          {creatorProfile.handle || creatorProfile.name}
        </span>
        <CreatorBadge type={creatorProfile.verified} size={12} />
      </div>
    );
  };

  const renderMemeContent = () => {
    const { palette, memeLayout } = template;
    const { memeData, images } = doc;
    const primarySlot = images[0];
    const avatarClass =
      creatorProfile.avatarShape === 'circle' ? 'rounded-full' : 'rounded-lg';

    if (memeLayout === 'x-tweet') {
      return (
        <div
          className="w-full h-full flex flex-col justify-between p-6"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={creatorProfile.avatarDataUrl}
                  alt={creatorProfile.name}
                  referrerPolicy="no-referrer"
                  className={`w-11 h-11 object-cover border ${avatarClass}`}
                  style={{ borderColor: palette.border }}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[15px] leading-tight">
                      {creatorProfile.name}
                    </span>
                    <CreatorBadge
                      type={
                        creatorProfile.verified !== 'none'
                          ? creatorProfile.verified
                          : template.badgeStyle
                      }
                      size={16}
                    />
                  </div>
                  <p className="text-[13px]" style={{ color: palette.muted }}>
                    {creatorProfile.handle}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5" style={{ color: palette.muted }} />
            </div>

            <p className="text-[16px] leading-snug font-normal whitespace-pre-wrap">
              {memeData.socialCaption}
            </p>

            <div
              className="w-full rounded-2xl overflow-hidden border"
              style={{
                borderColor: palette.border,
                height: doc.aspectRatio === '16:9' ? 145 : doc.aspectRatio === '4:5' ? 320 : 250,
              }}
            >
              {renderManagedImage(primarySlot)}
            </div>
          </div>

          <div className="pt-3 border-t space-y-2.5" style={{ borderColor: palette.border }}>
            <div className="text-[12px] flex items-center gap-2" style={{ color: palette.muted }}>
              <span>{memeData.timestampText}</span>
              <span>·</span>
              <span className="font-semibold" style={{ color: palette.text }}>
                {memeData.viewsCount}
              </span>
              <span>Reproducciones</span>
            </div>

            <div
              className="flex items-center justify-between pt-2 border-t text-[13px] tabular-nums"
              style={{ borderColor: palette.border, color: palette.muted }}
            >
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                {memeData.commentsCount}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Repeat2 className="w-4 h-4" />
                {memeData.sharesCount}
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-500 font-medium">
                <Heart className="w-4 h-4 fill-rose-500" />
                {memeData.likesCount}
              </span>
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    }

    if (memeLayout === 'instagram-post') {
      return (
        <div
          className="w-full h-full flex flex-col"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between border-b"
            style={{ borderColor: palette.border }}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600">
                <img
                  src={creatorProfile.avatarDataUrl}
                  alt={creatorProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border-2 border-black/10"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">{creatorProfile.handle.replace('@', '')}</span>
                  <CreatorBadge type={creatorProfile.verified} size={13} />
                </div>
                <p className="text-[10px]" style={{ color: palette.muted }}>
                  Audio original
                </p>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4" style={{ color: palette.muted }} />
          </div>

          <div className="flex-1 min-h-0">{renderManagedImage(primarySlot)}</div>

          <div className="px-4 py-3 space-y-1.5" style={{ backgroundColor: palette.bg }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <MessageCircle className="w-5 h-5" />
                <Share2 className="w-5 h-5" />
              </div>
              <Bookmark className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold tabular-nums">{memeData.likesCount} Me gusta</p>
            <p className="text-xs leading-snug line-clamp-2">
              <span className="font-bold mr-1.5">{creatorProfile.handle.replace('@', '')}</span>
              {memeData.socialCaption}
            </p>
          </div>
        </div>
      );
    }

    if (memeLayout === 'facebook-post') {
      return (
        <div
          className="w-full h-full flex flex-col justify-between"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={creatorProfile.avatarDataUrl}
                  alt={creatorProfile.name}
                  referrerPolicy="no-referrer"
                  className={`w-10 h-10 object-cover ${avatarClass}`}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{creatorProfile.name}</span>
                    <CreatorBadge type={creatorProfile.verified} size={14} />
                  </div>
                  <p className="text-[11px]" style={{ color: palette.muted }}>
                    {memeData.timestampText} · Público
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5" style={{ color: palette.muted }} />
            </div>
            <p className="text-sm leading-snug line-clamp-3">{memeData.socialCaption}</p>
          </div>

          <div className="flex-1 min-h-0">{renderManagedImage(primarySlot)}</div>

          <div className="px-4 py-2.5 border-t space-y-2" style={{ borderColor: palette.border }}>
            <div className="flex items-center justify-between text-xs tabular-nums" style={{ color: palette.muted }}>
              <span className="inline-flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[9px]">
                  👍
                </span>
                {memeData.likesCount}
              </span>
              <span>
                {memeData.commentsCount} comentarios · {memeData.sharesCount} veces compartido
              </span>
            </div>
            <div className="grid grid-cols-3 pt-1.5 border-t text-xs font-semibold" style={{ borderColor: palette.border, color: palette.muted }}>
              <span className="flex items-center justify-center gap-1.5">
                <ThumbsUp className="w-4 h-4" /> Me gusta
              </span>
              <span className="flex items-center justify-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> Comentar
              </span>
              <span className="flex items-center justify-center gap-1.5">
                <Share2 className="w-4 h-4" /> Compartir
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (memeLayout === 'reddit-card') {
      return (
        <div
          className="w-full h-full flex flex-col p-4 gap-3"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                r/
              </div>
              <div>
                <p className="text-xs font-bold">{memeData.subreddit}</p>
                <p className="text-[10px]" style={{ color: palette.muted }}>
                  Publicado por {creatorProfile.handle} · hace 2 h
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-600 text-white">
              Unirse
            </span>
          </div>
          <h3 className="text-[15px] font-bold leading-snug">{memeData.socialCaption}</h3>
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden border" style={{ borderColor: palette.border }}>
            {renderManagedImage(primarySlot)}
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold tabular-nums" style={{ color: palette.muted }}>
            <span className="px-2.5 py-1 rounded-full border" style={{ borderColor: palette.border }}>
              ▲ {memeData.likesCount} ▼
            </span>
            <span className="px-2.5 py-1 rounded-full border inline-flex items-center gap-1" style={{ borderColor: palette.border }}>
              <MessageCircle className="w-3.5 h-3.5" /> {memeData.commentsCount}
            </span>
            <span className="px-2.5 py-1 rounded-full border inline-flex items-center gap-1" style={{ borderColor: palette.border }}>
              <Share2 className="w-3.5 h-3.5" /> Compartir
            </span>
          </div>
        </div>
      );
    }

    if (memeLayout === 'tiktok-overlay') {
      return (
        <div className="w-full h-full relative bg-black text-white">
          {renderManagedImage(primarySlot, 'w-full h-full')}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          {/* Right Action Column */}
          <div className="absolute right-3 bottom-14 flex flex-col items-center gap-4 z-20 pointer-events-none">
            <div className="relative">
              <img
                src={creatorProfile.avatarDataUrl}
                alt={creatorProfile.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                +
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-7 h-7 fill-white text-white drop-shadow" />
              <span className="text-[11px] font-semibold tabular-nums">{memeData.likesCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-7 h-7 fill-white text-white drop-shadow" />
              <span className="text-[11px] font-semibold tabular-nums">{memeData.commentsCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <Bookmark className="w-7 h-7 fill-white text-white drop-shadow" />
              <span className="text-[11px] font-semibold tabular-nums">4.1K</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-7 h-7 text-white drop-shadow" />
              <span className="text-[11px] font-semibold tabular-nums">{memeData.sharesCount}</span>
            </div>
          </div>

          {/* Bottom Caption */}
          <div className="absolute left-4 right-16 bottom-4 z-20 space-y-1 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">{creatorProfile.handle}</span>
              <CreatorBadge type={creatorProfile.verified} size={14} />
            </div>
            <p className="text-xs leading-snug text-white/95 line-clamp-2">
              {memeData.socialCaption}
            </p>
          </div>
        </div>
      );
    }

    if (memeLayout === 'quote-card') {
      return (
        <div
          className="w-full h-full relative flex flex-col justify-between p-8"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {renderManagedImage(primarySlot)}
          </div>
          <div className="relative z-10 flex items-center gap-2.5">
            <img
              src={creatorProfile.avatarDataUrl}
              alt={creatorProfile.name}
              referrerPolicy="no-referrer"
              className={`w-9 h-9 object-cover border ${avatarClass}`}
              style={{ borderColor: palette.accent }}
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold">{creatorProfile.name}</span>
                <CreatorBadge type={creatorProfile.verified} size={13} />
              </div>
              <p className="text-[11px]" style={{ color: palette.muted }}>
                {creatorProfile.handle}
              </p>
            </div>
          </div>

          <div className="relative z-10 my-auto space-y-4">
            <span
              className="block text-5xl font-serif leading-none"
              style={{ color: palette.accent }}
            >
              “
            </span>
            <p
              className="text-2xl font-bold leading-snug"
              style={{ fontFamily: resolveFontFamily(template.defaultFont) }}
            >
              {memeData.socialCaption}
            </p>
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: palette.accent }} />
            <p className="text-sm font-medium" style={{ color: palette.muted }}>
              — {memeData.quoteAuthor}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs" style={{ color: palette.muted }}>
            <span>{template.themeName}</span>
            <span className="tabular-nums">{memeData.timestampText}</span>
          </div>
        </div>
      );
    }

    if (memeLayout === 'split-2' || memeLayout === 'grid-3' || memeLayout === 'grid-4') {
      const gridClass =
        memeLayout === 'split-2'
          ? 'grid-cols-2 grid-rows-1'
          : memeLayout === 'grid-3'
            ? 'grid-cols-1 grid-rows-3'
            : 'grid-cols-2 grid-rows-2';

      return (
        <div
          className="w-full h-full flex flex-col p-3 gap-2.5"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div className="flex items-center justify-between px-1">
            <span
              className="text-sm font-bold tracking-tight"
              style={{ fontFamily: resolveFontFamily(template.defaultFont) }}
            >
              {memeData.socialCaption.slice(0, 58)}
            </span>
            <span className="text-[11px] font-medium shrink-0" style={{ color: palette.muted }}>
              {creatorProfile.handle}
            </span>
          </div>

          <div className={`flex-1 min-h-0 grid ${gridClass} gap-2`}>
            {images.map((slot, idx) => (
              <div
                key={slot.id}
                className="relative rounded-lg overflow-hidden border"
                style={{ borderColor: palette.border }}
              >
                {renderManagedImage(slot)}
                {memeData.panelCaptions[idx] && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-2.5 py-2 pointer-events-none">
                    <p className="text-xs font-bold text-white text-center drop-shadow">
                      {memeData.panelCaptions[idx]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (memeLayout === 'reaction-card') {
      return (
        <div
          className="w-full h-full flex flex-col p-4 gap-3"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: palette.surface, borderColor: palette.border }}
          >
            <p className="text-base font-bold leading-snug text-center">
              {memeData.socialCaption}
            </p>
          </div>
          <div
            className="flex-1 min-h-0 rounded-xl overflow-hidden border"
            style={{ borderColor: palette.border }}
          >
            {renderManagedImage(primarySlot)}
          </div>
        </div>
      );
    }

    // impact-classic default
    return (
      <div
        className="w-full h-full relative"
        style={{ backgroundColor: palette.bg }}
      >
        {renderManagedImage(primarySlot)}
      </div>
    );
  };

  const renderNewsContent = () => {
    const { palette, newsStyle } = template;
    const { newsData, images } = doc;
    const primarySlot = images[0];

    if (newsStyle === 'vintage-newspaper') {
      return (
        <div
          className="w-full h-full flex flex-col p-5 gap-3"
          style={{ backgroundColor: '#F3EFE6', color: '#1C1917' }}
        >
          <div className="border-b-4 border-double border-stone-900 pb-2 text-center">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-stone-600 mb-1">
              <span>{newsData.locationText}</span>
              <span>EDICIÓN ESPECIAL</span>
              <span className="tabular-nums">{newsData.clockText}</span>
            </div>
            <h2
              className="text-2xl font-extrabold tracking-tight uppercase"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {newsData.channelName || 'EL DIARIO NACIONAL'}
            </h2>
          </div>

          <h1
            className="text-xl font-extrabold leading-tight text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {newsData.headline}
          </h1>

          <div
            className="flex-1 min-h-0 border border-stone-800 overflow-hidden"
            style={{ filter: 'grayscale(100%) contrast(110%)' }}
          >
            {renderManagedImage(primarySlot)}
          </div>

          <p
            className="text-xs leading-relaxed text-stone-800 border-t border-stone-400 pt-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {newsData.subheadline}
          </p>
        </div>
      );
    }

    const accentColor =
      newsStyle === 'bbc-world'
        ? '#B91C1C'
        : newsStyle === 'sports-alert'
          ? '#10B981'
          : newsStyle === 'tech-flash'
            ? '#4F46E5'
            : newsStyle === 'entertainment'
              ? '#EC4899'
              : palette.accent;

    return (
      <div className="w-full h-full relative bg-slate-950 text-white overflow-hidden">
        {renderManagedImage(primarySlot)}

        {/* Contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/45 pointer-events-none" />

        {/* Top Broadcast Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
            {newsData.isLive && (
              <span
                className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-xs text-white"
                style={{ backgroundColor: '#DC2626' }}
              >
                EN VIVO
              </span>
            )}
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase bg-black/75 backdrop-blur-sm border border-white/15 rounded-xs">
              {newsData.channelName || creatorProfile.name}
            </span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-0.5 bg-black/75 backdrop-blur-sm border border-white/15 rounded-xs text-[11px] font-mono tabular-nums">
            <span>{newsData.locationText}</span>
            <span className="text-white/40">|</span>
            <span className="font-bold">{newsData.clockText}</span>
          </div>
        </div>

        {/* Lower Third Broadcast Graphics */}
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
          <div className="px-4 pb-2.5 space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow"
                style={{ backgroundColor: accentColor }}
              >
                {newsData.breakingTag || 'ÚLTIMA HORA'}
              </span>
              {newsData.reporterTag && (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-white/15 backdrop-blur-sm text-white">
                  {newsData.reporterTag}
                </span>
              )}
            </div>

            <div className="bg-slate-950/90 border-l-4 px-3.5 py-2.5 backdrop-blur-md" style={{ borderColor: accentColor }}>
              <h2
                className="text-lg font-extrabold leading-tight uppercase tracking-tight text-white"
                style={{ fontFamily: resolveFontFamily(template.defaultFont) }}
              >
                {newsData.headline}
              </h2>
              {newsData.subheadline && (
                <p className="text-xs text-slate-200 mt-1 leading-snug line-clamp-2">
                  {newsData.subheadline}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Ticker */}
          <div
            className="px-3.5 py-1.5 flex items-center gap-2.5 text-[11px] font-semibold"
            style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
          >
            <span className="px-1.5 py-0.5 bg-black/30 rounded-xs font-extrabold uppercase text-[9px] shrink-0">
              FLASH
            </span>
            <p className="truncate">{newsData.tickerText}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderChatContent = () => {
    const platform = template.chatPlatform || 'whatsapp-ios';
    const { chatData } = doc;
    const isDark = chatData.darkMode;
    const isWa = platform.startsWith('whatsapp');
    const isIg = platform === 'instagram-dm';
    const isTg = platform === 'telegram';
    const isImessage = platform === 'imessage';
    const isMessenger = platform === 'messenger';

    const bgStyle: React.CSSProperties = chatData.customWallpaper
      ? {
          backgroundImage: `url(${chatData.customWallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : chatData.wallpaperStyle === 'gradient'
        ? {
            background: isDark
              ? 'linear-gradient(160deg, #0f172a, #1e1b4b, #09090b)'
              : 'linear-gradient(160deg, #e0e7ff, #f0fdf4, #fdf2f8)',
          }
        : {
            backgroundColor: isWa
              ? isDark
                ? '#0B141A'
                : '#EFEAE2'
              : isDark
                ? '#09090B'
                : '#FFFFFF',
          };

    const headerBg = isWa
      ? isDark
        ? '#202C33'
        : platform === 'whatsapp-android'
          ? '#008069'
          : '#F6F6F6'
      : isDark
        ? '#121418'
        : '#FFFFFF';

    const headerText = isWa
      ? platform === 'whatsapp-android' && !isDark
        ? '#FFFFFF'
        : isDark
          ? '#E9EDEF'
          : '#111B21'
      : isDark
        ? '#F8FAFC'
        : '#0F172A';

    const bubbleMeBg = isWa
      ? isDark
        ? '#005C4B'
        : '#D9FDD3'
      : isIg
        ? '#4F46E5'
        : isTg
          ? isDark
            ? '#2B5278'
            : '#EFFDDE'
          : isMessenger
            ? '#0084FF'
            : '#007AFF';

    const bubbleMeText =
      isWa && !isDark
        ? '#111B21'
        : isTg && !isDark
          ? '#0F172A'
          : '#FFFFFF';

    const bubbleOtherBg = isWa
      ? isDark
        ? '#202C33'
        : '#FFFFFF'
      : isDark
        ? '#26262A'
        : '#F1F5F9';

    const bubbleOtherText = isDark ? '#F1F5F9' : '#0F172A';

    return (
      <div
        className={`w-full h-full flex flex-col ${
          chatData.wallpaperStyle === 'doodle' && !chatData.customWallpaper
            ? 'whatsapp-doodle-bg'
            : ''
        }`}
        style={bgStyle}
      >
        {/* Top Phone Status Bar */}
        <div
          className="px-4 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold select-none shrink-0"
          style={{ backgroundColor: headerBg, color: headerText }}
        >
          <span className="font-mono tabular-nums">{chatData.phoneTime}</span>
          <div className="flex items-center gap-1.5">
            {/* Signal Bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              {[1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="w-0.5 rounded-xs"
                  style={{
                    height: `${bar * 25}%`,
                    backgroundColor: headerText,
                    opacity: bar <= chatData.signalStrength ? 1 : 0.28,
                  }}
                />
              ))}
            </div>
            {chatData.wifiActive && <Wifi className="w-3.5 h-3.5" />}
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono tabular-nums">
                {chatData.batteryPercent}%
              </span>
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Platform Header */}
        <div
          className="px-3 py-2 flex items-center justify-between border-b shrink-0"
          style={{
            backgroundColor: headerBg,
            color: headerText,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <div className="relative shrink-0">
              <img
                src={chatData.contactAvatar}
                alt={chatData.contactName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover"
              />
              {isMessenger && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-tight truncate">
                {chatData.contactName}
              </p>
              <p
                className="text-[11px] truncate"
                style={{
                  color:
                    chatData.statusText === 'escribiendo...'
                      ? '#10B981'
                      : headerText,
                  opacity: chatData.statusText === 'escribiendo...' ? 1 : 0.72,
                }}
              >
                {chatData.statusText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isIg || isMessenger || isWa || isImessage ? (
              <>
                <Video className="w-4 h-4" />
                <Phone className="w-4 h-4" />
              </>
            ) : null}
            {isIg ? (
              <Info className="w-4 h-4" />
            ) : (
              <MoreVertical className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto studio-scroll px-3.5 py-3 space-y-2.5">
          {chatData.messages.map((msg) => {
            const isMe = msg.sender === 'me';
            const bubbleBg = isMe ? bubbleMeBg : bubbleOtherBg;
            const bubbleText = isMe ? bubbleMeText : bubbleOtherText;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[82%] px-3 py-2 shadow-xs ${
                    isMe
                      ? 'rounded-2xl rounded-tr-sm'
                      : 'rounded-2xl rounded-tl-sm'
                  }`}
                  style={{ backgroundColor: bubbleBg, color: bubbleText }}
                >
                  {!isMe && chatData.isGroup && msg.senderName && (
                    <p
                      className="text-[11px] font-bold mb-0.5"
                      style={{
                        color: msg.sender === 'other2' ? '#F59E0B' : '#10B981',
                      }}
                    >
                      {msg.senderName}
                    </p>
                  )}

                  {msg.replyToText && (
                    <div
                      className="mb-1.5 px-2 py-1 rounded-md border-l-2 text-[11px] opacity-85"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.12)',
                        borderColor: '#10B981',
                      }}
                    >
                      <p className="font-bold text-[10px]">{msg.replyToSender}</p>
                      <p className="truncate">{msg.replyToText}</p>
                    </div>
                  )}

                  {msg.type === 'image' && msg.imageDataUrl && (
                    <div className="mb-1.5 rounded-lg overflow-hidden">
                      <img
                        src={msg.imageDataUrl}
                        alt="Adjunto"
                        referrerPolicy="no-referrer"
                        className="max-h-44 w-full object-cover"
                      />
                    </div>
                  )}

                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-2.5 py-0.5 min-w-[175px]">
                      <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center shrink-0">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <div className="flex-1 flex items-center gap-0.5 h-5">
                        {[40, 75, 55, 95, 60, 80, 45, 90, 65, 50, 85, 40, 70, 50].map(
                          (h, idx) => (
                            <span
                              key={idx}
                              className="w-1 rounded-full bg-current opacity-70"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                      <span className="text-[10px] font-mono tabular-nums opacity-85">
                        {msg.voiceDuration || '0:15'}
                      </span>
                    </div>
                  )}

                  {msg.type !== 'voice' && msg.text && (
                    <p className="text-[13px] leading-snug whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 opacity-75">
                    <span className="text-[10px] font-mono tabular-nums">
                      {msg.time}
                    </span>
                    {isMe && !isImessage && (
                      <span>
                        {msg.status === 'sent' ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <CheckCheck
                            className="w-3.5 h-3.5"
                            style={{
                              color:
                                msg.status === 'read' ? '#38BDF8' : 'currentColor',
                            }}
                          />
                        )}
                      </span>
                    )}
                  </div>

                  {msg.reaction && (
                    <span
                      className="absolute -bottom-2.5 right-2 px-1.5 py-0.5 rounded-full text-[11px] shadow border"
                      style={{
                        backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                        borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                      }}
                    >
                      {msg.reaction}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Input Bar */}
        <div
          className="px-3 py-2 flex items-center gap-2 border-t shrink-0"
          style={{
            backgroundColor: isDark ? '#14171C' : '#F6F6F6',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            color: isDark ? '#94A3B8' : '#64748B',
          }}
        >
          <Plus className="w-5 h-5 shrink-0" />
          <div
            className="flex-1 px-3 py-1.5 rounded-full text-xs flex items-center justify-between border"
            style={{
              backgroundColor: isDark ? '#202C33' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
            }}
          >
            <span>Mensaje...</span>
            <Smile className="w-4 h-4" />
          </div>
          <Camera className="w-5 h-5 shrink-0" />
          <Mic className="w-5 h-5 shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: dims.width * zoom,
        height: dims.height * zoom,
      }}
      onClick={() => onSelectText(null)}
    >
      <div
        ref={canvasRef}
        className="relative overflow-hidden shadow-2xl select-none"
        style={{
          width: dims.width,
          height: dims.height,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius:
            template.frameVariant === 'rounded'
              ? 18
              : template.frameVariant === 'sharp'
                ? 0
                : 10,
        }}
      >
        {template.category === 'meme' && renderMemeContent()}
        {template.category === 'news' && renderNewsContent()}
        {template.category === 'chat' && renderChatContent()}

        {/* Creator Watermark Overlay */}
        {renderWatermarkOverlay()}

        {/* Alignment Guides (visible only in editor, never exported) */}
        {!isExporting && showGuides && (
          <div className="absolute inset-0 pointer-events-none z-40">
            <div
              className={`absolute inset-y-0 left-1/2 w-px transition-opacity ${
                snapX ? 'bg-indigo-400 opacity-100' : 'bg-indigo-400/20 opacity-60'
              }`}
            />
            <div
              className={`absolute inset-x-0 top-1/2 h-px transition-opacity ${
                snapY ? 'bg-indigo-400 opacity-100' : 'bg-indigo-400/20 opacity-60'
              }`}
            />
          </div>
        )}

        {/* Draggable Text Layers */}
        {doc.textLayers.map((layer) => {
          const isSelected = !isExporting && selectedTextId === layer.id;
          const strokeShadow =
            layer.strokeWidth > 0
              ? `-${layer.strokeWidth}px -${layer.strokeWidth}px 0 ${layer.strokeColor}, ${layer.strokeWidth}px -${layer.strokeWidth}px 0 ${layer.strokeColor}, -${layer.strokeWidth}px ${layer.strokeWidth}px 0 ${layer.strokeColor}, ${layer.strokeWidth}px ${layer.strokeWidth}px 0 ${layer.strokeColor}`
              : '';
          const dropShadow = layer.shadow ? '0 3px 10px rgba(0,0,0,0.65)' : '';
          const combinedShadow = [strokeShadow, dropShadow].filter(Boolean).join(', ');

          const hexBg = layer.bgColor || '#000000';
          const r = parseInt(hexBg.slice(1, 3), 16) || 0;
          const g = parseInt(hexBg.slice(3, 5), 16) || 0;
          const b = parseInt(hexBg.slice(5, 7), 16) || 0;

          return (
            <div
              key={layer.id}
              onPointerDown={(e) => handleTextPointerDown(e, layer)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectText(layer.id);
              }}
              className={`absolute z-30 cursor-move px-3 py-1.5 max-w-[90%] whitespace-pre-wrap break-words rounded-md transition-shadow ${
                isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent' : ''
              }`}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: resolveFontFamily(layer.fontFamily),
                fontSize: `${layer.fontSize}px`,
                fontWeight: layer.fontFamily === 'Impact' || layer.fontFamily === 'Oswald' ? 700 : 700,
                color: layer.color,
                textAlign: layer.align,
                lineHeight: layer.lineHeight,
                textTransform: layer.uppercase ? 'uppercase' : 'none',
                textShadow: combinedShadow || undefined,
                backgroundColor:
                  layer.bgOpacity > 0
                    ? `rgba(${r}, ${g}, ${b}, ${layer.bgOpacity})`
                    : 'transparent',
              }}
            >
              {layer.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
