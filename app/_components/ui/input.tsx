import * as React from "react";

import { cn } from "@/app/_utils/cn";

export interface SetChangeRequest {
  type: "set";
  value: string | null;
}

export interface ModifyChangeRequest {
  type: "modify";
  direction: "increment" | "decrement";
  adjustment?: "small" | "medium" | "large";
}

export type ChangeRequest = SetChangeRequest | ModifyChangeRequest;

interface Props extends React.ComponentProps<"input"> {
  onChangeRequest?: (changeRequest: ChangeRequest) => void;
  value?: string;
}

function Input({ className, value, onChange, onChangeRequest, ...props }: Props) {
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => setInternalValue(value), [value]);

  const discardOnBlur = React.useRef(false);

  const handleChange: React.ComponentProps<"input">["onChange"] = (e) => {
    setInternalValue(e.currentTarget.value);
    onChange?.(e);
  };

  const handleKeyDown: React.ComponentProps<"input">["onKeyDown"] = (e) => {
    if (e.key === "Enter") e.currentTarget.blur();

    if (e.key === "Escape") {
      discardOnBlur.current = true;
      e.currentTarget.blur();
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      onChangeRequest?.({
        type: "modify",
        direction: e.key === "ArrowUp" ? "increment" : "decrement",
        adjustment: e.shiftKey ? "large" : e.altKey ? "small" : "medium",
      });
    }
  };

  const handleBlur = () => {
    if (discardOnBlur.current) setInternalValue(value);
    else {
      onChangeRequest?.({
        type: "set",
        value: internalValue === undefined ? null : internalValue,
      });
    }

    discardOnBlur.current = false;
  };

  return (
    <>
      <input
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...props}
      />
    </>
  );
}

export { Input };
