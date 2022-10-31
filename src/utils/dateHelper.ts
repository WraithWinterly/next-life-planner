export const numberToMonth = (number: number): string => {
  const month = new Date(0, number);
  return month.toLocaleString('default', { month: 'long' });
};

export const formatPrismaDate = (date: Date): string => {
  const newData = new Date(date);
  const month = numberToMonth(newData.getMonth());
  // minutes to 12 hour clock

  const day = newData.getDate();

  let hours = newData.getHours();
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  let minutes = String(newData.getMinutes());
  minutes = minutes === '0' ? '00' : minutes;
  const ampm = newData.getHours() >= 12 ? 'pm' : 'am';
  const formattedTime = `${month} ${day} at ${hours}:${minutes}${ampm}`;

  return formattedTime;
};
