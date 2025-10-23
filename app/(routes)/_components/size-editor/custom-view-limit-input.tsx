import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/app/_components/ui/input-group";
import { ControlPointKey } from "@/app/_core/size/config";
import { ChevronsUpDownIcon } from "lucide-react";
import { FC } from "react";
import { useSizeCollection } from "../../_state/size-store";
import { SizeCollectionItem } from "@/app/_core/size-collection";
import { resolveChangeRequestToNumber } from "@/app/_utils/input-adapter";
import { getClosestDevice } from "../../_utils/device-list";

interface Props {
  item: SizeCollectionItem;
  controlPointKey: ControlPointKey;
}

export const CustomViewLimitInput: FC<Props> = ({ item, controlPointKey }) => {
  const mutateItem = useSizeCollection((state) => state.mutateItem);

  const value = item.size[controlPointKey].limit.view || item.size[controlPointKey].view;

  const closestDevice = getClosestDevice(item.size[controlPointKey].view * 16);

  return (
    <div className="flex flex-col gap-2">
      <InputGroup>
        <InputGroupInput
          value={value.toString()}
          onChangeRequest={(changeRequest) =>
            mutateItem(item.id, {
              size: {
                [controlPointKey]: {
                  limit: {
                    view: resolveChangeRequestToNumber(changeRequest, () => value),
                  },
                },
              },
            })
          }
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton disabled>REM</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="px-3 flex items-center text-xs gap-1">
        <span className="whitespace-nowrap">{closestDevice.key}</span>
        <span className="text-muted-foreground block ml-auto whitespace-nowrap">{closestDevice.width}px</span>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-md bg-input/20 px-3 py-2 text-xs mt-4">
        <span className="text-muted-foreground">{controlPointKey === "narrow" ? "Min" : "Max"} size</span>
        <span>- rem</span>
      </div>
    </div>
  );
};
