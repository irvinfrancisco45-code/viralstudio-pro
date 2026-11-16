import {
  AspectRatio,
  ChatPlatform,
  CreatorProfile,
  FontFamilyOption,
  MemeLayoutKind,
  NewsStyleKind,
  ProceduralTemplate,
  StudioDocument,
  TemplatePalette,
  VerifiedBadgeType,
} from '../types';

export const SAMPLE_MEME_IMG = '/src/assets/images/sample_meme_cat_1794870258702.jpg';
export const SAMPLE_NEWS_IMG = '/src/assets/images/sample_news_city_1794870259493.jpg';
export const SAMPLE_AVATAR_IMG = '/src/assets/images/sample_creator_avatar_1794870259273.jpg';

export const DEFAULT_CREATOR_PROFILE: CreatorProfile = {
  name: 'ViralStudio Media',
  handle: '@viralstudiopro',
  avatarDataUrl: SAMPLE_AVATAR_IMG,
  avatarShape: 'circle',
  verified: 'blue',
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 0.88,
  showWatermark: true,
};

export const THEME_PALETTES: TemplatePalette[] = [
  {
    name: 'Modo Claro',
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    muted: '#64748B',
    accent: '#4F46E5',
    secondaryAccent: '#10B981',
    border: '#E2E8F0',
    badgeBg: '#EEF2FF',
    badgeText: '#4338CA',
    isDark: false,
  },
  {
    name: 'Modo Oscuro',
    bg: '#09090B',
    surface: '#18181B',
    text: '#FAFAFA',
    muted: '#A1A1AA',
    accent: '#6366F1',
    secondaryAccent: '#10B981',
    border: '#27272A',
    badgeBg: '#1E1B4B',
    badgeText: '#A5B4FC',
    isDark: true,
  },
  {
    name: 'Neón',
    bg: '#050816',
    surface: '#0B1120',
    text: '#F8FAFC',
    muted: '#94A3B8',
    accent: '#06B6D4',
    secondaryAccent: '#F43F5E',
    border: '#1E293B',
    badgeBg: '#083344',
    badgeText: '#22D3EE',
    isDark: true,
  },
  {
    name: 'Minimalista',
    bg: '#F4F4F5',
    surface: '#FFFFFF',
    text: '#18181B',
    muted: '#71717A',
    accent: '#18181B',
    secondaryAccent: '#52525B',
    border: '#D4D4D8',
    badgeBg: '#E4E4E7',
    badgeText: '#18181B',
    isDark: false,
  },
  {
    name: 'Retro',
    bg: '#FDF6E3',
    surface: '#FAF0D7',
    text: '#292524',
    muted: '#78716C',
    accent: '#D97706',
    secondaryAccent: '#B45309',
    border: '#E7D8B9',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    isDark: false,
  },
  {
    name: 'Vibrante',
    bg: '#1E1B4B',
    surface: '#312E81',
    text: '#FFFFFF',
    muted: '#C7D2FE',
    accent: '#F59E0B',
    secondaryAccent: '#EC4899',
    border: '#4338CA',
    badgeBg: '#4F46E5',
    badgeText: '#FFFFFF',
    isDark: true,
  },
  {
    name: 'Periódico',
    bg: '#F3EFE6',
    surface: '#EBE5D8',
    text: '#1C1917',
    muted: '#57534E',
    accent: '#991B1B',
    secondaryAccent: '#44403C',
    border: '#C7BFB0',
    badgeBg: '#1C1917',
    badgeText: '#F3EFE6',
    isDark: false,
  },
  {
    name: 'Broadcast Rojo',
    bg: '#0B0F19',
    surface: '#111827',
    text: '#F9FAFB',
    muted: '#9CA3AF',
    accent: '#DC2626',
    secondaryAccent: '#FBBF24',
    border: '#1F2937',
    badgeBg: '#DC2626',
    badgeText: '#FFFFFF',
    isDark: true,
  },
  {
    name: 'Esmeralda',
    bg: '#022C22',
    surface: '#064E3B',
    text: '#ECFDF5',
    muted: '#A7F3D0',
    accent: '#10B981',
    secondaryAccent: '#34D399',
    border: '#065F46',
    badgeBg: '#047857',
    badgeText: '#ECFDF5',
    isDark: true,
  },
  {
    name: 'Azul Prensa',
    bg: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    muted: '#94A3B8',
    accent: '#2563EB',
    secondaryAccent: '#38BDF8',
    border: '#334155',
    badgeBg: '#1D4ED8',
    badgeText: '#FFFFFF',
    isDark: true,
  },
];

