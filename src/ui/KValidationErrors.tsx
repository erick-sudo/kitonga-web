export function KValidationErrors({
  errorKey,
  errors,
  className,
}: {
  className?: string;
  errorKey: string;
  errors: Record<string, string[]>;
}) {
  return (
    <div className={`text-red-500 text-xs font-semibold ${className}`}>
      {errors[errorKey]?.map((err, index) => (
        <div key={index}>{err}</div>
      ))}
    </div>
  );
}
