/** Texte dont chaque lettre rebondit en vague (décalage de 70 ms par lettre). */
export function WaveText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`wave-text ${className}`} aria-label={text} role="text">
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ animationDelay: `${i * 0.07}s` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
