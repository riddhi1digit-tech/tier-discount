import type { DiscountForm } from "../../types/discount";

type Props = {
  formData: DiscountForm;
  setFormData: React.Dispatch<
    React.SetStateAction<DiscountForm>
  >;
};

export default function TierRules({
  formData,
  setFormData,
}: Props) {
  return (
    <s-section>
      <s-heading>Tier Rules</s-heading>

      <s-paragraph>
        Configure the discount percentage for each quantity level.
      </s-paragraph>

      <s-stack direction="block" gap="base">
        {formData.tiers.map((tier, index) => (
          <s-stack
            key={tier.minQty}
            direction="inline"
            gap="large"
            align="center"
          >
            <div
              style={{
                width: "150px",
                fontWeight: 600,
              }}
            >
              Qty {tier.minQty}
            </div>

            <s-text-field
              label="Discount %"
              value={tier.discount.toString()}
              type="number"
              min="0"
              max="100"
              onInput={(event) => {
                const value = Number(
                  (event.currentTarget as HTMLInputElement).value
                );

                setFormData((prev) => {
                  const tiers = [...prev.tiers];

                  tiers[index] = {
                    ...tiers[index],
                    discount: value,
                  };

                  return {
                    ...prev,
                    tiers,
                  };
                });
              }}
            />
          </s-stack>
        ))}
      </s-stack>
    </s-section>
  );
}