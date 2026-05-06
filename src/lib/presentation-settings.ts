export const PRESENTATION_SETTINGS_STORAGE_KEYS = {
  aspectRatio: "webslides_aspect_ratio",
  resolution: "webslides_resolution",
  safeAutoSizing: "webslides_safe_auto_sizing",
} as const;

export const aspectRatioOptions = [
  { key: "16:9", label: "16:9 (Widescreen)", w: 16, h: 9 },
  { key: "4:3", label: "4:3 (Standard)", w: 4, h: 3 },
  { key: "1:1", label: "1:1 (Square)", w: 1, h: 1 },
  { key: "21:9", label: "21:9 (Ultrawide)", w: 21, h: 9 },
] as const;

export type AspectRatioKey = (typeof aspectRatioOptions)[number]["key"];

export const resolutionOptions = [
  { key: "FHD", label: "FHD (1080p)", height: 1080 },
  { key: "QHD", label: "QHD (1440p)", height: 1440 },
  { key: "4K", label: "4K (2160p)", height: 2160 },
] as const;

export type ResolutionKey = (typeof resolutionOptions)[number]["key"];

export type PresentationSettings = {
  aspectRatio: AspectRatioKey;
  resolution: ResolutionKey;
  safeAutoSizing: boolean;
};

export const DOM_BASE_HEIGHT_PX = 1080;

export const defaultPresentationSettings: PresentationSettings = {
  aspectRatio: "16:9",
  resolution: "QHD",
  safeAutoSizing: true,
};

function isAspectRatioKey(value: unknown): value is AspectRatioKey {
  return aspectRatioOptions.some((option) => option.key === value);
}

function isResolutionKey(value: unknown): value is ResolutionKey {
  return resolutionOptions.some((option) => option.key === value);
}

function parseCookieBoolean(value: unknown): boolean | null {
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return null;
}

function getAspectRatioNumbers(aspectRatio: AspectRatioKey) {
  const option = aspectRatioOptions.find((o) => o.key === aspectRatio);
  if (!option) return { w: 16, h: 9 };
  return { w: option.w, h: option.h };
}

export function getDomSlideSize(settings: PresentationSettings) {
  const { w, h } = getAspectRatioNumbers(settings.aspectRatio);
  const height = DOM_BASE_HEIGHT_PX;
  const width = Math.round((height * w) / h);
  return { width, height };
}

export function getExportPixelRatio(settings: PresentationSettings) {
  const option =
    resolutionOptions.find((r) => r.key === settings.resolution) ??
    resolutionOptions[0];
  return option.height / DOM_BASE_HEIGHT_PX;
}

export function getExportSlideSize(settings: PresentationSettings) {
  const dom = getDomSlideSize(settings);
  const pixelRatio = getExportPixelRatio(settings);
  return {
    width: Math.round(dom.width * pixelRatio),
    height: Math.round(dom.height * pixelRatio),
  };
}

type StorageLike = {
  getItem: (name: string) => string | null;
};

export function readPresentationSettingsFromStorage(
  storage: StorageLike,
  fallback: PresentationSettings = defaultPresentationSettings
): PresentationSettings {
  const rawAspect = storage.getItem(PRESENTATION_SETTINGS_STORAGE_KEYS.aspectRatio);
  const rawRes = storage.getItem(PRESENTATION_SETTINGS_STORAGE_KEYS.resolution);
  const rawSafeAutoSizing =
    storage.getItem(PRESENTATION_SETTINGS_STORAGE_KEYS.safeAutoSizing);
  const safeAutoSizingParsed = parseCookieBoolean(rawSafeAutoSizing);

  return {
    aspectRatio: isAspectRatioKey(rawAspect) ? rawAspect : fallback.aspectRatio,
    resolution: isResolutionKey(rawRes) ? rawRes : fallback.resolution,
    safeAutoSizing:
      safeAutoSizingParsed === null
        ? fallback.safeAutoSizing
        : safeAutoSizingParsed,
  };
}
