declare const __CARD_VERSION__: string;

interface Window {
  customCards?: Array<{
    type: string;
    name: string;
    description?: string;
    preview?: boolean;
    documentationURL?: string;
    getEntitySuggestion?: (hass: unknown, entityId: string) => { config: object } | null;
  }>;
}
