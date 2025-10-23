"use client";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/app/_components/ui/input-group";
import { Toggle } from "@/app/_components/ui/toggle";
import { ChevronsLeftRightIcon, ChevronsRightLeftIcon, ChevronsUpDownIcon, Link2Icon } from "lucide-react";
import { FC } from "react";
import { useSizeCollection } from "../../_state/size-store";
import { ControlPointKey } from "@/app/_core/size/config";
import { resolveChangeRequestToNumber } from "@/app/_utils/input-adapter";
import { SizeCollectionItem } from "@/app/_core/size-collection";
import { getClosestDevice } from "../../_utils/device-list";

type Props = {
  item: SizeCollectionItem;
  controlPointKey: ControlPointKey;
};

export const ControlPointInputs: FC<Props> = ({ item, controlPointKey }) => {
  const mutateItem = useSizeCollection((state) => state.mutateItem);

  const closestDevice = getClosestDevice(item.size[controlPointKey].view * 16);

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-2">
      <div className="flex flex-col gap-2 col-span-2">
        <div className="px-3 py-2 flex gap-2 items-center">
          {controlPointKey === "narrow" ? (
            <ChevronsRightLeftIcon className="size-4 shrink-0" />
          ) : (
            <ChevronsLeftRightIcon className="size-4 shrink-0" />
          )}
          <span className="text-sm whitespace-nowrap">
            {controlPointKey === "narrow" ? "Narrow" : "Wide"} control point
          </span>
        </div>
      </div>

      <InputGroup>
        <InputGroupInput
          value={item.size[controlPointKey].size.toString()}
          onChangeRequest={(changeRequest) =>
            mutateItem(item.id, {
              size: {
                [controlPointKey]: {
                  size: resolveChangeRequestToNumber(changeRequest, () => item.size[controlPointKey].size),
                },
              },
            })
          }
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton disabled>REM</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup className="col-start-1">
        <InputGroupInput
          value={item.size[controlPointKey].view.toString()}
          onChangeRequest={(changeRequest) =>
            mutateItem(item.id, {
              size: {
                [controlPointKey]: {
                  view: resolveChangeRequestToNumber(changeRequest, () => item.size[controlPointKey].view),
                },
              },
            })
          }
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton disabled>REM</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <Toggle disabled>
        <Link2Icon className="size-4" />
      </Toggle>

      <div className="px-3 flex items-center text-xs gap-1">
        <span className="whitespace-nowrap">{closestDevice.key}</span>
        <span className="text-muted-foreground block ml-auto whitespace-nowrap">{closestDevice.width}px</span>
      </div>
    </div>
  );
};
