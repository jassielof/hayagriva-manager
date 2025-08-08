import {
  Book,
  BookOpen,
  BookType,
  ClipboardList,
  Copyright,
  Eye,
  FileArchive,
  FileAudio,
  FileText,
  Film,
  FolderOpen,
  Globe,
  GraduationCap,
  Landmark,
  Layers,
  MessageCircle,
  Music,
  Newspaper,
  Palette,
  PenLine,
  Star,
  Users,
  Video
} from '@lucide/svelte';

export const entryTypeIcons: Record<string, typeof BookOpen> = {
  article: FileText,
  chapter: FileText,
  entry: FileText,
  anthos: Layers,
  report: ClipboardList,
  thesis: GraduationCap,
  web: Globe,
  scene: Film,
  artwork: Palette,
  patent: Copyright,
  case: Landmark,
  newspaper: Newspaper,
  legislation: Landmark,
  manuscript: PenLine,
  original: Star,
  post: MessageCircle,
  misc: FileArchive,
  performance: Music,
  periodical: BookType,
  proceedings: Layers,
  book: Book,
  blog: Globe,
  reference: ClipboardList,
  conference: Users,
  anthology: Layers,
  repository: FolderOpen,
  thread: MessageCircle,
  video: Video,
  audio: FileAudio,
  exhibition: Eye
};

export function formatEntryType(type: string): {
  label: string;
  Icon: typeof BookOpen;
} {
  if (!type) return { label: '', Icon: FileArchive };
  const normalized = type.charAt(0).toLowerCase() + type.slice(1).toLowerCase();
  const Icon = entryTypeIcons[normalized] || FileArchive;
  const label = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return { label, Icon };
}
