import { PersonListDTO } from "../../aplication/dto/PersonListDTO";

export default function PersonMainPage({
  d,
  selectedIds,
  onToggleSelect,
}: {
  d: PersonListDTO;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}) {
  const items = d.items;

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-auto bg-zinc-950 text-zinc-100 font-sans">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur px-5 py-4">
        <h1 className="text-[18px] font-semibold tracking-tight">People</h1>
        <p className="mt-1 text-xs text-zinc-400">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>

        {selectedIds.length > 0 && (
          <p className="mt-2 text-xs text-zinc-400">
            Selected:{" "}
            <span className="font-mono text-zinc-300">
              {selectedIds.length}/2
            </span>
          </p>
        )}
      </header>

      <main className="mx-auto w-full max-w-3xl p-5">
        <div className="grid gap-3">
          {items.map((p) => {
            const selected = selectedIds.includes(p.id);

            return (
              <article
                key={p.id}
                onClick={() => onToggleSelect(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onToggleSelect(p.id);
                }}
                className={[
                  "rounded-2xl border bg-white/[0.03] p-4 transition",
                  "cursor-pointer hover:bg-white/[0.05]",
                  selected
                    ? "border-emerald-400/50 ring-2 ring-emerald-400/10"
                    : "border-white/10",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden
                    className={[
                      "h-10 w-10 rounded-xl border bg-white/10 transition",
                      selected ? "border-emerald-400/40" : "border-white/10",
                    ].join(" ")}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-sm font-semibold">
                        {p.name}
                      </span>

                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-300">
                        {p.residence}
                      </span>

                      {selected && (
                        <span className="ml-auto shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                          ✓ Selected
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400 min-w-0">
                      <span className="truncate font-mono text-[11px] text-zinc-500">
                        {p.id}
                      </span>
                      <span className="opacity-60">•</span>
                      <span className="text-zinc-300/80">@{p.nickname}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}