const MEME_LAYOUTS: Array<{
  layout: MemeLayoutKind;
  subCategory: string;
  label: string;
  panels: number;
  defaultFont: FontFamilyOption;
  ratios: AspectRatio[];
}> = [
  {
    layout: 'impact-classic',
    subCategory: 'Impact Clásico',
    label: 'Meme Clásico',
    panels: 1,
    defaultFont: 'Impact',
    ratios: ['1:1', '4:5'],
  },
  {
    layout: 'x-tweet',
    subCategory: 'X / Twitter',
    label: 'Post Viral X',
    panels: 1,
    defaultFont: 'Plus Jakarta Sans',
    ratios: ['1:1', '4:5', '16:9'],
  },
  {
    layout: 'instagram-post',
    subCategory: 'Instagram',
    label: 'Tarjeta Instagram',
    panels: 1,
    defaultFont: 'Montserrat',
    ratios: ['4:5', '1:1'],
  },
  {
    layout: 'tiktok-overlay',
    subCategory: 'TikTok',
    label: 'Portada TikTok',
    panels: 1,
    defaultFont: 'Montserrat',
    ratios: ['9:16', '4:5'],
  },
  {
    layout: 'reddit-card',
    subCategory: 'Reddit',
    label: 'Hilo Reddit',
    panels: 1,
    defaultFont: 'Plus Jakarta Sans',
    ratios: ['1:1', '4:5'],
  },
  {
    layout: 'facebook-post',
    subCategory: 'Facebook',
    label: 'Publicación Social',
    panels: 1,
    defaultFont: 'Plus Jakarta Sans',
    ratios: ['1:1', '4:5'],
  },
  {
    layout: 'split-2',
    subCategory: '2 Paneles',
    label: 'Comparativa 2 Paneles',
    panels: 2,
    defaultFont: 'Montserrat',
    ratios: ['1:1', '4:5'],
  },
  {
    layout: 'grid-3',
    subCategory: '3 Paneles',
    label: 'Evolución 3 Paneles',
    panels: 3,
    defaultFont: 'Oswald',
    ratios: ['4:5', '1:1'],
  },
  {
    layout: 'grid-4',
    subCategory: '4 Paneles',
    label: 'Cuadrícula 4 Paneles',
    panels: 4,
    defaultFont: 'Oswald',
    ratios: ['1:1', '4:5'],
  },
  {
    layout: 'quote-card',
    subCategory: 'Citas',
    label: 'Cita Editorial',
    panels: 1,
    defaultFont: 'Playfair Display',
    ratios: ['1:1', '4:5', '9:16'],
  },
  {
    layout: 'reaction-card',
    subCategory: 'Reacciones',
    label: 'Tarjeta de Reacción',
    panels: 1,
    defaultFont: 'Montserrat',
    ratios: ['1:1', '16:9'],
  },
];

