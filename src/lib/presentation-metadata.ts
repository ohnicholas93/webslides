export type PresenterNote = {
  slideNumber: number;
  notes: string;
};

export type PresentationMetadata = {
  deckId: string;
  updatedAt: string;
  presenterNotes: PresenterNote[];
};

export const PRESENTATION_METADATA_STORAGE_KEY = "webslides_metadata";
export const DEFAULT_DECK_ID = "webslides";

export function createDefaultMetadata(): PresentationMetadata {
  return {
    deckId: DEFAULT_DECK_ID,
    updatedAt: new Date().toISOString(),
    presenterNotes: [],
  };
}

export function normalizeMetadata(
  value: unknown,
  fallback: PresentationMetadata = createDefaultMetadata()
): PresentationMetadata {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<PresentationMetadata>;
  const presenterNotes = Array.isArray(candidate.presenterNotes)
    ? candidate.presenterNotes
        .map((note) => {
          if (!note || typeof note !== "object") return null;
          const rawNote = note as Partial<PresenterNote>;
          const slideNumber = Number(rawNote.slideNumber);
          if (!Number.isInteger(slideNumber) || slideNumber < 1) return null;

          return {
            slideNumber,
            notes: typeof rawNote.notes === "string" ? rawNote.notes : "",
          };
        })
        .filter((note): note is PresenterNote => note !== null)
    : fallback.presenterNotes;

  return {
    deckId:
      typeof candidate.deckId === "string" && candidate.deckId.trim()
        ? candidate.deckId.trim()
        : fallback.deckId,
    updatedAt:
      typeof candidate.updatedAt === "string" && candidate.updatedAt.trim()
        ? candidate.updatedAt
        : fallback.updatedAt,
    presenterNotes,
  };
}

export function getPresenterNote(
  metadata: PresentationMetadata,
  slideNumber: number
) {
  return (
    metadata.presenterNotes.find((note) => note.slideNumber === slideNumber)
      ?.notes ?? ""
  );
}

export function setPresenterNote(
  metadata: PresentationMetadata,
  slideNumber: number,
  notes: string
): PresentationMetadata {
  const existing = metadata.presenterNotes.filter(
    (note) => note.slideNumber !== slideNumber
  );
  const nextNotes = notes.trim()
    ? [...existing, { slideNumber, notes }]
    : existing;

  return {
    ...metadata,
    updatedAt: new Date().toISOString(),
    presenterNotes: nextNotes.sort((a, b) => a.slideNumber - b.slideNumber),
  };
}
