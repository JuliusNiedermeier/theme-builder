import {
  addSize,
  createDefaultSize,
  mutateSize,
  removeSize,
  SizeCollection,
  SizeCollectionItem,
} from "@/app/_core/size-collection";
import { mutateSimulatedView, SimulatedView } from "@/app/_core/size-simulation";
import { DeepPartial } from "@/app/_utils/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SizeCollectionStore {
  simulatedView: SimulatedView;
  sizes: SizeCollection;

  add: () => void;
  remove: (id: SizeCollectionItem["id"]) => void;
  mutateItem: (id: SizeCollectionItem["id"], changes: DeepPartial<SizeCollectionItem>) => void;
  mutateSimulatedView: (view: SimulatedView) => void;
}

export const useSizeCollection = create<SizeCollectionStore>()(
  persist(
    (set) => ({
      simulatedView: null,
      sizes: [createDefaultSize("Size 1")],

      add: () => {
        set(({ sizes }) => ({ sizes: addSize(sizes) }));
      },

      remove: (id) => {
        set(({ sizes }) => ({ sizes: removeSize(id, sizes) }));
      },

      mutateItem: (id, changes) => {
        set(({ sizes }) => ({ sizes: mutateSize(id, changes, sizes) }));
      },

      mutateSimulatedView: (view) => {
        set(() => ({ simulatedView: mutateSimulatedView(view) }));
      },
    }),
    { name: "size-store" },
  ),
);
