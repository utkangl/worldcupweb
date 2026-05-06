const FEATURED_MATCH_KEY = "wc-pulse-featured-match-v1";
const FEATURED_MATCH_EVENT = "wc-pulse-featured-match";

export function loadFeaturedMatchId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(FEATURED_MATCH_KEY) ?? "";
}

export function saveFeaturedMatchId(matchId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FEATURED_MATCH_KEY, matchId);
  window.dispatchEvent(new CustomEvent(FEATURED_MATCH_EVENT, { detail: matchId }));
}

export function onFeaturedMatchChange(handler: (matchId: string) => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === FEATURED_MATCH_KEY) handler(e.newValue ?? "");
  };
  const onCustom = (e: Event) => {
    const custom = e as CustomEvent<string>;
    handler(custom.detail ?? loadFeaturedMatchId());
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(FEATURED_MATCH_EVENT, onCustom as EventListener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(FEATURED_MATCH_EVENT, onCustom as EventListener);
  };
}
