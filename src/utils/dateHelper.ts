export const numberToMonth = (number: number): string => {
  const month = new Date(0, number);
  return month.toLocaleString('default', { month: 'long' });
};

export const numberToWeek = (number: number): string => {
  var weekday = new Array(7);
  weekday[0] = 'Monday';
  weekday[1] = 'Tuesday';
  weekday[2] = 'Wednesday';
  weekday[3] = 'Thursday';
  weekday[4] = 'Friday';
  weekday[5] = 'Saturday';
  weekday[6] = 'Sunday';
  return weekday[number];
};

export enum FormatType {
  FULL_WITHOUT_WEEKDAY,
  WITH_WEEKDAY_WITHOUT_TIME,
  YEAR_MONTH_DAY,
}

export const formatDate = (
  date: Date,
  formatType: FormatType = FormatType.FULL_WITHOUT_WEEKDAY
): string => {
  const newData = new Date(date);
  const month = numberToMonth(newData.getMonth());
  // minutes to 12 hour clock

  const day = newData.getDate();
  const weekDay = numberToWeek(newData.getDay());
  const year = newData.getFullYear();
  let hours = newData.getHours();
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  let minutes = String(newData.getMinutes());
  minutes = minutes === '0' ? '00' : minutes;
  const ampm = newData.getHours() >= 12 ? 'pm' : 'am';

  switch (formatType) {
    case FormatType.FULL_WITHOUT_WEEKDAY:
      return `${month} ${day} at ${hours}:${minutes}${ampm}`;
    case FormatType.WITH_WEEKDAY_WITHOUT_TIME:
      return `${weekDay}, ${month} ${day}, ${year}`;
    case FormatType.YEAR_MONTH_DAY:
      return `${year}-${month}-${day}`;
    default:
      return 'Invalid Date Format Type';
  }
};
