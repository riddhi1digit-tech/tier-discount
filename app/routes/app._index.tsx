  import type {
    HeadersFunction,
    LoaderFunctionArgs,
  } from "react-router";

  import { authenticate } from "../shopify.server";
  import { boundary } from "@shopify/shopify-app-react-router/server";

  export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return null;
  };

  export default function Index() {
    return (
      <s-page heading="Tier Discount">
        <s-button
  slot="primary-action"
  href="/app/create"
>
  Create Discount
</s-button>

        <s-section>
          <s-heading>Create Automatic Tier Discounts</s-heading>

          <s-paragraph>
            Create and manage quantity-based discounts using Shopify Functions.
          </s-paragraph>
        </s-section>
      </s-page>
    );
  }

  export const headers: HeadersFunction = (headersArgs) => {
    return boundary.headers(headersArgs);
  };