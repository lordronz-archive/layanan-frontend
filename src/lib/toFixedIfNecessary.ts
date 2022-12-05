export const toFixedIfNecessary = (value: number | string, dp: number) => {
  return +parseFloat(value.toString()).toFixed(dp);
};

export default toFixedIfNecessary;
