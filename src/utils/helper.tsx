import dayjs from "dayjs"
import emailjs from '@emailjs/browser';

export const formatDate = (date: Date) => {
    return dayjs(date).format("MMM DD, YYYY")
}

export const formatDateNumber = (date: Date) => {
  return dayjs(date).format("MM/DD/YYYY")
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


export const sendEmail = (form: { email: string, name: string, message: string} ) => {

  emailjs
    .send('service_o1jrwsq', 'template_m3axy69', form, {
      publicKey: 'n7wUCQBkYE072lUb0',
    })
    .then(
      () => {
        console.log('SUCCESS!');
      },
      (error) => {
        console.log('FAILED...', error);
      },
    );
};

export const validIds = ["Driver's license", "Passport", "Unified Multi-purpose ID", "PhilPost Postal ID (PID)", "Philippine Identification", "Senior Citizen ID", "PRC ID"]
     
export const carTypeOptions = ["Sedan", "Hatchback", "SUV", "Pickup Truck", "Van", "Electric Vehicle (EV)"]