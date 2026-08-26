import type { CSSProperties } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Calendar, Check, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleAlert, CircleCheck,
  CircleX, Clock, Code, Copy, Dumbbell, Ellipsis, ExternalLink, Eye, FileText, Folder,
  Github, Info, Instagram, LayoutDashboard, LoaderCircle, Mail, Menu, MessageSquare,
  PanelLeft, Play, Plus, Quote, Rocket, Search, Settings, SlidersHorizontal, Sparkles,
  Terminal, TrendingUp, TriangleAlert, User, Video, X, Youtube, Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Lucide icon renderer — the ONLY icon system in this design system.
 * Sizes are CSS lengths in rem (1rem / 1.25rem / 1.5rem); the 24x24 viewBox stays unitless.
 * stroke-width 2 by default, 2.5 inside pills and toasts, 3 for the check.
 */
export type IconName =
  | 'check' | 'x' | 'chevron-down' | 'chevron-right' | 'chevron-left'
  | 'arrow-right' | 'arrow-up-right' | 'arrow-down' | 'play' | 'eye' | 'clock'
  | 'calendar' | 'copy' | 'search' | 'menu' | 'mail' | 'triangle-alert' | 'info'
  | 'circle-check' | 'circle-alert' | 'circle-x' | 'terminal' | 'code' | 'zap'
  | 'sparkles' | 'plus' | 'external-link' | 'loader-circle' | 'youtube'
  | 'instagram' | 'github' | 'folder' | 'trending-up' | 'user' | 'book-open'
  | 'message-square' | 'quote' | 'rocket' | 'file-text'
  | 'chevrons-left' | 'chevrons-right' | 'ellipsis' | 'panel-left'
  | 'sliders-horizontal' | 'layout-dashboard' | 'video' | 'dumbbell' | 'settings';

export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "circle-check", "arrow-right"). */
  name: IconName;
  /** CSS length — always rem. Default '1.25rem'. */
  size?: string;
  /** SVG stroke width in px (2 · 2.5 in pills/toasts · 3 for check). Default 2. */
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/* Même jeu de noms que le composant Icon source — tracés fournis par lucide-react. */
const ICONS: Record<IconName, LucideIcon> = {
  'check': Check,
  'x': X,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'arrow-down': ArrowDown,
  'play': Play,
  'eye': Eye,
  'clock': Clock,
  'calendar': Calendar,
  'copy': Copy,
  'search': Search,
  'menu': Menu,
  'mail': Mail,
  'triangle-alert': TriangleAlert,
  'info': Info,
  'circle-check': CircleCheck,
  'circle-alert': CircleAlert,
  'circle-x': CircleX,
  'terminal': Terminal,
  'code': Code,
  'zap': Zap,
  'sparkles': Sparkles,
  'plus': Plus,
  'external-link': ExternalLink,
  'loader-circle': LoaderCircle,
  'youtube': Youtube,
  'instagram': Instagram,
  'github': Github,
  'folder': Folder,
  'trending-up': TrendingUp,
  'user': User,
  'book-open': BookOpen,
  'message-square': MessageSquare,
  'quote': Quote,
  'rocket': Rocket,
  'file-text': FileText,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,
  'ellipsis': Ellipsis,
  'panel-left': PanelLeft,
  'sliders-horizontal': SlidersHorizontal,
  'layout-dashboard': LayoutDashboard,
  'video': Video,
  'dumbbell': Dumbbell,
  'settings': Settings,
};

export function Icon({
  name, size = '1.25rem', strokeWidth = 2, className = '', style, ...rest
}: IconProps): JSX.Element | null {
  const Glyph = ICONS[name];
  if (!Glyph) return null;
  return (
    <Glyph
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      /* La taille est posée en CSS (rem) — le viewBox 24x24 reste sans unité. */
      style={{ width: size, height: size, flex: 'none', display: 'block', ...style }}
      {...rest}
    />
  );
}
