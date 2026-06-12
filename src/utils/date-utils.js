import dayjs from 'dayjs';

function formatDisplayDate(value, format) {
  if (!value) {
    return '';
  }

  const date = dayjs(value);

  return date.isValid() ? date.format(format) : '';
}

function getDurationMinutes(dateFrom, dateTo) {
  return dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
}

export { formatDisplayDate, getDurationMinutes };
