export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateLongText = (text: string): string =>
  text.length > 12 ? `${text.substring(0, 6)}…${text.substring(text.length - 6)}`: text;
