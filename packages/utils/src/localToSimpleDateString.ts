/**
 * Convert a local date string to a simple date string
 * @param dateString - The local date string to convert
 * @returns - A simple date string if `dateString` is truthy, otherwise undefined
 */
export default function localToSimpleDateString(dateString: string) {
  if (!dateString) {
    return undefined;
  }

  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}
