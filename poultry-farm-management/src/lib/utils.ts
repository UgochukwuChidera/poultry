export function toDateInputValue(date = new Date()) {
  return date.toISOString().split("T")[0];
}
