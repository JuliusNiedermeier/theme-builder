import { DeepPartial } from "@/app/_utils/types";
import { defaultConfig, mutate, SizeConfig } from "../size/config";
import deepmerge from "deepmerge";
import { v4 as uuid } from "uuid";

export interface SizeCollectionItem {
  id: string;
  name: string;
  size: SizeConfig;
}

export type SizeCollection = SizeCollectionItem[];

export const createDefaultSize = (name: string) => ({
  id: uuid(),
  name,
  size: defaultConfig,
});

export const addSize = (collection: SizeCollection): SizeCollection => [
  ...collection,
  createDefaultSize(`Size ${collection.length + 1}`),
];

export const removeSize = (id: SizeCollectionItem["id"], collection: SizeCollection) =>
  collection.filter((size) => size.id !== id);

export const mutateSize = (
  id: SizeCollectionItem["id"],
  changes: DeepPartial<SizeCollectionItem>,
  collection: SizeCollection,
) => {
  const index = collection.findIndex((size) => size.id === id);
  if (index < 0) return collection;

  const collectionItem = collection[index];
  const mutatedSize = mutate(collectionItem.size, changes.size || {});

  const mutatedItem = deepmerge<SizeCollectionItem, DeepPartial<SizeCollectionItem>>(collectionItem, {
    ...changes,
    size: mutatedSize,
  });

  return collection.toSpliced(index, 1, mutatedItem);
};
