"use client";

export default function CreateRelationButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition",
        "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-indigo-500",
        "flex items-center gap-2",
      ].join(" ")}
      title={disabled ? "Select 2 persons first" : "Create relation"}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">↔</span>
      <span className="hidden sm:inline">Add relation</span>
    </button>
  );
}