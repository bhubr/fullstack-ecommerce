// Truncate the title to len (default 45) characters
export const formatName = (title: string, len = 45) =>
  title.length > len ? title.slice(0, len) + '...' : title;

export const formatPrice = (price: number) =>
  price.toFixed(2).replace('.', ',') + ' €';

/**
 * Format a date string to a human readable format (in French)
 */
export const formatDate = (date: string) => {
  const [year, month, day] = date.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};
