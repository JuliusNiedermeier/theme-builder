import { ResolvedSize } from "@/app/_core/size";
import { cn } from "@/app/_utils/cn";
import { ComponentProps, FC } from "react";

interface Props extends ComponentProps<"div"> {
  size: ResolvedSize;
}

export const SizeBar: FC<Props> = ({ size, className, ...restProps }) => {
  return <div className={cn("h-2 bg-blue-500", className)} style={{ width: size.css }} {...restProps} />;
};
