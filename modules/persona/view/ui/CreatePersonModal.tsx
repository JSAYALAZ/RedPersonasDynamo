"use client";

import { useEffect, useMemo, useState } from "react";
import { PersonCreateDTO } from "../../aplication/dto/PersonCreateDTO";

export default function CreatePersonModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: PersonCreateDTO) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PersonCreateDTO>({
    name: "",
    nickname: "",
    residence: "",
    email: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.nickname.trim().length > 0 &&
      form.residence.trim().length > 0 &&
      form.email.trim().includes("@")
    );
  }, [form]);

  useEffect(() => {
    if (!open) return;
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setLoading(false);
      setForm({ name: "", nickname: "", residence: "", email: "" });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Create person</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Add a new profile to your SocialGraph.
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
              onCreate({
                name: form.name.trim(),
                nickname: form.nickname.trim(),
                residence: form.residence.trim(),
                email: form.email.trim(),
              });
            }}
          >
            <Field
              label="Name"
              placeholder="Jose Ayala"
              value={form.name}
              onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            />
            <Field
              label="Nickname"
              placeholder="jsayala"
              value={form.nickname}
              onChange={(v) => setForm((s) => ({ ...s, nickname: v }))}
            />
            <Field
              label="Residence"
              placeholder="Quito"
              value={form.residence}
              onChange={(v) => setForm((s) => ({ ...s, residence: v }))}
            />
            <Field
              label="Email"
              placeholder="jsayala@hotmail.com"
              value={form.email}
              onChange={(v) => setForm((s) => ({ ...s, email: v }))}
              type="email"
            />

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
                disabled={!canSubmit || loading}
                onClick={() => setLoading(true)}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Creating..." : "Crear"}
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
      />
    </label>
  );
}
