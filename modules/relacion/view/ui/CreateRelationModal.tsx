"use client";

import { useEffect, useMemo, useState } from "react";
import { RelationType } from "../../domain/enum/RelationType";


export default function CreateRelationModal({
  open,
  onClose,
  fromTo,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  fromTo: string[]; 
  onCreate: (type: RelationType) => void;
}) {
  const [type, setType] = useState<RelationType>(RelationType.FRIEND);

  const canSubmit = useMemo(() => fromTo.length === 2, [fromTo]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setType(RelationType.FRIEND);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Create relation</h2>
              <p className="mt-1 text-sm text-zinc-400">
                {fromTo.length === 2
                  ? `Between ${fromTo[0]} and ${fromTo[1]}`
                  : "Select 2 persons first."}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-sm text-zinc-300 hover:bg-white/[0.06]"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <form
            className="mt-4 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              onCreate(type);
            }}
          >
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-300">Relation type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RelationType)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              >
                {Object.values(RelationType).map((t) => (
                  <option key={t} value={t} className="bg-zinc-950">
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 hover:bg-white/[0.06]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </form>

          <p className="mt-3 text-xs text-zinc-500">
            Tip: press <span className="font-mono">Esc</span> to close.
          </p>
        </div>
      </div>
    </div>
  );
}