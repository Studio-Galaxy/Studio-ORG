import type { ComponentProps } from "react";

// Rounded stage for capability visuals. Children size themselves in cqw.
export function Panel({ className = "", children, ...rest }: ComponentProps<"div">) {
  return (
    <div {...rest} className={`@container relative aspect-[4/3.4] w-full overflow-hidden rounded-[28px] md:aspect-[4/3] md:rounded-[40px] ${className}`}>
      {children}
    </div>
  );
}
