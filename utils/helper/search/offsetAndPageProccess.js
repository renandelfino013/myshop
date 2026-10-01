/**
 * @param {number} page
 * @param {number} limit
 * @returns {{ offset: number, limit: number }}
 */
export function offsetAndPageProccess(page, limit) {
  if (!page || page <= 0 || isNaN(page)) {
    page = 1;
  }
  if (!limit || limit <= 0 || isNaN(limit) || limit > 30) {
    limit = 30;
  }
  const offset = (page - 1) * limit;
  return { limit, offset };
}
