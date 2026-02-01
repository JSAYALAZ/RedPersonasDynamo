import { Dispatch, SetStateAction } from "react";

export default function CreatePersonButton({
  openModal,
}: {
  openModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <button
      onClick={() => openModal(true)}
      className="group flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold 
      text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.99]
      hover:cursor-pointer"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-zinc-950/10">
        +
      </span>
      <span className="hidden sm:inline">Add person</span>
    </button>
  );
}
