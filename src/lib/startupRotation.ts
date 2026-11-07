import { adhkarLibrary, type AdhkarCategory, type LibraryItem } from '../data/adhkar';
import { verses, type VerifiedVerse } from '../data/verses';

export type StartupContentMode = 'verse' | 'dhikr' | 'both';
export type StartupContentKind = 'verse' | 'dhikr';

export interface StartupContent {
  id: string;
  kind: StartupContentKind;
  title: string;
  text: string;
  source: string;
  category?: AdhkarCategory;
  audioUrl?: string;
}

function verseContent(verse: VerifiedVerse): StartupContent {
  const reference = verse.source.match(/(\d+):(\d+)$/)?.slice(1).join(':') || verse.title;
  return {
    id: `verse:${reference}`,
    kind: 'verse',
    title: verse.title,
    text: verse.text,
    source: verse.source,
  };
}

function dhikrContent(item: LibraryItem): StartupContent {
  return {
    id: `dhikr:${item.category || item.section}:${item.title}`,
    kind: 'dhikr',
    title: item.title,
    text: item.text,
    source: item.source,
    category: item.category || 'general',
  };
}

function choose<T extends StartupContent>(
  candidates: T[],
  lastContentId: string | null,
  random: () => number,
): T {
  const available = candidates.length > 1
    ? candidates.filter((item) => item.id !== lastContentId)
    : candidates;
  const index = Math.min(available.length - 1, Math.floor(random() * available.length));
  return available[Math.max(0, index)];
}

export function selectStartupContent({
  mode,
  lastContentId,
  lastContentKind,
  date = new Date(),
  random = Math.random,
}: {
  mode: StartupContentMode;
  lastContentId: string | null;
  lastContentKind: StartupContentKind | null;
  date?: Date;
  random?: () => number;
}): StartupContent {
  const isFriday = date.getDay() === 5;
  if (isFriday && mode !== 'verse') {
    const fridayItems = adhkarLibrary
      .filter((item) => item.category === 'vendredi')
      .map(dhikrContent);
    if (fridayItems.length) return choose(fridayItems, lastContentId, random);
  }

  const kinds: StartupContentKind[] = mode === 'both'
    ? ['verse', 'dhikr']
    : [mode];
  const kind = mode === 'both'
    ? lastContentKind ? (lastContentKind === 'verse' ? 'dhikr' : 'verse') : kinds[Math.floor(random() * kinds.length)]
    : kinds[0];
  const candidates = kind === 'verse'
    ? verses.map(verseContent)
    : adhkarLibrary.filter((item) => item.category !== 'vendredi').map(dhikrContent);
  return choose(candidates, lastContentId, random);
}

export async function fetchRandomVerse(reciter: string, signal?: AbortSignal): Promise<StartupContent> {
  const response = await fetch(
    `https://api.alquran.cloud/v1/ayah/random/${encodeURIComponent(reciter)}`,
    { signal },
  );
  if (!response.ok) throw new Error(`Quran API responded with ${response.status}.`);
  const payload: unknown = await response.json();
  if (typeof payload !== 'object' || payload === null || !('data' in payload)) {
    throw new Error('Quran API returned an invalid response.');
  }
  const data = payload.data;
  if (typeof data !== 'object' || data === null || !('text' in data) || typeof data.text !== 'string' ||
      !('numberInSurah' in data) || typeof data.numberInSurah !== 'number' ||
      !('surah' in data) || typeof data.surah !== 'object' || data.surah === null ||
      !('number' in data.surah) || typeof data.surah.number !== 'number' ||
      !('name' in data.surah) || typeof data.surah.name !== 'string') {
    throw new Error('Quran API returned an invalid verse.');
  }
  const source = `AlQuran.cloud, ${data.surah.number}:${data.numberInSurah}`;
  return {
    id: `verse:${data.surah.number}:${data.numberInSurah}`,
    kind: 'verse',
    title: `${data.surah.name} · ${data.numberInSurah}`,
    text: data.text,
    source,
    audioUrl: 'audio' in data && typeof data.audio === 'string' ? data.audio : undefined,
  };
}

export async function fetchVerseAudio(reference: string, reciter: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(
    `https://api.alquran.cloud/v1/ayah/${encodeURIComponent(reference)}/${encodeURIComponent(reciter)}`,
    { signal },
  );
  if (!response.ok) throw new Error(`Quran audio API responded with ${response.status}.`);
  const payload: unknown = await response.json();
  if (typeof payload !== 'object' || payload === null || !('data' in payload) ||
      typeof payload.data !== 'object' || payload.data === null ||
      !('audio' in payload.data) || typeof payload.data.audio !== 'string') {
    throw new Error('Quran audio API returned an invalid response.');
  }
  return payload.data.audio;
}
