export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const truncateLongText = (text: string): string =>
  text.length > 12 ? `${text.substring(0, 6)}…${text.substring(text.length - 6)}` : text;

export const formatBlockNumber = (block_number: number): string =>
  block_number.toLocaleString();
