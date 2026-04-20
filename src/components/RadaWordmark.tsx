import radaWordmark from "../assets/rada-wordmark.svg";

type RadaWordmarkProps = {
  alt?: string;
  className?: string;
  showMark?: boolean;
};

export default function RadaWordmark({
  alt = "Rada wordmark",
  className = "",
  showMark = true,
}: RadaWordmarkProps) {
  if (!showMark) {
    return (
      <span
        aria-label={alt}
        className={`inline-flex items-center justify-start whitespace-nowrap select-none text-[2rem] font-black uppercase tracking-[-0.04em] text-white [text-shadow:0_8px_18px_rgba(10,16,22,0.32),0_2px_4px_rgba(10,16,22,0.18)] ${className}`}
      >
        RADA
      </span>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      draggable={false}
      src={radaWordmark}
    />
  );
}
