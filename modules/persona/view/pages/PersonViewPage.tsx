"use client";

import { useEffect, useMemo } from "react";
import useAxios from "@/src/hooks/useAxios";
import Loading from "@/src/ui/Loading";
import ErrorPage from "@/src/ui/Error";
import { PersonVIewDTO } from "../../aplication/dto/PersonVIewDTO";



export default function PersonViewPage({ id }: { id: string }) {
  // Example endpoint: /person/:pk or /person?pk=...
  // Adjust to your real route:
  const { data, error, refetch, loading } = useAxios<PersonVIewDTO>(
    `/person/${encodeURIComponent(id)}`,
  );

  useEffect(() => {
    const t = setInterval(() => {
      refetch();
    }, 30_000);

    return () => clearInterval(t);
  }, [refetch]);

  const totalPartners = useMemo(() => {
    if (!data) return 0;
    return data.relations.reduce((acc, r) => acc + r.partners.length, 0);
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <ErrorPage error={error} reset={refetch} />;
  if (!data) return null;

  return (
    <div className="w-[100dvw] min-h-[100dvh] bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur px-5 py-4">
        <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-semibold tracking-tight">
              {data.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5">
                @{data.nickname}
              </span>
              <span className="opacity-60">•</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5">
                {data.residence}
              </span>
              <span className="opacity-60">•</span>
              <span className="truncate font-mono text-[11px] text-zinc-500">
                {data.pk}
              </span>
            </div>
          </div>

          <button
            onClick={refetch}
            className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/[0.06]"
            title="Refresh now"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl p-5">
        {/* Quick stats */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Relation groups" value={data.relations.length} />
          <Stat label="Partners total" value={totalPartners} />
          <Stat label="Auto refresh" value="30s" />
        </div>

        {/* Relations */}
        <div className="grid gap-3">
          {data.relations.length === 0 ? (
            <EmptyState />
          ) : (
            data.relations.map((rel) => (
              <section
                key={rel.type}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold">{rel.type}</h2>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-300">
                    {rel.partners.length} partner
                    {rel.partners.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-3 grid gap-2">
                  {rel.partners.map((p, idx) => (
                    <div
                      key={`${rel.type}-${idx}-${p.name}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/30 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {p.name}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                          {p.id}
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-300">
                        importance: {p.importante}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <p className="text-sm font-semibold">No relations yet</p>
      <p className="mt-1 text-xs text-zinc-400">
        Create a relation to see grouped partners here.
      </p>
    </div>
  );
}