const NEWS_STYLES: Array<{
  style: NewsStyleKind;
  subCategory: string;
  label: string;
  defaultFont: FontFamilyOption;
  ratios: AspectRatio[];
}> = [
  {
    style: 'cnn-breaking',
    subCategory: 'Breaking CNN',
    label: 'Cintillo Última Hora',
    defaultFont: 'Montserrat',
    ratios: ['16:9', '1:1', '4:5'],
  },
  {
    style: 'bbc-world',
    subCategory: 'BBC World',
    label: 'Edición Mundial',
    defaultFont: 'Plus Jakarta Sans',
    ratios: ['16:9', '1:1'],
  },
  {
    style: 'local-tv',
    subCategory: 'Noticiero Local',
    label: 'Noticiero Nocturno',
    defaultFont: 'Montserrat',
    ratios: ['16:9', '4:5', '9:16'],
  },
  {
    style: 'sports-alert',
    subCategory: 'Deportes',
    label: 'Flash Deportivo',
    defaultFont: 'Oswald',
    ratios: ['1:1', '16:9', '4:5'],
  },
  {
    style: 'entertainment',
    subCategory: 'Farándula',
    label: 'Exclusiva Espectáculos',
    defaultFont: 'Montserrat',
    ratios: ['4:5', '1:1', '9:16'],
  },
  {
    style: 'tech-flash',
    subCategory: 'Tecnología',
    label: 'Informe Tech',
    defaultFont: 'Plus Jakarta Sans',
    ratios: ['16:9', '1:1'],
  },
  {
    style: 'urgent-banner',
    subCategory: 'Alerta Urgente',
    label: 'Alerta Nacional',
    defaultFont: 'Oswald',
    ratios: ['16:9', '1:1', '9:16'],
  },
  {
    style: 'vintage-newspaper',
    subCategory: 'Periódico',
    label: 'Primera Plana Impresa',
    defaultFont: 'Playfair Display',
    ratios: ['4:5', '1:1'],
  },
];

const CHAT_PLATFORMS: Array<{
  platform: ChatPlatform;
  subCategory: string;
  label: string;
  ratios: AspectRatio[];
}> = [
  {
    platform: 'whatsapp-ios',
    subCategory: 'WhatsApp iOS',
    label: 'WhatsApp iPhone',
    ratios: ['9:16', '4:5', '1:1'],
  },
  {
    platform: 'whatsapp-android',
    subCategory: 'WhatsApp Android',
    label: 'WhatsApp Android',
    ratios: ['9:16', '4:5', '1:1'],
  },
  {
    platform: 'imessage',
    subCategory: 'iMessage',
    label: 'Mensajes Apple',
    ratios: ['9:16', '4:5', '1:1'],
  },
  {
    platform: 'instagram-dm',
    subCategory: 'Instagram DM',
    label: 'Direct Instagram',
    ratios: ['9:16', '4:5', '1:1'],
  },
  {
    platform: 'telegram',
    subCategory: 'Telegram',
    label: 'Canal / Chat Telegram',
    ratios: ['9:16', '4:5', '1:1'],
  },
  {
    platform: 'messenger',
    subCategory: 'Messenger',
    label: 'Chat Messenger',
    ratios: ['9:16', '4:5', '1:1'],
  },
];

const HEADER_VARIANTS: ProceduralTemplate['headerVariant'][] = [
  'minimal',
  'full',
  'floating',
  'banner',
  'split',
];

const FRAME_VARIANTS: ProceduralTemplate['frameVariant'][] = [
  'clean',
  'rounded',
  'sharp',
  'framed',
  'elevated',
];

const BADGE_STYLES: VerifiedBadgeType[] = ['blue', 'gold', 'gray', 'none'];

const MEME_DESCRIPTORS = [
  'Viral',
  'Edición Pro',
  'Tendencia',
  'Clásico',
  'Impacto',
  'Directo',
  'Comunidad',
  'Hilo Top',
  'Estudio',
  'Formato Pro',
];

const NEWS_DESCRIPTORS = [
  'En Vivo',
  'Boletín',
  'Especial',
  'Primicia',
  'Cobertura',
  'Titular',
  'Último Minuto',
  'Redacción',
  'Satélite',
  'Edición Central',
];

const CHAT_SCENARIOS = [
  'Conversación 1 a 1',
  'Grupo Activo',
  'Nota de Voz',
  'Mensaje Fijado',
  'Captura Viral',
  'Respuesta Citada',
  'Foto Enviada',
  'Modo En Línea',
  'Escribiendo...',
  'Estado Nocturno',
];

let cachedTemplates: ProceduralTemplate[] | null = null;

