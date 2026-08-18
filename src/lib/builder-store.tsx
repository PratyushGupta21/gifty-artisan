import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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

const STORAGE_KEY = "little-box-builder";

type Ctx = {
  state: BuilderState;
  set: (patch: Partial<BuilderState>) => void;
  toggle: (key: "personalityTags" | "addOns", value: string) => void;
  reset: () => void;
};

const BuilderContext = createContext<Ctx | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BuilderState>(EMPTY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      /* ignore corrupted drafts */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      set: (patch) => setState((prev) => ({ ...prev, ...patch })),
      toggle: (key, val) =>
        setState((prev) => ({
          ...prev,
          [key]: prev[key].includes(val)
            ? prev[key].filter((v) => v !== val)
            : [...prev[key], val],
        })),
      reset: () => setState(EMPTY),
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
