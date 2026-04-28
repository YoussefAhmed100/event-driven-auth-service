export const formatMoneyValue = (value: number) => {
  if (!value) return { value: 0, unit: 'M' };

  if (value >= 1_000_000) {
    return {
      value: Number((value / 1_000_000).toFixed(2)),
      unit: 'M',
    };
  }

  return {
    value: Number((value / 1_000).toFixed(2)),
    unit: 'K',
  };
};