interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'dark' | 'light';
}

export default function Logo({ size = 40, showText = true, variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-stone-100';
  const subColor = 'text-brand-400';

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/logoblanco.png"
        alt="Fimpollo"
        style={{ width: size, height: size }}
        className="flex-shrink-0 rounded-xl object-cover"
      />
      {showText && (
        <div className="leading-tight">
          <div className={`font-display text-lg font-extrabold ${textColor}`}>Fimpollo</div>
          <div className={`text-[11px] font-medium tracking-wide ${subColor}`}>DISTRIBUIDORA</div>
        </div>
      )}
    </div>
  );
}
