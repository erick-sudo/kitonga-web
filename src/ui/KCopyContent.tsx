import { ContentCopy } from "@mui/icons-material";

export interface KCopyContentProps {
  iconClassName?: string;
  className?: string;
  value: string;
}

export function KCopyContent({
  iconClassName,
  className = "p-1",
  value,
}: KCopyContentProps) {
  return (
    <span key={`${value}`} className={`${className} cursor-pointer`}>
      <ContentCopy className={`${iconClassName}`} fontSize="small" />
    </span>
  );
}
