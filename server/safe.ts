/**
 * Graceful degradation for page data fetching: if the database is
 * unreachable, public pages render premium empty states instead of crashing
 * (vault: Performance SEO Security — graceful fallback states).
 */
export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.warn("[data] query failed, serving fallback:", error);
    return fallback;
  }
}
