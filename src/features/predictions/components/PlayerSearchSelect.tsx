"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlayerOption } from "@/lib/types";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

/** Cap rendered rows for performance when the pool grows into the thousands */
const MAX_LIST = 250;

export function PlayerSearchSelect({
  id,
  label,
  players,
  value,
  onChange,
  placeholder = "Type name or country…",
}: {
  id: string;
  label: string;
  players: PlayerOption[];
  value: string;
  onChange: (playerId: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => players.find((p) => p.id === value),
    [players, value]
  );

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return players.slice(0, MAX_LIST);
    return players
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
      )
      .slice(0, MAX_LIST);
  }, [players, q]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  const displayValue = open
    ? query
    : selected
      ? `${selected.name} (${selected.country})`
      : "";

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="block text-xs font-medium text-zinc-400">
        {label}
      </label>
      <div className="relative mt-2">
        <MaterialIcon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-zinc-500"
        />
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value) onChange("");
          }}
          onFocus={() => {
            setOpen(true);
            if (selected) setQuery("");
          }}
          className="w-full rounded-xl border border-white/10 bg-[#0e0e0f] py-3 pl-10 pr-10 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-zinc-600 focus:border-[#c3f400] focus:outline-none focus:ring-1 focus:ring-[#c3f400]"
        />
        {value ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
            aria-label="Clear"
            onClick={(e) => {
              e.preventDefault();
              onChange("");
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <MaterialIcon name="close" className="!text-xl" />
          </button>
        ) : null}
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a1b] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.65)]"
        >
          {!q && players.length > MAX_LIST && (
            <li className="px-3 py-2 text-[11px] text-zinc-500">
              Type to search — pool has {players.length} players (showing first{" "}
              {MAX_LIST} until you filter).
            </li>
          )}
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-zinc-500">No matches.</li>
          ) : (
            filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-[#CCFF00]/10 hover:text-white"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(p.id);
                    close();
                    inputRef.current?.blur();
                  }}
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-[11px] text-zinc-500">{p.country}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
