import { useEffect, useState } from "react";

/**
 * Copie un texte dans le presse-papiers.
 *
 * En contexte non sécurisé (http) ou si la permission est refusée, l'API
 * n'existe pas ou lève : on repasse alors en « Sélectionnez et copiez » plutôt
 * que d'afficher un succès qui n'a pas eu lieu — le lecteur croirait avoir le
 * prompt en main et collerait du vide.
 */
export function useCopy(text: string) {
  const [etat, setEtat] = useState<"repos" | "copie" | "echec">("repos");

  useEffect(() => {
    if (etat === "repos") return;
    const t = setTimeout(() => setEtat("repos"), 2500);
    return () => clearTimeout(t);
  }, [etat]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setEtat("copie");
    } catch {
      setEtat("echec");
    }
  }

  return { etat, copy };
}

export function CopyButton({
  text,
  className = "",
  label = "Copier le prompt",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const { etat, copy } = useCopy(text);

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`rounded-full border-2 border-ink px-5 py-2 text-sm font-bold chip-shadow transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
        etat === "echec" ? "bg-[var(--yellow)] text-[var(--ink)]" : "bg-[var(--blue)] text-white"
      } ${className}`}
    >
      {etat === "copie" ? "Copié ✓" : etat === "echec" ? "Sélectionnez le texte" : label}
    </button>
  );
}
