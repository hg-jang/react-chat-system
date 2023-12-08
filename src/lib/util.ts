// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key: string) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
