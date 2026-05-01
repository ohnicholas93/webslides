export const PRESENTATION_CLIENT_ID_STORAGE_KEY = "webslides_client_id";
export const PRESENTATION_SESSION_ID_STORAGE_KEY = "webslides_session_id";
export const PRESENTATION_WS_URL_STORAGE_KEY = "webslides_ws_url";
export const DEFAULT_PRESENTATION_WS_URL = "ws://localhost:8787";

export type PresentationRole = "presenter" | "viewer" | "presenter-view";

export type PresentationSessionMessage =
  | {
      type: "hello";
      sessionId: string;
      clientId: string;
      role: PresentationRole;
    }
  | {
      type: "slide:set";
      sessionId: string;
      clientId: string;
      slideIndex: number;
    }
  | {
      type: "metadata:update";
      sessionId: string;
      clientId: string;
      metadata: unknown;
    };

function getStoredOrCreate(key: string, prefix: string) {
  if (typeof window === "undefined") return `${prefix}-server`;

  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(key, id);
  return id;
}

export function getPresentationClientId() {
  return getStoredOrCreate(PRESENTATION_CLIENT_ID_STORAGE_KEY, "client");
}

export function getPresentationSessionId() {
  return getStoredOrCreate(PRESENTATION_SESSION_ID_STORAGE_KEY, "session");
}

export function setPresentationSessionId(value: string) {
  window.localStorage.setItem(PRESENTATION_SESSION_ID_STORAGE_KEY, value);
}

export function getPresentationWsUrl() {
  if (typeof window === "undefined") return DEFAULT_PRESENTATION_WS_URL;
  return (
    window.localStorage.getItem(PRESENTATION_WS_URL_STORAGE_KEY) ??
    DEFAULT_PRESENTATION_WS_URL
  );
}

export function setPresentationWsUrl(value: string) {
  window.localStorage.setItem(PRESENTATION_WS_URL_STORAGE_KEY, value);
}

export function isPresentationSessionMessage(
  value: unknown
): value is PresentationSessionMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<PresentationSessionMessage>;
  const hasRoutingFields =
    typeof message.sessionId === "string" &&
    typeof message.clientId === "string";

  if (!hasRoutingFields) return false;

  if (message.type === "hello") {
    return (
      message.role === "presenter" ||
      message.role === "viewer" ||
      message.role === "presenter-view"
    );
  }

  if (message.type === "slide:set") {
    return (
      typeof message.slideIndex === "number" &&
      Number.isFinite(message.slideIndex)
    );
  }

  return message.type === "metadata:update" && "metadata" in message;
}
