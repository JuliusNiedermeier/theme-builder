import { Input } from "@/app/_components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/app/_components/ui/toggle-group";
import { ALargeSmallIcon, Trash2Icon, VectorSquareIcon } from "lucide-react";
import { ComponentProps, FC } from "react";
import { ControlPointInputs } from "./control-point-inputs";
import { LimitInputs } from "./limit-inputs";
import { SizeCollectionItem } from "@/app/_core/size-collection";
import { useSizeCollection } from "../../_state/size-store";
import { resolveChangeRequestToString } from "@/app/_utils/input-adapter";
import { Button } from "@/app/_components/ui/button";

interface Props extends ComponentProps<"div"> {
  item: SizeCollectionItem;
}

export const SizeEditor: FC<Props> = ({ item, ...restProps }) => {
  const mutateItem = useSizeCollection((store) => store.mutateItem);

  const removeItem = useSizeCollection((store) => store.remove);

  return (
    <div {...restProps}>
      <div className="flex gap-4 border-b p-4 items-center">
        <Input
          autoFocus
          placeholder="Size name..."
          value={item.name}
          onChangeRequest={(changeRequest) =>
            mutateItem(item.id, {
              name: resolveChangeRequestToString(changeRequest, () => item.name),
            })
          }
        />
        <ToggleGroup variant="outline" type="single" size="sm" defaultValue="size">
          <ToggleGroupItem value="size" aria-label="System theme">
            <VectorSquareIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="typography" aria-label="Light theme">
            <ALargeSmallIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.id)}>
          <Trash2Icon />
        </Button>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        <ControlPointInputs item={item} controlPointKey="narrow" />
        <ControlPointInputs item={item} controlPointKey="wide" />
      </div>
      <div className="p-4 grid grid-cols-2 gap-2 items-start">
        <LimitInputs item={item} controlPointKey="narrow" />
        <LimitInputs item={item} controlPointKey="wide" />
      </div>
    </div>
  );
};
