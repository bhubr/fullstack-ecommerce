import DatabaseService from '../services/database-service';

/**
 * Create order reference based on:
 * - current date (YYYYMMDD)
 * - global number of orders for the current year (should be fetched from DB, padded to 5 digits)
 */
export default async function createOrderReference(): Promise<string> {
  const currentDate = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const currentYear = currentDate.slice(0, 2);
  const db = (await DatabaseService.getInstance()).getDB();
  const [{ count }] = await db.query<{ count: number }[]>(
    `SELECT COUNT(*) AS count FROM \`order\` WHERE reference LIKE ?`,
    [`${currentYear}%`]
  );
  const orderCountString = (count + 1).toString().padStart(5, '0');
  return `${currentDate}-${orderCountString}`;
}
