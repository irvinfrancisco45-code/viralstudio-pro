import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toBlob, toJpeg, toPng } from 'html-to-image';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Crosshair,
  Download,
  Image as ImageIcon,
  Layers,
  MessageSquareText,
  Newspaper,
  Redo2,
  RotateCcw,
  Search,
  Sparkles,
  Type,
  Undo2,
  UserCheck,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  AspectRatio,
  CreatorProfile as CreatorProfileType,
  ImageSlotState,
  MemeSocialData,
  NewsData,
  ProceduralTemplate,
  StudioDocument,
  TemplateCategory,
  TextLayer,
} from './types';
import {
  createDocumentForTemplate,
  DEFAULT_CREATOR_PROFILE,
  generateAllTemplates,
  getSubcategoriesForCategory,
  THEME_PALETTES,
} from './utils/templateGenerator';
import { CANVAS_DIMENSIONS, CanvasPreview } from './components/CanvasPreview';
import { TemplateThumbnail } from './components/TemplateThumbnail';
import { CreatorProfile } from './components/CreatorProfile';
import { ChatBuilder } from './components/ChatBuilder';
import { ImageInspector } from './components/ImageInspector';
import { TextInspector } from './components/TextInspector';
import { ContentInspector } from './components/ContentInspector';

const CREATOR_STORAGE_KEY = 'viralstudio_creator_profile_v1';
const PAGE_SIZE = 24;

type RightTab = 'content' | 'images' | 'text' | 'brand';
type MobileDrawerTab = 'templates' | RightTab | null;