export function generateAllTemplates(): ProceduralTemplate[] {
  if (cachedTemplates) return cachedTemplates;

  const templates: ProceduralTemplate[] = [];

  // 1) 1,000 Memes & Redes Sociales
  for (let i = 0; i < 1000; i++) {
    const layoutDef = MEME_LAYOUTS[i % MEME_LAYOUTS.length];
    const palette = THEME_PALETTES[Math.floor(i / MEME_LAYOUTS.length) % THEME_PALETTES.length];
    const headerVariant = HEADER_VARIANTS[Math.floor(i / 5) % HEADER_VARIANTS.length];
    const frameVariant = FRAME_VARIANTS[Math.floor(i / 7) % FRAME_VARIANTS.length];
    const ratio = layoutDef.ratios[Math.floor(i / 11) % layoutDef.ratios.length];
    const badgeStyle = BADGE_STYLES[Math.floor(i / 3) % BADGE_STYLES.length];
    const descriptor = MEME_DESCRIPTORS[Math.floor(i / 13) % MEME_DESCRIPTORS.length];
    const num = String(i + 1).padStart(4, '0');

    templates.push({
      id: `meme-${num}`,
      index: i + 1,
      name: `${layoutDef.label} · ${descriptor} #${i + 1}`,
      category: 'meme',
      subCategory: layoutDef.subCategory,
      themeName: palette.name,
      keywords: [
        'meme',
        'redes',
        layoutDef.subCategory.toLowerCase(),
        layoutDef.label.toLowerCase(),
        palette.name.toLowerCase(),
        descriptor.toLowerCase(),
        ratio,
      ],
      aspectRatio: ratio,
      memeLayout: layoutDef.layout,
      palette,
      headerVariant,
      frameVariant,
      panelCount: layoutDef.panels,
      defaultFont: layoutDef.defaultFont,
      badgeStyle,
    });
  }

  // 2) 600 Noticias TV / Prensa
  for (let i = 0; i < 600; i++) {
    const styleDef = NEWS_STYLES[i % NEWS_STYLES.length];
    const palette =
      styleDef.style === 'vintage-newspaper'
        ? THEME_PALETTES[6]
        : THEME_PALETTES[(Math.floor(i / NEWS_STYLES.length) + 7) % THEME_PALETTES.length];
    const headerVariant = HEADER_VARIANTS[Math.floor(i / 4) % HEADER_VARIANTS.length];
    const frameVariant = FRAME_VARIANTS[Math.floor(i / 6) % FRAME_VARIANTS.length];
    const ratio = styleDef.ratios[Math.floor(i / 8) % styleDef.ratios.length];
    const descriptor = NEWS_DESCRIPTORS[Math.floor(i / 10) % NEWS_DESCRIPTORS.length];
    const num = String(i + 1).padStart(4, '0');

    templates.push({
      id: `news-${num}`,
      index: i + 1,
      name: `${styleDef.label} · ${descriptor} #${i + 1}`,
      category: 'news',
      subCategory: styleDef.subCategory,
      themeName: palette.name,
      keywords: [
        'noticia',
        'noticias',
        'breaking',
        'ultima hora',
        styleDef.subCategory.toLowerCase(),
        styleDef.label.toLowerCase(),
        palette.name.toLowerCase(),
        descriptor.toLowerCase(),
      ],
      aspectRatio: ratio,
      newsStyle: styleDef.style,
      palette,
      headerVariant,
      frameVariant,
      panelCount: 1,
      defaultFont: styleDef.defaultFont,
      badgeStyle: i % 2 === 0 ? 'gold' : 'blue',
    });
  }

  // 3) 600 Chats Realistas
  for (let i = 0; i < 600; i++) {
    const platformDef = CHAT_PLATFORMS[i % CHAT_PLATFORMS.length];
    const isDark = Math.floor(i / CHAT_PLATFORMS.length) % 2 === 1;
    const basePalette = isDark ? THEME_PALETTES[1] : THEME_PALETTES[0];
    const accentPalette = THEME_PALETTES[Math.floor(i / 12) % THEME_PALETTES.length];
    const ratio = platformDef.ratios[Math.floor(i / 7) % platformDef.ratios.length];
    const scenario = CHAT_SCENARIOS[Math.floor(i / 10) % CHAT_SCENARIOS.length];
    const num = String(i + 1).padStart(4, '0');

    const chatPalette: TemplatePalette = {
      ...basePalette,
      name: isDark ? 'Modo Oscuro' : 'Modo Claro',
      accent:
        platformDef.platform.startsWith('whatsapp')
          ? '#10B981'
          : platformDef.platform === 'instagram-dm'
            ? '#6366F1'
            : platformDef.platform === 'telegram'
              ? '#0EA5E9'
              : '#2563EB',
      secondaryAccent: accentPalette.accent,
    };

    templates.push({
      id: `chat-${num}`,
      index: i + 1,
      name: `${platformDef.label} · ${scenario} #${i + 1}`,
      category: 'chat',
      subCategory: platformDef.subCategory,
      themeName: chatPalette.name,
      keywords: [
        'chat',
        'whatsapp',
        'imessage',
        'instagram',
        'telegram',
        'messenger',
        platformDef.subCategory.toLowerCase(),
        scenario.toLowerCase(),
        chatPalette.name.toLowerCase(),
      ],
      aspectRatio: ratio,
      chatPlatform: platformDef.platform,
      palette: chatPalette,
      headerVariant: HEADER_VARIANTS[i % HEADER_VARIANTS.length],
      frameVariant: FRAME_VARIANTS[i % FRAME_VARIANTS.length],
      panelCount: 1,
      defaultFont: 'Plus Jakarta Sans',
      badgeStyle: i % 4 === 0 ? 'blue' : 'none',
    });
  }

  cachedTemplates = templates;
  return templates;
}

