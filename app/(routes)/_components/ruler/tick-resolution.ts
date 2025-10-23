const isPowerOf10 = (number: number) => {
  while (number >= 10 && number % 10 === 0) number /= 10;
  return number === 1;
};

const getNthTickRes = (n: number) => {
  let res = 5;

  for (let i = 0; i < n; i++) {
    if (isPowerOf10(res)) res *= 2.5;
    else res *= 2;
  }

  return res;
};

export const findSmallestTickRes = (min: number) => {
  let n = 0;
  while (getNthTickRes(n) < min) n++;
  return getNthTickRes(n);
};
