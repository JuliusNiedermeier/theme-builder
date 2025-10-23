import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/app/_components/ui/input-group";
import { ControlPointKey } from "@/app/_core/size/config";
import { FC } from "react";
import { useSizeCollection } from "../../_state/size-store";
import { SizeCollectionItem } from "@/app/_core/size-collection";
import { resolveChangeRequestToNumber } from "@/app/_utils/input-adapter";

interface Props {
  item: SizeCollectionItem;
  controlPointKey: ControlPointKey;
}

export const CustomSizeLimitInput: FC<Props> = ({ item, controlPointKey }) => {
  const mutateItem = useSizeCollection((state) => state.mutateItem);

  const value = item.size[controlPointKey].limit.size || item.size[controlPointKey].size;

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
                    size: resolveChangeRequestToNumber(changeRequest, () => value),
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

      <div className="flex items-start justify-between gap-2 rounded-md bg-input/20 px-3 py-2 text-xs mt-4">
        <div className="text-muted-foreground">
          <span className="block">{controlPointKey === "narrow" ? "Min" : "Max"} view</span>
          <span>-</span>
        </div>
        <span>- px</span>
      </div>
    </div>
  );
};
