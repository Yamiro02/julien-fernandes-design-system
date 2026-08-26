import type { CSSProperties } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Calendar, Check, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleAlert, CircleCheck,
  CircleX, Clock, Code, Copy, Dumbbell, Ellipsis, ExternalLink, Eye, FileText, Folder,
  Github, Info, LayoutDashboard, LoaderCircle, Mail, Menu, MessageSquare,
  PanelLeft, Play, Plus, Quote, Rocket, Search, Settings, SlidersHorizontal,
  Terminal, Trash2, TrendingUp, TriangleAlert, User, Video, X, Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Lucide icon renderer — the ONLY icon system in this design system.
 * BANNED: `sparkles` — the AI-slop star. Never reintroduce it, in the set or in an app.
 * `youtube` et `instagram` NE SONT PLUS ICI : ce sont des icônes de PLATEFORME, pas
 * d'interface. Elles vivent dans l'extension métier, sur le sous-chemin
 * `@julienfernandes/ds/brand-content`, sous le composant `ContentIcon`. `github` reste :
 * c'est une plateforme de développement, présente dans à peu près tout produit technique.
 * Sizes are CSS lengths in rem (1rem / 1.25rem / 1.5rem); the 24x24 viewBox stays unitless.
 * stroke-width 2 by default, 2.5 inside pills and toasts, 3 for the check.
 */
export type IconName =
  | 'check' | 'x' | 'chevron-down' | 'chevron-right' | 'chevron-left'
  | 'arrow-right' | 'arrow-up-right' | 'arrow-down' | 'play' | 'eye' | 'clock'
  | 'calendar' | 'copy' | 'search' | 'menu' | 'mail' | 'triangle-alert' | 'info'
  | 'circle-check' | 'circle-alert' | 'circle-x' | 'terminal' | 'code' | 'zap'
  | 'plus' | 'trash-2' | 'external-link' | 'loader-circle'
  | 'github' | 'folder' | 'trending-up' | 'user' | 'book-open'
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
  'trash-2': Trash2,
  'plus': Plus,
  'external-link': ExternalLink,
  'loader-circle': LoaderCircle,
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
  const Icône = ICONS[name];
  if (!Icône) return null;
  return <Glyph glyph={Icône} size={size} strokeWidth={strokeWidth} className={className} style={style} {...rest} />;
}

/**
 * Le RENDU nu, pour un tracé lucide quelconque. Interne au paquet : c'est ce qui permet à
 * l'extension métier de rendre ses icônes de plateforme avec exactement les mêmes règles
 * de taille et d'épaisseur, sans dupliquer huit lignes ni rouvrir le socle.
 */
export interface GlyphProps extends Omit<IconProps, 'name'> { glyph: LucideIcon }

export function Glyph({
  glyph: G, size = '1.25rem', strokeWidth = 2, className, style, ...rest
}: GlyphProps): JSX.Element {
  return (
    <G
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
