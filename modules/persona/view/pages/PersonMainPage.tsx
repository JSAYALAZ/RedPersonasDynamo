"use client";

import { useRouter } from "next/navigation";
import { PersonListDTO } from "../../aplication/dto/PersonListDTO";
import Link from "next/link";

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

  // ✅ NUEVO: exactamente 2 seleccionados
  const canViewCommon = selectedIds.length === 2;
  const id1 = canViewCommon ? selectedIds[0] : null;
  const id2 = canViewCommon ? selectedIds[1] : null;

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

          <div className="flex items-center gap-2">
            <Link
              href={"/most_relation"}
              target="_blank"
              className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span>Ver persona con más relaciones</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* ✅ NUEVO: botón visible solo con 2 seleccionados */}
            {canViewCommon && id1 && id2 && (
              <Link
                href={`/common?id1=${encodeURIComponent(id1)}&id2=${encodeURIComponent(
                  id2
                )}`}
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
                title="Ver amigos en común"
              >
                <span>Ver amigos en común</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
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
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
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
                  "rounded-2xl border p-3 transition-all duration-200 shadow-sm",
                  "cursor-pointer bg-white hover:bg-gray-100 hover:shadow-md",
                  selected
                    ? "border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50"
                    : "border-gray-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
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