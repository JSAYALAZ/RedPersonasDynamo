"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";



function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
      {label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [name]);

  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">
      {initials}
    </div>
  );
}

function PersonCard({ p, accent }: { p: any; accent?: "emerald" | "indigo" }) {
  const ring =
    accent === "emerald"
      ? "ring-1 ring-emerald-300/60"
      : accent === "indigo"
      ? "ring-1 ring-indigo-300/60"
      : "ring-1 ring-gray-200";

  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ${ring}`}>
      <Avatar name={p.name} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">{p.name}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <span className="truncate font-mono text-[11px] text-gray-500">
            @{p.nickname}
          </span>
          <Badge label={p.residence} />
        </div>
      </div>
    </div>
  );
}

export default function CommonFriendsPage() {
  const [data, setData] = useState<any>();

  const params= useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      const id1 = params.get("id1")?.split("u")[1];
      const id2 = params.get("id2")?.split("u")[1];
      const res = await fetch(
        `/api/common?id1=${id1}&id2=${id2}`
      );
      const json = await res.json();
      setData(json.data);
    }
    fetchData();
  }, [params]);


  if(!data) return null
  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Amigos en común
              </h1>
              <p className="text-sm text-gray-600">
                Comparando relaciones entre dos personas (sin chisme… bueno, un poquito).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* <Badge label={`Total: ${data.common.length}`} /> */}
            </div>
          </div>

          {/* Person 1 / Person 2 */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <PersonCard p={data.person1} accent="emerald" />
            <PersonCard p={data.person2} accent="indigo" />
          </div>

        </div>
      </header>

      {/* List */}
      <main className="mx-auto max-w-5xl px-5 py-6">
        {data.common.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
            No hay resultados con esos filtros. Tus amigos en común se esconden mejor que un bug en producción.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.common.map((c:any, idx:any) => (
              <div
                key={`${c.nickname}-${idx}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={c.name} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {c.name}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="truncate font-mono text-[11px] text-gray-500">
                        @{c.nickname}
                      </span>
                      <Badge label={c.residence} />
                    </div>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-600 transition group-hover:border-emerald-300 group-hover:text-emerald-700">
                  Común
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}