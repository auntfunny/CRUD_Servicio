export default function FunvalBrand({
  compact = false,
  textColor = "text-white",
  iconClassName = "bg-white/20",
  imageClassName = "h-8 w-8 rounded-full",
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm ${iconClassName}`}>
        <img alt="FUNVAL" className={imageClassName} src="/icons/icoFunval.jpg" />
      </div>
      {!compact ? (
        <div>
          <h1 className={`font-montserrat text-2xl font-bold tracking-[0.2em] ${textColor}`}>
            FUNVAL
          </h1>
        </div>
      ) : null}
    </div>
  );
}