export function getSubcategoriesForCategory(category: 'meme' | 'news' | 'chat'): string[] {
  if (category === 'meme') {
    return ['Todos', ...MEME_LAYOUTS.map((l) => l.subCategory)];
  }
  if (category === 'news') {
    return ['Todos', ...NEWS_STYLES.map((s) => s.subCategory)];
  }
  return ['Todos', ...CHAT_PLATFORMS.map((p) => p.subCategory)];
}

export function createDocumentForTemplate(
  template: ProceduralTemplate,
  previousDoc?: StudioDocument
): StudioDocument {
  const panelCount = template.panelCount || 1;
  const defaultPhoto =
    template.category === 'news' ? SAMPLE_NEWS_IMG : SAMPLE_MEME_IMG;

  const images = Array.from({ length: panelCount }, (_, idx) => {
    const prev = previousDoc?.images[idx];
    return {
      id: `slot-${idx + 1}`,
      label: panelCount > 1 ? `Panel ${idx + 1}` : 'Imagen Principal',
      dataUrl: prev?.dataUrl || defaultPhoto,
      scale: prev?.scale ?? 1,
      offsetX: prev?.offsetX ?? 0,
      offsetY: prev?.offsetY ?? 0,
      rotation: prev?.rotation ?? 0,
      brightness: prev?.brightness ?? 100,
      contrast: prev?.contrast ?? 100,
      grayscale: prev?.grayscale ?? 0,
      saturate: prev?.saturate ?? 100,
    };
  });

  const defaultTextLayers =
    template.category === 'meme' && template.memeLayout === 'impact-classic'
      ? [
          {
            id: 'txt-top',
            text: 'CUANDO DICES "SOLO 5 MINUTOS MÁS"',
            x: 50,
            y: 11,
            fontFamily: 'Impact' as FontFamilyOption,
            fontSize: 34,
            color: '#FFFFFF',
            strokeColor: '#000000',
            strokeWidth: 4,
            shadow: true,
            align: 'center' as const,
            lineHeight: 1.15,
            bgColor: '#000000',
            bgOpacity: 0,
            uppercase: true,
          },
          {
            id: 'txt-bottom',
            text: 'Y YA SON LAS 3 DE LA MAÑANA',
            x: 50,
            y: 88,
            fontFamily: 'Impact' as FontFamilyOption,
            fontSize: 34,
            color: '#FFFFFF',
            strokeColor: '#000000',
            strokeWidth: 4,
            shadow: true,
            align: 'center' as const,
            lineHeight: 1.15,
            bgColor: '#000000',
            bgOpacity: 0,
            uppercase: true,
          },
        ]
      : template.category === 'meme' && template.memeLayout === 'tiktok-overlay'
        ? [
            {
              id: 'txt-tiktok',
              text: 'POV: Revisas producción un viernes a las 5:58 PM',
              x: 50,
              y: 20,
              fontFamily: 'Montserrat' as FontFamilyOption,
              fontSize: 24,
              color: '#0F172A',
              strokeColor: '#000000',
              strokeWidth: 0,
              shadow: false,
              align: 'center' as const,
              lineHeight: 1.25,
              bgColor: '#FFFFFF',
              bgOpacity: 0.95,
              uppercase: false,
            },
          ]
        : [];

  return {
    templateId: template.id,
    aspectRatio: template.aspectRatio,
    images,
    textLayers:
      previousDoc && previousDoc.templateId === template.id
        ? previousDoc.textLayers
        : defaultTextLayers,
    memeData: previousDoc?.memeData || {
      socialCaption:
        'Cuando dices "hoy me duermo temprano" pero encuentras un bug misterioso a las 11:55 PM y ahora eres detective forense.',
      likesCount: '48.2K',
      commentsCount: '1,420',
      sharesCount: '9,814',
      viewsCount: '1.2M',
      timestampText: '20:45 · 16 nov. 2026',
      panelCaptions: [
        'Expectativa: dormir 8 horas',
        'Realidad: 3 cafés y 14 pestañas',
        'Resultado a las 8 AM',
        'Yo fingiendo normalidad',
      ],
      quoteAuthor: 'Redacción ViralStudio',
      subreddit: 'r/ProgramacionHumor',
    },
    newsData: previousDoc?.newsData || {
      breakingTag: 'ÚLTIMA HORA',
      isLive: true,
      channelName: 'VSN 24H',
      headline: 'SE CONFIRMA NUEVO RÉCORD HISTÓRICO EN CREATIVIDAD DIGITAL',
      subheadline:
        'Miles de creadores adoptan formatos visuales de alto impacto en tiempo real desde sus navegadores.',
      tickerText:
        'URGENTE: Nuevas herramientas de diseño permiten exportar piezas virales en alta definición · Tráfico récord en redes sociales esta tarde · Pronóstico estable para la jornada.',
      clockText: '21:14',
      locationText: 'MADRID / CDMX',
      reporterTag: 'CORRESPONSAL EN VIVO',
    },
    chatData: previousDoc?.chatData || {
      contactName: 'Sofía Mendoza',
      contactAvatar: SAMPLE_AVATAR_IMG,
      statusText: template.name.includes('Escribiendo')
        ? 'escribiendo...'
        : 'en línea',
      isGroup: template.name.includes('Grupo'),
      phoneTime: '21:14',
      batteryPercent: 86,
      signalStrength: 4,
      wifiActive: true,
      darkMode: template.palette.isDark,
      wallpaperStyle: 'doodle',
      customWallpaper: '',
      messages: [
        {
          id: 'm1',
          sender: 'other',
          senderName: 'Sofía',
          type: 'text',
          text: 'Oye, ¿ya viste la presentación para mañana? 👀',
          time: '21:10',
          status: 'read',
        },
        {
          id: 'm2',
          sender: 'me',
          type: 'text',
          text: 'Sííí, acabo de terminar los gráficos en alta resolución. ¡Quedaron brutales!',
          time: '21:11',
          status: 'read',
          reaction: '🔥',
        },
        {
          id: 'm3',
          sender: 'other',
          senderName: 'Sofía',
          type: 'voice',
          text: 'Nota de voz',
          voiceDuration: '0:24',
          time: '21:12',
          status: 'read',
          replyToText: 'Sííí, acabo de terminar los gráficos en alta resolución...',
          replyToSender: 'Tú',
        },
        {
          id: 'm4',
          sender: 'me',
          type: 'text',
          text: 'Perfecto, te los paso ahora mismo por aquí 🚀',
          time: '21:14',
          status: 'read',
        },
      ],
    },
  };
}
