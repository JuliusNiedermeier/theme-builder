import { ComponentProps, FC, useState } from "react";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard } from "@uidotdev/usehooks";

interface Props extends ComponentProps<typeof Button> {
  value: string;
}

export const AddToClipboard: FC<Props> = ({ value, ...restProps }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleClick} {...restProps}>
      {copied ? <CheckIcon className="text-green-500" /> : <CopyIcon className="text-muted-foreground" />}
    </Button>
  );
};
