export const QUALITY = ["common", "uncommon", "rare", "legendary"] as const;

export type ItemQuality = (typeof QUALITY)[number];

export type Item = {
  name: string;
  quality: ItemQuality;
  value: number;
};

export type ItemWithId = Item & {
  id: string;
};
