const getDateValue = (date) => {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isDateValue = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return (
    !Number.isNaN(date.getTime()) &&
    getDateValue(date) === value
  );
};

const isDueDateAllowed = (value, today = getDateValue(new Date())) =>
  value === "" || (isDateValue(value) && value >= today);

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getDateValue, isDateValue, isDueDateAllowed };
}

if (typeof window !== "undefined") {
  window.todoDateUtils = { getDateValue, isDateValue, isDueDateAllowed };
}
