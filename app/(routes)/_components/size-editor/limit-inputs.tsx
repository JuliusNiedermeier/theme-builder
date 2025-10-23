"use client";

import { Toggle } from "@/app/_components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/app/_components/ui/toggle-group";
import { ControlPointKey } from "@/app/_core/size/config";
import {
  AlignStartVerticalIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  Link2Icon,
  MinusIcon,
  MoveHorizontalIcon,
  ProportionsIcon,
} from "lucide-react";
import { FC } from "react";
import { useSizeCollection } from "../../_state/size-store";
import { CustomViewLimitInput } from "./custom-view-limit-input";
import { CustomSizeLimitInput } from "./custom-size-limit-input";
import { SizeCollectionItem } from "@/app/_core/size-collection";

type Props = {
  item: SizeCollectionItem;
  controlPointKey: ControlPointKey;
};

export const LimitInputs: FC<Props> = ({ item, controlPointKey }) => {
  const mutateItem = useSizeCollection((store) => store.mutateItem);

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-2">
      <div className="flex flex-col gap-2 col-span-2">
        <div className="px-3 py-2 flex gap-2 items-center">
          {controlPointKey === "narrow" ? (
            <ArrowLeftToLineIcon className="size-4 shrink-0" />
          ) : (
            <ArrowRightToLineIcon className="size-4 shrink-0" />
          )}
          <span className="text-sm whitespace-nowrap">
            {controlPointKey === "narrow" ? "Minnimum" : "Maximum"} size
          </span>
        </div>
      </div>

      <ToggleGroup
        variant="outline"
        type="single"
        size="sm"
        className="w-full"
        value={item.size[controlPointKey].limit.type}
        onValueChange={(value) =>
          mutateItem(item.id, {
            size: { [controlPointKey]: { limit: { type: value } } },
          })
        }
      >
        <ToggleGroupItem value="no-limit" aria-label="System theme">
          <MinusIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="control-point" aria-label="Light theme">
          <AlignStartVerticalIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="custom-view" aria-label="Dark theme">
          <ProportionsIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="custom-size" aria-label="Dark theme">
          <MoveHorizontalIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Toggle disabled>
        <Link2Icon className="size-4" />
      </Toggle>

      {item.size[controlPointKey].limit.type === "custom-view" && (
        <CustomViewLimitInput item={item} controlPointKey={controlPointKey} />
      )}

      {item.size[controlPointKey].limit.type === "custom-size" && (
        <CustomSizeLimitInput item={item} controlPointKey={controlPointKey} />
      )}
    </div>
  );
};
