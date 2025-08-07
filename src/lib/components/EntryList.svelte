<script lang="ts">
  import type { FormattableString } from '$lib/types/formattable-string';
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import {
    BookOpen,
    BookType,
    Calendar,
    ClipboardList,
    Copyright,
    Ellipsis,
    Eye,
    FileArchive,
    FileAudio,
    FileText,
    Film,
    FolderOpen,
    Globe,
    GraduationCap,
    Hash,
    Landmark,
    Layers,
    MessageCircle,
    Music,
    Newspaper,
    Palette,
    PenLine,
    Star,
    User,
    Users,
    Video
  } from '@lucide/svelte';

  let {
    entries,
    selectedId,
    onSelect
  }: {
    entries: [string, BibliographyEntry][];
    selectedId: string | null;
    onSelect: (id: string) => void;
  } = $props();

  let bibliographyId = $state('');
  let entryId = $state('');

  function formatTitle(title: FormattableString | undefined | null): string {
    if (!title) return '';

    if (typeof title === 'string') {
      return title;
    }

    return title.shortForm || title.value || '';
  }

  function formatAuthor(author: BibliographyEntry['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
      return author.map((a) => (typeof a === 'string' ? a : a.name)).join('; ');
    }
    return author.name || '';
  }

  const entryTypeIcons: Record<string, typeof BookOpen> = {
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
    book: BookOpen,
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

  function formatEntryType(type: BibliographyEntry['type']): {
    label: string;
    Icon: typeof BookOpen;
  } {
    if (!type) return { label: '', Icon: FileArchive };
    const normalized =
      type.charAt(0).toLowerCase() + type.slice(1).toLowerCase();
    const Icon = entryTypeIcons[normalized] || FileArchive;
    const label = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return { label, Icon };
  }

  function formatEntryDate(date: BibliographyEntry['date']): string {
    if (!date) {
      return '';
    }

    if (typeof date === 'number') {
      return date.toString();
    }

    if (typeof date === 'string') {
      // The date string can be YYYY, YYYY-MM, YYYY-MM-DD, or a full ISO string.
      // We only want the date part (YYYY-MM-DD).
      return date.split('T')[0];
    }

    return '';
  }
</script>

<div class="card mt-4 shadow-md">
  {#if entries.length === 0}
    <div class="card-body">
      <p class="text-center text-gray-500">This bibliography has no entries.</p>
    </div>
  {:else}
    <ul class="list bg-base-200 rounded-box shadow-md">
      {#each entries as [id, entry] (id)}
        {@const { label, Icon } = formatEntryType(entry.type)}
        <li class="list-row">
          <div class="flex min-w-[6rem] flex-col items-center justify-center">
            <Icon />
            <span class="font-semibold">
              {label}
            </span>
          </div>
          <div>
            <span class="badge badge-outline badge-sm font-mono">
              {id}
            </span>
            <br />
            <span class="text-lg font-semibold">
              {formatTitle(entry.title)}
            </span>
            <br />
            <span class="font-serif italic">
              {formatAuthor(entry.author)}
            </span>
            {#if entry.date}
              <br />
              <span class="text-xs">
                <Calendar class="inline-block h-5 w-5" />
                {formatEntryDate(entry.date)}
              </span>
            {/if}
          </div>
          <div class="flex min-w-[6rem] flex-col items-center justify-center">
            <details class="dropdown dropdown-left">
              <summary class="btn m-1">
                <Ellipsis class="inline-block" />
              </summary>
              <ul
                class="menu dropdown-content bg-base-100 rounded-box z-1 w-min p-2 shadow-sm"
              >
                <!-- TODO: View is a card dialog -->
                <!-- TODO: The card should have an option to copy the content of that single entry -->
                <li><button onclick={() => {}}>View</button></li>
                <!-- TODO: Edit goes to /bibliography/[id]/entry/[entryId]/edit -->
                <li>
                  <a
                    href={`/bibliography/${bibliographyId}/entry/${entryId}/edit`}
                    >Edit</a
                  >
                </li>
                <!-- TODO: Delete uses a confirmation dialog -->
                <li><button onclick={() => {}}>Delete</button></li>
              </ul>
            </details>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
