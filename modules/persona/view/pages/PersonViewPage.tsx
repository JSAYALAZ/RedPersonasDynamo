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
  <div className="w-[100dvw] min-h-[100dvh] bg-gray-50 text-gray-900">
    {/* Header */}
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur px-5 py-4">
      <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-gray-900">
            {data.name}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5">
              @{data.nickname}
            </span>

            <span className="opacity-60">•</span>

            <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5">
              {data.residence}
            </span>

            <span className="opacity-60">•</span>

            <span className="truncate font-mono text-[11px] text-gray-400">
              {data.pk}
            </span>
          </div>
        </div>

        <button
          onClick={refetch}
          className="shrink-0 rounded-xl border hover:cursor-pointer border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-100 hover:shadow"
        >
          Refresh
        </button>
      </div>
    </header>

    {/* Content */}
    <main className="mx-auto w-full max-w-3xl p-5">
      {/* Stats */}
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
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-gray-800">
                  {rel.type}
                </h2>

                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                  {rel.partners.length} partner
                  {rel.partners.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {rel.partners.map((p, idx) => (
                  <div
                    key={`${rel.type}-${idx}-${p.name}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {p.name}
                      </div>

                      <div className="mt-0.5 truncate font-mono text-[11px] text-gray-400">
                        {p.id}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-600">
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold text-gray-800">
        No relations yet
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Create a relation to see grouped partners here.
      </p>
    </div>
  );
}