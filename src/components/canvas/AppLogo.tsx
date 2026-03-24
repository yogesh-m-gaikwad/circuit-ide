export const AppLogo = () => {
  return (
    <div className="flex items-center gap-1.5 px-3 h-full border-r border-zinc-800 shrink-0">
      <img src="/images/logo.svg" className="h-[20px]" />
      <span className="text-xs font-medium text-white tracking-wide">
        Circuit<span className="text-chart-2">Forge</span>
      </span>
    </div>
  );
};
