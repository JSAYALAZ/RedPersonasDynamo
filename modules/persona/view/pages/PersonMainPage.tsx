"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const items = d.items;

  const canViewDetails = selectedIds.length === 1;
  const selectedId = canViewDetails ? selectedIds[0] : null;

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-auto bg-gray-50 text-gray-900 font-sans">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur px-5 py-4">
        <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
              People
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              {items.length} item{items.length === 1 ? "" : "s"}
            </p>

            {selectedIds.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Selected:{" "}
                <span className="font-mono text-emerald-600">
                  {selectedIds.length}/2
                </span>
              </p>
            )}
          </div>

          {canViewDetails && selectedId && (
            <button
              onClick={() => router.push(`/u/${selectedId.split("u")[1]}`)}
              className="shrink-0 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              title="View details"
            >
              Ver detalles
            </button>
          )}
        </div>
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
                  "rounded-2xl border p-4 transition-all duration-200 shadow-sm",
                  "cursor-pointer bg-white hover:bg-gray-100 hover:shadow-md",
                  selected
                    ? "border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50"
                    : "border-gray-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden
                    className={[
                      "h-10 w-10 overflow-hidden rounded-xl border bg-gray-100 transition",
                      selected ? "border-emerald-400" : "border-gray-200",
                    ].join(" ")}
                  >
                    <img
                      src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {p.name}
                      </span>

                      <span className="shrink-0 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                        {p.residence}
                      </span>

                      {selected && (
                        <span className="ml-auto shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                          ✓ Selected
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 min-w-0">
                      <span className="truncate font-mono text-[11px] text-gray-400">
                        {p.id}
                      </span>

                      <span className="opacity-60">•</span>

                      <span className="text-gray-600">@{p.nickname}</span>
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
