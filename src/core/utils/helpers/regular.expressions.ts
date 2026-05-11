/**
 *
 * @param input input string for validation
 * @returns true if string only contains digits, else false
 */
export function isDigitsOnly(input: string): boolean {
  const regex = new RegExp('^\\d+$');
  return regex.test(input);
}
