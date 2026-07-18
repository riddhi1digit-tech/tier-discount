import {
  CartInput,
  CartLinesDiscountsGenerateRunResult,
  ProductDiscountSelectionStrategy,
} from "../generated/api";

type Tier = {
  minQty: number;
  discount: number;
};

type DiscountConfiguration = {
  selectedCollectionIds?: string[];
  tiers?: Tier[];
  excludeGiftCards?: boolean;
  excludeFreeGift?: boolean;
};

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  console.log("========== FUNCTION INPUT ==========");
  console.log(JSON.stringify(input, null, 2));
  console.log("====================================");

  const configuration = input.discount.metafield
    ?.jsonValue as DiscountConfiguration | undefined;

  if (!configuration) {
    console.log("No discount configuration found.");
    return {
      operations: [],
    };
  }

  const tiers = Array.isArray(configuration.tiers)
    ? [...configuration.tiers]
        .filter(
          (tier) =>
            Number.isFinite(Number(tier.minQty)) &&
            Number.isFinite(Number(tier.discount)) &&
            Number(tier.minQty) > 0 &&
            Number(tier.discount) > 0,
        )
        .map((tier) => ({
          minQty: Number(tier.minQty),
          discount: Number(tier.discount),
        }))
        .sort((a, b) => b.minQty - a.minQty)
    : [];

  if (tiers.length === 0) {
    console.log("No valid tiers found.");
    return {
      operations: [],
    };
  }

  const candidates = input.cart.lines.flatMap((line) => {
    if (line.merchandise.__typename !== "ProductVariant") {
      return [];
    }

    const product = line.merchandise.product;

    // Exclude gift cards when enabled in configuration
    if (
      configuration.excludeGiftCards !== false &&
      product.isGiftCard
    ) {
      return [];
    }

    // Product must belong to the merchant-selected collection
    if (!product.inAnyCollection) {
      return [];
    }

    // Find the highest tier matching this individual cart line quantity
    const matchedTier = tiers.find(
      (tier) => line.quantity >= tier.minQty,
    );

    if (!matchedTier) {
      return [];
    }

    console.log(
      `Line ${line.id}: quantity ${line.quantity}, discount ${matchedTier.discount}%`,
    );

    return [
      {
        message: `${matchedTier.discount}% OFF`,
        targets: [
          {
            cartLine: {
              id: line.id,
            },
          },
        ],
        value: {
          percentage: {
            value: matchedTier.discount,
          },
        },
      },
    ];
  });

  if (candidates.length === 0) {
    console.log("No eligible cart lines found.");
    return {
      operations: [],
    };
  }

  console.log(
    "========== DISCOUNT CANDIDATES ==========",
  );
  console.log(JSON.stringify(candidates, null, 2));
  console.log("=========================================");

  return {
    operations: [
      {
        productDiscountsAdd: {
          selectionStrategy:
            ProductDiscountSelectionStrategy.All,
          candidates,
        },
      },
    ],
  };
}