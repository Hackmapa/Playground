export const getActualDate = () => {
  return new Date();
};

export const dateToString = (date: Date) => {
  date = new Date(date);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};

export const dateToTimeString = (date: Date) => {
  date = new Date(date);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export const fullDateToString = (date: Date) => {
  return `${dateToString(date)} ${dateToTimeString(date)}`;
};
