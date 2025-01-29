export function showtoast(toast, title, status, description, placement) {
  return toast.show({
    title,
    status,
    description,
    placement,
  });
}

export const increase = (setstate, state, val = 0.1) => {
  setstate(prevstate => Number(Number(prevstate) + val).toFixed(1));
  console.log('ind', state, setstate, val);
};
export const decrease = (setstate, state, val = 0.1) => {
  console.log('ind', state, setstate, val);

  if (state == 0 || state == 1 || state < 0) {
    setstate(0);
  } else {
    setstate(prevstate => Number(Number(prevstate) - val).toFixed(1));
  }
};

export function subtractMonths(numOfMonths, date = new Date()) {
  date.setMonth(date.getMonth() - numOfMonths);

  return date;
}

export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
