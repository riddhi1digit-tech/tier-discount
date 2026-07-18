import type { DiscountForm } from "../../types/discount";

type Props = {
  formData: DiscountForm;
  setFormData: React.Dispatch<
    React.SetStateAction<DiscountForm>
  >;
};

export default function Exclusions({
  formData,
  setFormData,
}: Props) {
  return (
    <s-section>
      <s-heading>Exclusions</s-heading>

      <s-paragraph>
        Exclude specific product types from this offer.
      </s-paragraph>

      <s-stack direction="block" gap="base">
        <s-checkbox
          label="Exclude Gift Cards"
          checked={formData.excludeGiftCards}
          onChange={(event) => {
            const checked = (
              event.currentTarget as HTMLInputElement
            ).checked;

            setFormData((prev) => ({
              ...prev,
              excludeGiftCards: checked,
            }));
          }}
        />

        <s-checkbox
          label="Exclude Free Gift Products"
          checked={formData.excludeFreeGift}
          onChange={(event) => {
            const checked = (
              event.currentTarget as HTMLInputElement
            ).checked;

            setFormData((prev) => ({
              ...prev,
              excludeFreeGift: checked,
            }));
          }}
        />
      </s-stack>
    </s-section>
  );
}