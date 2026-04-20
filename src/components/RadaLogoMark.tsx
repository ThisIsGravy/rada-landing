import radaLogo from "../assets/rada-logo.svg";

type RadaLogoMarkProps = {
  alt?: string;
  className?: string;
};

export default function RadaLogoMark({
  alt = "Rada logo",
  className = "",
}: RadaLogoMarkProps) {
  return (
    <img
      alt={alt}
      className={className}
      draggable={false}
      src={radaLogo}
    />
  );
}
