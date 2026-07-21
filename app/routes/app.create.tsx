
import Exclusions from "../components/discount/Exclusions";
import TierRules from "../components/discount/TierRules";
import DiscountInformation from "../components/discount/DiscountInformation";
import { useState } from "react";

import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";

import { useFetcher, useLoaderData } from "react-router";

import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

import type {
  Collection,
  DiscountForm,
} from "../types/discount";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query GetCollections {
      collections(first: 50, sortKey: TITLE) {
        nodes {
          id
          title
          handle
        }
      }
    }
  `);

  const responseJson = await response.json();

 const collections: Collection[] =
  responseJson.data?.collections?.nodes ?? [];

  return {
    collections,
  };
};

export default function CreateDiscount() {
  
  const { collections } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();


  const [formData, setFormData] = useState<DiscountForm>({
    title: "",
    collectionId: "",
    tiers: [
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
    excludeGiftCards: true,
    excludeFreeGift: true,
  });

  return (
  <s-page heading="Create Tier Discount">
    <DiscountInformation
      collections={collections}
      formData={formData}
      setFormData={setFormData}
    />

    <TierRules
      formData={formData}
      setFormData={setFormData}
    />

    <Exclusions
      formData={formData}
      setFormData={setFormData}
    />

    <s-section>
      <s-stack
        direction="inline"
        gap="base"
        align="end"
      >
        <s-button
          variant="secondary"
          href="/app"
        >
          Cancel
        </s-button>

        <s-button
          variant="primary"
          loading={fetcher.state !== "idle"}
          onClick={() => {
  console.log("Submitting:");
  console.log(JSON.stringify(formData, null, 2));

  fetcher.submit(JSON.stringify(formData), {
    method: "POST",
    encType: "application/json",
  });
}}
        >
          Save Discount
        </s-button>
      </s-stack>
    </s-section>
  </s-page>
);
}
export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
import { createAutomaticDiscount } from "../lib/discount.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.json();
  console.log("========== FORM DATA ==========");
  console.log(formData);
console.log("========== FORM DATA ==========");
console.log(JSON.stringify(formData, null, 2));
  const result = await createAutomaticDiscount(admin, formData);

  console.log(result);

  return Response.json(result);
};