import dayjs from "dayjs"

export const formatDate = (date: Date) => {
    return dayjs(date).format("MMM DD, YYYY")
}

export const calcualteTotalRate = (startDate: string, endDate: string, rate: number) => {
  if (!startDate || !endDate) {
    return 1
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return 1
  }

  const timeDifference = end.getTime() - start.getTime();
  const days = timeDifference / (1000 * 60 * 60 * 24)
  
  return formatMoney(rate*days)
};

export const formatMoney = (amount: number, locale = 'en-US', currency = 'PHP') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };