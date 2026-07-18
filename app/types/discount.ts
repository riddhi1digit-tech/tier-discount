export type Collection = {
  id: string;
  title: string;
  handle: string;
};

export type Tier = {
  minQty: number;
  discount: number;
};

export type DiscountForm = {
  title: string;
  collectionId: string;
  tiers: Tier[];
  excludeGiftCards: boolean;
  excludeFreeGift: boolean;
};