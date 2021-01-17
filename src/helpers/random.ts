export const inBetweenInt = (min: number, max: number) => {
  const r = Math.random() * (max - min + 1) + min;
  return Math.floor(r)
};

export const exBetweenInt = (min: number, max: number) => {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
};
