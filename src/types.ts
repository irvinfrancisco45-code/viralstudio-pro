export type TemplateCategory = 'meme' | 'news' | 'chat';

export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';

export type VerifiedBadgeType = 'none' | 'blue' | 'gold' | 'gray';

export type WatermarkPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'integrated'
  | 'floating';

export type AvatarCropShape = 'circle' | 'square';

export type FontFamilyOption =
  | 'Impact'
  | 'Montserrat'
  | 'Plus Jakarta Sans'
  | 'Playfair Display'
  | 'Courier Prime'
  | 'Oswald';

export interface CreatorProfile {
  name: string;
  handle: string;
  avatarDataUrl: string;
  avatarShape: AvatarCropShape;
  verified: VerifiedBadgeType;
  watermarkPosition: WatermarkPosition;
  watermarkOpacity: number;
  showWatermark: boolean;
}

export interface TextLayer {
  id: string;
  text: string;
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
  fontFamily: FontFamilyOption;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadow: boolean;
  align: 'left' | 'center' | 'right';
  lineHeight: number;
  bgColor: string;
  bgOpacity: number;
  uppercase: boolean;
}

export interface ImageSlotState {
  id: string;
  label: string;
  dataUrl: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  saturate: number;
}

export interface MemeSocialData {
  socialCaption: string;
  likesCount: string;
  commentsCount: string;
  sharesCount: string;
  viewsCount: string;
  timestampText: string;
  panelCaptions: string[];
  quoteAuthor: string;
  subreddit: string;
}

export interface NewsData {
  breakingTag: string;
  isLive: boolean;
  channelName: string;
  headline: string;
  subheadline: string;
  tickerText: string;
  clockText: string;
  locationText: string;
  reporterTag: string;
}

export type ChatPlatform =
  | 'whatsapp-ios'
  | 'whatsapp-android'
  | 'imessage'
  | 'instagram-dm'
  | 'telegram'
  | 'messenger';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other' | 'other2';
  senderName?: string;
  type: 'text' | 'image' | 'voice';
  text: string;
  imageDataUrl?: string;
  voiceDuration?: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  replyToText?: string;
  replyToSender?: string;
  reaction?: string;
}

export interface ChatData {
  contactName: string;
  contactAvatar: string;
  statusText: string;
  isGroup: boolean;
  phoneTime: string;
  batteryPercent: number;
  signalStrength: number;
  wifiActive: boolean;
  darkMode: boolean;
  wallpaperStyle: 'default' | 'doodle' | 'solid' | 'gradient';
  customWallpaper: string;
  messages: ChatMessage[];
}

export type MemeLayoutKind =
  | 'impact-classic'
  | 'x-tweet'
  | 'instagram-post'
  | 'tiktok-overlay'
  | 'reddit-card'
  | 'facebook-post'
  | 'split-2'
  | 'grid-3'
  | 'grid-4'
  | 'quote-card'
  | 'reaction-card';

export type NewsStyleKind =
  | 'cnn-breaking'
  | 'bbc-world'
  | 'local-tv'
  | 'sports-alert'
  | 'entertainment'
  | 'tech-flash'
  | 'urgent-banner'
  | 'vintage-newspaper';

export interface TemplatePalette {
  name: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  secondaryAccent: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  isDark: boolean;
}

export interface ProceduralTemplate {
  id: string;
  index: number;
  name: string;
  category: TemplateCategory;
  subCategory: string;
  themeName: string;
  keywords: string[];
  aspectRatio: AspectRatio;
  memeLayout?: MemeLayoutKind;
  newsStyle?: NewsStyleKind;
  chatPlatform?: ChatPlatform;
  palette: TemplatePalette;
  headerVariant: 'minimal' | 'full' | 'floating' | 'banner' | 'split';
  frameVariant: 'clean' | 'rounded' | 'sharp' | 'framed' | 'elevated';
  panelCount: number;
  defaultFont: FontFamilyOption;
  badgeStyle: VerifiedBadgeType;
}

export interface StudioDocument {
  templateId: string;
  aspectRatio: AspectRatio;
  images: ImageSlotState[];
  textLayers: TextLayer[];
  memeData: MemeSocialData;
  newsData: NewsData;
  chatData: ChatData;
}
