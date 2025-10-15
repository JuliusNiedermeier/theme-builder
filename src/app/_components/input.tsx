import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../_utils/cn";

type Props = ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, ...restProps }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "bg-neutral-200 outline-none rounded px-2 py-1 text-sm",
          className
        )}
        {...restProps}
      />
    );
  }
);

Input.displayName = "Input";