function loadSavedCreatorProfile(): CreatorProfileType {
  try {
    const raw = localStorage.getItem(CREATOR_STORAGE_KEY);
    if (!raw) return DEFAULT_CREATOR_PROFILE;
    return { ...DEFAULT_CREATOR_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CREATOR_PROFILE;
  }
}

export default function App() {
  const allTemplates = useMemo(() => generateAllTemplates(), []);

  // Pick compelling initial default template (X/Twitter viral meme #2)
  const initialTemplate = useMemo(
    () => allTemplates.find((t) => t.id === 'meme-0002') || allTemplates[0],
    [allTemplates]
  );

  // History-managed document state (Undo/Redo)
  const [history, setHistory] = useState<{
    past: StudioDocument[];
    present: StudioDocument;
    future: StudioDocument[];
  }>(() => ({
    past: [],
    present: createDocumentForTemplate(initialTemplate),
    future: [],
  }));

  const doc = history.present;

  const activeTemplate = useMemo(
    () => allTemplates.find((t) => t.id === doc.templateId) || allTemplates[0],
    [allTemplates, doc.templateId]
  );

  // Creator Profile with localStorage persistence
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfileType>(loadSavedCreatorProfile);
  useEffect(() => {
    try {
      localStorage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(creatorProfile));
    } catch {
      // Ignore storage quota issues for large custom avatars
    }
  }, [creatorProfile]);

  // Explorer filters & pagination
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('meme');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Todos');
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [page, setPage] = useState(1);

  // Studio UI controls
  const [rightTab, setRightTab] = useState<RightTab>('content');
  const [mobileDrawer, setMobileDrawer] = useState<MobileDrawerTab>(null);
  const [zoom, setZoom] = useState(0.85);
  const [showGuides, setShowGuides] = useState(true);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 3000);
  }, []);

  // Responsive initial zoom calculation
  useEffect(() => {
    const updateAutoZoom = () => {
      const dims = CANVAS_DIMENSIONS[doc.aspectRatio];
      const availW = window.innerWidth < 1024 ? window.innerWidth - 36 : window.innerWidth - 730;
      const availH = window.innerHeight < 1024 ? window.innerHeight - 230 : window.innerHeight - 170;
      const fit = Math.min(availW / dims.width, availH / dims.height, 1);
      setZoom(Math.max(0.42, Math.min(1.1, Number(fit.toFixed(2)))));
    };
    updateAutoZoom();
  }, [doc.aspectRatio]);

  // Undo / Redo helpers
  const commitDoc = useCallback(
    (updater: (prev: StudioDocument) => StudioDocument, recordHistory = true) => {
      setHistory((prev) => {
        const nextPresent = updater(prev.present);
        if (!recordHistory) {
          return { ...prev, present: nextPresent };
        }
        return {
          past: [...prev.past.slice(-24), prev.present],
          present: nextPresent,
          future: [],
        };
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const handleRedo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: prev.future.slice(1),
      };
    });
  }, []);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

  // Filtered Templates
  const subcategories = useMemo(
    () => getSubcategoriesForCategory(activeCategory),
    [activeCategory]
  );

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allTemplates.filter((tpl) => {
      if (tpl.category !== activeCategory) return false;
      if (selectedSubCategory !== 'Todos' && tpl.subCategory !== selectedSubCategory) {
        return false;
      }
      if (selectedTheme !== 'Todos' && tpl.themeName !== selectedTheme) {
        return false;
      }
      if (q) {
        const hay = `${tpl.name} ${tpl.subCategory} ${tpl.themeName} ${tpl.keywords.join(' ')}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [allTemplates, activeCategory, selectedSubCategory, selectedTheme, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedTemplates = useMemo(
    () => filteredTemplates.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredTemplates, safePage]
  );

  // Switch Category Tab
  const handleSelectCategoryTab = (cat: TemplateCategory) => {
    setActiveCategory(cat);
    setSelectedSubCategory('Todos');
    setSelectedTheme('Todos');
    setPage(1);

    // Load a great sample template from that category if current doc is in a different category
    if (activeTemplate.category !== cat) {
      const sampleTpl = allTemplates.find((t) => t.category === cat);
      if (sampleTpl) {
        commitDoc((prev) => createDocumentForTemplate(sampleTpl, prev));
        setRightTab('content');
      }
    }
  };

  const handleSelectTemplate = (tpl: ProceduralTemplate) => {
    commitDoc((prev) => createDocumentForTemplate(tpl, prev));
    setSelectedTextId(null);
    if (window.innerWidth < 1024) {
      setMobileDrawer(null);
    }
  };

  const handleResetDesign = () => {
    commitDoc(() => createDocumentForTemplate(activeTemplate));
    setSelectedTextId(null);
    showToast('Diseño reiniciado a los valores originales');
  };

  // Document mutation handlers
  const handleUpdateImageSlot = useCallback(
    (slotId: string, patch: Partial<ImageSlotState>) => {
      commitDoc((prev) => ({
        ...prev,
        images: prev.images.map((img) => (img.id === slotId ? { ...img, ...patch } : img)),
      }));
    },
    [commitDoc]
  );

  const handleAddTextLayer = () => {
    const id = `txt-${Date.now()}`;
    const newLayer: TextLayer = {
      id,
      text: 'NUEVO TEXTO VIRAL',
      x: 50,
      y: 50,
      fontFamily: activeTemplate.defaultFont || 'Impact',
      fontSize: 30,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      shadow: true,
      align: 'center',
      lineHeight: 1.2,
      bgColor: '#000000',
      bgOpacity: 0,
      uppercase: false,
    };
    commitDoc((prev) => ({
      ...prev,
      textLayers: [...prev.textLayers, newLayer],
    }));
    setSelectedTextId(id);
  };

  const handleUpdateTextLayer = useCallback(
    (id: string, patch: Partial<TextLayer>) => {
      commitDoc((prev) => ({
        ...prev,
        textLayers: prev.textLayers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }));
    },
    [commitDoc]
  );

  const handleDeleteTextLayer = (id: string) => {
    commitDoc((prev) => ({
      ...prev,
      textLayers: prev.textLayers.filter((l) => l.id !== id),
    }));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  const handleDuplicateTextLayer = (id: string) => {
    const source = doc.textLayers.find((l) => l.id === id);
    if (!source) return;
    const copyId = `txt-${Date.now()}`;
    commitDoc((prev) => ({
      ...prev,
      textLayers: [
        ...prev.textLayers,
        {
          ...source,
          id: copyId,
          x: Math.min(90, source.x + 5),
          y: Math.min(90, source.y + 5),
        },
      ],
    }));
    setSelectedTextId(copyId);
  };

  const handleChangeMemeData = (patch: Partial<MemeSocialData>) => {
    commitDoc((prev) => ({
      ...prev,
      memeData: { ...prev.memeData, ...patch },
    }));
  };

  const handleChangeNewsData = (patch: Partial<NewsData>) => {
    commitDoc((prev) => ({
      ...prev,
      newsData: { ...prev.newsData, ...patch },
    }));
  };

  // High-Resolution Export Engine (PNG / JPG / Clipboard)
  const prepareNodeAndCapture = async (mode: 'png' | 'jpg' | 'clipboard') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setSelectedTextId(null);

    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 60)));

    try {
      const node = canvasRef.current;
      const dims = CANVAS_DIMENSIONS[doc.aspectRatio];
      const options = {
        width: dims.width,
        height: dims.height,
        pixelRatio: 2.5,
        cacheBust: false,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      };

      if (mode === 'png') {
        const dataUrl = await toPng(node, options);
        const link = document.createElement('a');
        link.download = `viralstudio-${activeTemplate.id}.png`;
        link.href = dataUrl;
        link.click();
        showToast('Imagen PNG HD descargada');
      } else if (mode === 'jpg') {
        const dataUrl = await toJpeg(node, { ...options, quality: 0.94, backgroundColor: '#0F1115' });
        const link = document.createElement('a');
        link.download = `viralstudio-${activeTemplate.id}.jpg`;
        link.href = dataUrl;
        link.click();
        showToast('Imagen JPG optimizada descargada');
      } else {
        const blob = await toBlob(node, options);
        if (blob && navigator.clipboard && 'ClipboardItem' in window) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          showToast('Imagen copiada al portapapeles');
        } else {
          // Fallback download if clipboard API is restricted
          const dataUrl = await toPng(node, options);
          const link = document.createElement('a');
          link.download = `viralstudio-${activeTemplate.id}.png`;
          link.href = dataUrl;
          link.click();
          showToast('Descargada como PNG (portapapeles no disponible en este contexto)');
        }
      }
    } catch (err) {
      console.error('Export error:', err);
      showToast('No se pudo exportar la imagen. Verifica las fuentes o intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  // Reusable Template Explorer JSX
  const renderTemplateExplorer = () => (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <div className="p-3 border-b border-slate-800/80 space-y-2.5 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#121419] rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleSelectCategoryTab('meme')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-0.5 transition-colors whitespace-nowrap ${
              activeCategory === 'meme'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Memes (1,000)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectCategoryTab('news')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-0.5 transition-colors whitespace-nowrap ${
              activeCategory === 'news'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Noticias (600)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectCategoryTab('chat')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-0.5 transition-colors whitespace-nowrap ${
              activeCategory === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Chats (600)</span>
          </button>
        </div>

        {/* Instant Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar plantilla, red o estilo..."
            className="w-full pl-8 pr-8 py-2 text-xs bg-[#121419] border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Subcategory & Theme Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto studio-scroll pb-1">
          {subcategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => {
                setSelectedSubCategory(sub);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedSubCategory === sub
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#121419] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="tabular-nums">{filteredTemplates.length} variaciones</span>
          <select
            value={selectedTheme}
            onChange={(e) => {
              setSelectedTheme(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 text-[11px] bg-[#121419] border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Todos">Todos los temas</option>
            {(activeCategory === 'chat'
              ? ['Modo Claro', 'Modo Oscuro']
              : THEME_PALETTES.map((p) => p.name)
            ).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="flex-1 overflow-y-auto studio-scroll p-3">
        {paginatedTemplates.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs font-semibold text-slate-300">
              No se encontraron plantillas
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubCategory('Todos');
                setSelectedTheme('Todos');
                setPage(1);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {paginatedTemplates.map((tpl) => {
              const isSelected = tpl.id === doc.templateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`text-left p-2 rounded-xl border transition-all group ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/40'
                      : 'bg-[#121419] border-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <TemplateThumbnail template={tpl} />
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[11px] font-semibold text-slate-100 truncate">
                      {tpl.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {tpl.subCategory} · {tpl.aspectRatio}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="p-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 bg-[#14171C] shrink-0">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="p-1.5 rounded-lg bg-[#1E222A] text-slate-200 hover:bg-[#282D37] disabled:opacity-35 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono tabular-nums text-slate-300">
          Pág. {safePage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="p-1.5 rounded-lg bg-[#1E222A] text-slate-200 hover:bg-[#282D37] disabled:opacity-35 transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Reusable Properties Inspector JSX
  const renderPropertiesPanel = (activeTab: RightTab) => (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-800/80 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#121419] rounded-xl border border-slate-800/80">
          {[
            {
              id: 'content' as RightTab,
              label: activeTemplate.category === 'chat' ? 'Chat' : 'Texto',
              icon: MessageSquareText,
            },
            { id: 'images' as RightTab, label: 'Imagen', icon: ImageIcon },
            { id: 'text' as RightTab, label: 'Capas', icon: Type },
            { id: 'brand' as RightTab, label: 'Marca', icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRightTab(tab.id)}
                className={`py-2 px-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center gap-0.5 transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto studio-scroll p-4">
        {activeTab === 'content' &&
          (activeTemplate.category === 'chat' ? (
            <ChatBuilder
              chatData={doc.chatData}
              onChange={(chatData) => commitDoc((prev) => ({ ...prev, chatData }))}
            />
          ) : (
            <ContentInspector
              template={activeTemplate}
              memeData={doc.memeData}
              newsData={doc.newsData}
              onChangeMemeData={handleChangeMemeData}
              onChangeNewsData={handleChangeNewsData}
            />
          ))}

        {activeTab === 'images' && (
          <ImageInspector
            images={doc.images}
            aspectRatio={doc.aspectRatio}
            onChangeAspectRatio={(ratio: AspectRatio) =>
              commitDoc((prev) => ({ ...prev, aspectRatio: ratio }))
            }
            onUpdateSlot={handleUpdateImageSlot}
          />
        )}

        {activeTab === 'text' && (
          <TextInspector
            textLayers={doc.textLayers}
            selectedTextId={selectedTextId}
            onSelectText={setSelectedTextId}
            onAddTextLayer={handleAddTextLayer}
            onUpdateTextLayer={handleUpdateTextLayer}
            onDeleteTextLayer={handleDeleteTextLayer}
            onDuplicateTextLayer={handleDuplicateTextLayer}
          />
        )}

        {activeTab === 'brand' && (
          <CreatorProfile profile={creatorProfile} onChange={setCreatorProfile} />
        )}
      </div>
    </div>
  );

  const dims = CANVAS_DIMENSIONS[doc.aspectRatio];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0F1115] text-slate-100">
      {/* Top Studio Header Bar */}
      <header className="h-14 px-3 sm:px-5 bg-[#181B20] border-b border-slate-800/90 flex items-center justify-between gap-4 shrink-0 z-30">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow">
            V
          </div>
          <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0">
            ViralStudio Pro
          </span>
        </div>

        {/* Zone 2: History & Reset Actions */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.past.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-[#121419] border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-35 transition-colors whitespace-nowrap shrink-0"
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Deshacer</span>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={history.future.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-[#121419] border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-35 transition-colors whitespace-nowrap shrink-0"
            title="Rehacer (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>Rehacer</span>
          </button>
          <button
            type="button"
            onClick={handleResetDesign}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-[#121419] border border-slate-800 rounded-lg hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar diseño</span>
          </button>
        </div>

        {/* Zone 3: Real Export Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => prepareNodeAndCapture('clipboard')}
            disabled={isExporting}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-[#121419] border border-slate-700 hover:border-slate-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Copiar Imagen al Portapapeles"
          >
            <ClipboardCopy className="w-3.5 h-3.5" />
            <span>Copiar</span>
          </button>
          <button
            type="button"
            onClick={() => prepareNodeAndCapture('jpg')}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/35 hover:bg-emerald-500/25 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Descargar JPG (Optimizado para redes)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JPG</span>
          </button>
          <button
            type="button"
            onClick={() => prepareNodeAndCapture('png')}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar PNG</span>
            <span className="sm:hidden">PNG</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Studio Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden pb-14 lg:pb-0">
        {/* Left Column: 2,200+ Templates Explorer (Desktop) */}
        <aside className="hidden lg:flex w-[325px] shrink-0 bg-[#181B20] border-r border-slate-800/90 flex-col min-h-0">
          {renderTemplateExplorer()}
        </aside>

        {/* Center Area: Interactive Real-Time Canvas */}
        <main className="flex-1 min-w-0 flex flex-col studio-dot-grid relative overflow-hidden">
          {/* Canvas Sub-Toolbar */}
          <div className="px-4 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800/60 bg-[#0F1115]/85 backdrop-blur-sm z-20 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0">
              <span className="font-semibold truncate">{activeTemplate.name}</span>
              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="text-[11px] font-mono tabular-nums text-slate-400 hidden sm:inline whitespace-nowrap">
                {dims.width}×{dims.height}px ({doc.aspectRatio})
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex md:hidden items-center gap-1 mr-1">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={history.past.length === 0}
                  className="p-1.5 rounded-lg bg-[#181B20] border border-slate-800 text-slate-300 disabled:opacity-35"
                  aria-label="Deshacer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={history.future.length === 0}
                  className="p-1.5 rounded-lg bg-[#181B20] border border-slate-800 text-slate-300 disabled:opacity-35"
                  aria-label="Rehacer"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowGuides((g) => !g)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors whitespace-nowrap ${
                  showGuides
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200'
                    : 'bg-[#181B20] border-slate-800 text-slate-400'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guías</span>
              </button>

              <div className="flex items-center bg-[#181B20] border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
                  className="p-1 text-slate-300 hover:text-white"
                  aria-label="Alejar"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-mono tabular-nums text-slate-200">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
                  className="p-1 text-slate-300 hover:text-white"
                  aria-label="Acercar"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Canvas Stage */}
          <div className="flex-1 overflow-auto studio-scroll flex items-center justify-center p-4 sm:p-8">
            <CanvasPreview
              canvasRef={canvasRef}
              template={activeTemplate}
              doc={doc}
              creatorProfile={creatorProfile}
              zoom={zoom}
              showGuides={showGuides}
              selectedTextId={selectedTextId}
              onSelectText={setSelectedTextId}
              onUpdateTextLayer={handleUpdateTextLayer}
              onUpdateImageSlot={handleUpdateImageSlot}
              isExporting={isExporting}
            />
          </div>
        </main>

        {/* Right Column: Contextual Properties & Creator Profile (Desktop) */}
        <aside className="hidden lg:flex w-[355px] shrink-0 bg-[#181B20] border-l border-slate-800/90 flex-col min-h-0">
          {renderPropertiesPanel(rightTab)}
        </aside>
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      {mobileDrawer && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div
            className="flex-1"
            onClick={() => setMobileDrawer(null)}
            aria-hidden="true"
          />
          <div className="h-[68vh] bg-[#181B20] border-t border-slate-700 rounded-t-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <span className="text-xs font-semibold text-slate-200 mt-1">
                {mobileDrawer === 'templates'
                  ? 'Explorar 2,200+ Plantillas'
                  : mobileDrawer === 'content'
                    ? 'Editar Contenido'
                    : mobileDrawer === 'images'
                      ? 'Imágenes y Aspecto'
                      : mobileDrawer === 'text'
                        ? 'Capas de Texto'
                        : 'Perfil del Creador / Marca'}
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawer(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {mobileDrawer === 'templates'
                ? renderTemplateExplorer()
                : renderPropertiesPanel(mobileDrawer)}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#181B20]/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center z-50">
        {[
          { id: 'templates' as MobileDrawerTab, label: 'Plantillas', icon: Layers },
          { id: 'content' as MobileDrawerTab, label: 'Contenido', icon: MessageSquareText },
          { id: 'images' as MobileDrawerTab, label: 'Imagen', icon: ImageIcon },
          { id: 'text' as MobileDrawerTab, label: 'Textos', icon: Type },
          { id: 'brand' as MobileDrawerTab, label: 'Marca', icon: UserCheck },
        ].map((item) => {
          const Icon = item.icon;
          const active = mobileDrawer === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id && item.id !== 'templates') {
                  setRightTab(item.id);
                }
                setMobileDrawer((prev) => (prev === item.id ? null : item.id));
              }}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Export Confirmation Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#181B20] border border-emerald-500/40 text-slate-100 text-xs font-medium shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
