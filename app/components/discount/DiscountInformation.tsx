import type { Dispatch, SetStateAction } from "react";

import type {
  Collection,
  DiscountForm,
} from "../../types/discount";

type Props = {
  collections: Collection[];
  formData: DiscountForm;
  setFormData: Dispatch<SetStateAction<DiscountForm>>;
};

export default function DiscountInformation({
  collections,
  formData,
  setFormData,
}: Props) {
  return (
    <s-section>
      <s-heading>Discount Information</s-heading>

      <s-paragraph>
        Configure your tiered discount for a Shopify collection.
      </s-paragraph>

     <s-stack direction="block" gap="base">
  <s-text-field
    label="Discount Name"
    value={formData.title}
    placeholder="Summer Collection Offer"
    onInput={(event: any) => {
      console.log("TEXT EVENT");
      console.log(event);
      console.log("detail:", event.detail);
      console.log("target:", event.target);
      console.log("currentTarget:", event.currentTarget);

      const value =
        event.target?.value ??
        event.currentTarget?.value ??
        event.detail?.value ??
        "";

      console.log("VALUE =", value);

      setFormData((prev) => ({
        ...prev,
        title: value,
      }));
    }}
  />

  <s-select
    label="Eligible Collection"
    value={formData.collectionId}
    placeholder="Select a collection"
    onChange={(event: any) => {
      console.log("SELECT EVENT");
      console.log(event);
      console.log("detail:", event.detail);
      console.log("target:", event.target);
      console.log("currentTarget:", event.currentTarget);

      const value =
        event.target?.value ??
        event.currentTarget?.value ??
        event.detail?.value ??
        "";

      console.log("VALUE =", value);

      setFormData((prev) => ({
        ...prev,
        collectionId: value,
      }));
    }}
  >
    {collections.map((collection) => (
      <s-option
        key={collection.id}
        value={collection.id}
      >
        {collection.title}
      </s-option>
    ))}
  </s-select>
</s-stack>
    </s-section>
  );
}