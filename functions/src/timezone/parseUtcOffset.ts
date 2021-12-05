export const parseUtcOffset = (text: string): number | undefined => {
  const tokens = text.match(/([+-]*\d+)/);
  if (tokens === null) {
    return undefined;
  }
  const [, offsetString] = tokens;
  return parseInt(offsetString);
};
