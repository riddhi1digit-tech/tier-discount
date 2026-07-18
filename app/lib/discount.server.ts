export async function createAutomaticDiscount(
  admin: any,
  formData: any,
) {
  console.log("=================================");
  console.log("RECEIVED FORM DATA");
  console.log(JSON.stringify(formData, null, 2));
  console.log("TITLE:", formData?.title);
  console.log("COLLECTION:", formData?.collectionId);
  console.log("=================================");

  const functionId = "019f6ee3-d6ae-7f64-ba8e-0dee85649fd4";

  // TEMPORARILY remove validation while debugging
  const configuration = {
    selectedCollectionIds: formData.collectionId
      ? [formData.collectionId]
      : [],

    tiers: formData.tiers ?? [
      {
        minQty: 1,
        discount: 15,
      },
      {
        minQty: 2,
        discount: 20,
      },
      {
        minQty: 3,
        discount: 25,
      },
    ],

    excludeGiftCards: Boolean(formData.excludeGiftCards),
    excludeFreeGift: Boolean(formData.excludeFreeGift),
  };

  const response = await admin.graphql(
    `#graphql
      mutation CreateAutomaticDiscount(
        $automaticAppDiscount: DiscountAutomaticAppInput!
      ) {
        discountAutomaticAppCreate(
          automaticAppDiscount: $automaticAppDiscount
        ) {
          automaticAppDiscount {
            discountId
            title
            status
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        automaticAppDiscount: {
          title: formData.title || "Tier Discount",
          functionId,
          startsAt: new Date().toISOString(),
          discountClasses: ["PRODUCT"],

          metafields: [
            {
              namespace: "tier_discount",
              key: "configuration",
              type: "json",
              value: JSON.stringify(configuration),
            },
          ],
        },
      },
    },
  );

  const json = await response.json();

  console.log("SHOPIFY RESPONSE");
  console.log(JSON.stringify(json, null, 2));

  const result = json.data?.discountAutomaticAppCreate;

  if (!result) {
    throw new Error("Shopify did not return a discount creation result");
  }

  if (result.userErrors?.length) {
    throw new Error(
      result.userErrors
        .map((e: any) => `${e.field?.join(".")}: ${e.message}`)
        .join(", "),
    );
  }

  return result;
}