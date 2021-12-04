export const formatHour = (hour: number): string => {
  if (hour === 0 || hour === 24) {
    return '12am';
  }
  if (hour === 12) {
    return '12pm';
  }
  if (hour > 12) {
    return `${hour - 12}pm`;
  }
  return `${hour}am`;
};
