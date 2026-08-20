import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { TierId } from "./gift";

export type BuilderState = {
  recipientName: string;
  senderName: string;
  relationship: string;
  occasion: string;
  personalityTags: string[];
  insideJoke: string;
  photos: string[];
  spotifyUrl: string;
  cardMessage: string;
  tier: TierId | null;
  addOns: string[];
  pincode: string;
};

const EMPTY: BuilderState = {
  recipientName: "",
  senderName: "",
  relationship: "",
  occasion: "",
  personalityTags: [],
  insideJoke: "",
  photos: [],
  spotifyUrl: "",
  cardMessage: "",
  tier: null,
  addOns: [],
  pincode: "",
};

const STORAGE_KEY = "gift-architects-builder";

/** Read localStorage synchronously so the first render already has the saved draft. */
function loadDraft(): BuilderState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* corrupted or unavailable — fall through */
  }
  return EMPTY;
}

function saveDraft(state: BuilderState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

type Ctx = {
  state: BuilderState;
  set: (patch: Partial<BuilderState>) => void;
  toggle: (key: "personalityTags" | "addOns", value: string) => void;
  reset: () => void;
};

const BuilderContext = createContext<Ctx | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BuilderState>(loadDraft);

  /** Write-through: persist every state change to localStorage. */
  function setAndPersist(updater: (prev: BuilderState) => BuilderState) {
    setState((prev) => {
      const next = updater(prev);
      saveDraft(next);
      return next;
    });
  }

  const value = useMemo<Ctx>(
    () => ({
      state,
      set: (patch) => setAndPersist((prev) => ({ ...prev, ...patch })),
      toggle: (key, val) =>
        setAndPersist((prev) => ({
          ...prev,
          [key]: prev[key].includes(val)
            ? prev[key].filter((v) => v !== val)
            : [...prev[key], val],
        })),
      reset: () => {
        setState(EMPTY);
        saveDraft(EMPTY);
      },
    }),
    [state],
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used inside BuilderProvider");
  return ctx;
}
