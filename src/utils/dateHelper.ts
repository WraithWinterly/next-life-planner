export const numberToMonth = (number: number): string => {
  const month = new Date(0, number);
  return month.toLocaleString('default', { month: 'long' });
};

export const formatPrismaDate = (date: Date): string => {
  const newData = new Date(date);
  const month = numberToMonth(newData.getMonth());
  return `${month} ${newData.getDate()}, ${newData.getFullYear()}`;
};
