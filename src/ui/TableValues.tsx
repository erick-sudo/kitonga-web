import { KCopyContent, KCopyContentProps } from "./KCopyContent";

export default function TableValues({
  keyClassName,
  valueClassName,
  rowClassName,
  copy,
  values,
  className,
  transformKeys,
}: {
  values: Record<string, string | number>;
  className?: string;
  keyClassName?: string;
  valueClassName?: string;
  rowClassName?: string;
  transformKeys?: (k: string) => string;
  copy?: {
    fields: string[];
    copyContentProps?: Omit<KCopyContentProps, "value">;
  };
}) {
  return (
    <div className={`${className} border`}>
      <table className={`w-full`}>
        <tbody>
          {Object.entries(values).map(([k, v], index) => (
            <tr
              key={index}
              className={`border-b last:border-none ${rowClassName}`}
            >
              <td className={`px-2 py-1 ${keyClassName} border-r`}>
                {transformKeys ? transformKeys(k) : k}
              </td>
              <td className={`px-2 py-1 ${valueClassName} flex items-center`}>
                <span className="grow">{v}</span>
                {copy && copy?.fields.includes(k) && (
                  <KCopyContent
                    {...(copy.copyContentProps || {})}
                    value={String(v)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
