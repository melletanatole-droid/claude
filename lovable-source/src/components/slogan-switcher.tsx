import { useState } from "react";

export function useSloganCycle(length: number) {
  const [index, setIndex] = useState(0);
  const cycle = () => setIndex((i) => (i + 1) % length);
  return [index, cycle] as const;
}

export function SloganDots({
  total,
  index,
  activeClassName = "bg-[var(--pink)]",
}: {
  total: number;
  index: number;
  activeClassName?: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-6 rounded-full transition ${i === index ? activeClassName : "bg-current opacity-20"}`}
        />
      ))}
      <span className="text-xs font-medium opacity-0 transition group-hover/slogan:opacity-60">
        Cliquer pour changer de version →
      </span>
    </div>
  );
}
