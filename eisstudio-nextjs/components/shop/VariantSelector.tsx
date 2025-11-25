'use client';

import { ShopifyProduct } from '@/lib/shopify';

interface VariantSelectorProps {
  product: ShopifyProduct;
  selectedVariantId: string;
  onVariantChange: (variantId: string) => void;
}

export default function VariantSelector({
  product,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  const options = product.options.filter((opt) => opt.name !== 'Title');

  if (options.length === 0) return null;

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

  const handleOptionChange = (optionName: string, value: string) => {
    if (!selectedVariant) return;

    // Find variant that matches all current options except the changed one
    const newVariant = product.variants.find((variant) => {
      return variant.selectedOptions.every((opt) => {
        if (opt.name === optionName) {
          return opt.value === value;
        }
        const currentValue = selectedVariant.selectedOptions.find(
          (so) => so.name === opt.name
        )?.value;
        return opt.value === currentValue;
      });
    });

    if (newVariant) {
      onVariantChange(newVariant.id);
    }
  };

  return (
    <div className="variant-selector">
      {options.map((option) => {
        const selectedValue = selectedVariant?.selectedOptions.find(
          (opt) => opt.name === option.name
        )?.value;

        return (
          <div key={option.id} className="variant-option">
            <label className="variant-label">{option.name}</label>
            <div className="variant-values">
              {option.values.map((value) => {
                const isSelected = selectedValue === value;
                const variantForValue = product.variants.find((v) =>
                  v.selectedOptions.some(
                    (opt) => opt.name === option.name && opt.value === value
                  )
                );
                const isAvailable = variantForValue?.availableForSale ?? false;

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    disabled={!isAvailable}
                    className={`variant-btn ${isSelected ? 'selected' : ''} ${
                      !isAvailable ? 'unavailable' : ''
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
