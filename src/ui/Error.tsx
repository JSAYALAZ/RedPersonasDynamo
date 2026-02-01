"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorPageProps {
  error: (Error & { digest?: string }) | string;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-gradient-to-br from-rose-50 to-red-100 dark:from-neutral-900 dark:to-neutral-800">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%] max-w-md p-8 rounded-3xl shadow-xl backdrop-blur-md bg-white/70 dark:bg-white/5 text-center space-y-6"
      >
        <AlertTriangle className="mx-auto w-16 h-16 text-red-600 drop-shadow-sm" />

        <h1 className="text-3xl font-bold text-red-700 dark:text-red-500">
          ¡Ups! Algo salió mal
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          No pudimos completar tu solicitud. Intenta de nuevo o regresa más
          tarde.
        </p>

        <button
          type="button"
          onClick={reset}
          className="px-6 py-2 rounded-full font-medium bg-red-600 hover:bg-red-700 active:scale-95 transition text-white shadow-sm"
        >
          Reintentar
        </button>
      </motion.div>
    </div>
  );
}
