const isValidString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

const isValidPassword = (value) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/;
  return passwordPattern.test(value);
};

const isValidEmail = (value) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof value === 'string' && emailPattern.test(value);
};

const isValidImageUrl = (url) => {
  return typeof url === 'string' && /\.(png|jpg)$/i.test(url);
};

const isValidUUID = (value) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && uuidPattern.test(value);
};

const isValidDate = (value) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof value !== 'string' || !datePattern.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isValidTime = (value) => {
  if (typeof value !== 'string') return false;
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timePattern.test(value)) return false;
  const [hour, minute] = value.split(':').map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

module.exports = {
  isValidString,
  isNumber,
  isValidPassword,
  isValidImageUrl,
  isValidUUID,
  isValidEmail,
  isValidDate,
  isValidTime,
};
