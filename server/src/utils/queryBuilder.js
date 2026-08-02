// Build Prisma orderBy clause from query params
const buildOrderBy = (query = {}, allowedFields = [], defaultField = "createdAt", defaultOrder = "desc") => {
  const sortBy = query.sortBy || defaultField;
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  const field = allowedFields.includes(sortBy) ? sortBy : defaultField;
  return { [field]: sortOrder };
};

// Build a case-insensitive OR search across multiple fields
const buildSearchWhere = (searchTerm, fields = []) => {
  if (!searchTerm?.trim()) return null;
  return {
    OR: fields.map((field) => ({
      [field]: { contains: searchTerm.trim(), mode: "insensitive" },
    })),
  };
};

// Build a date range filter for a given DateTime field
const buildDateRangeWhere = (fromDate, toDate, field = "createdAt") => {
  if (!fromDate && !toDate) return null;
  const clause = {};
  if (fromDate) clause.gte = new Date(fromDate);
  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    clause.lte = end;
  }
  return { [field]: clause };
};

// Merge multiple Prisma where conditions with AND
const mergeWhereConditions = (...conditions) => {
  const valid = conditions.filter(Boolean);
  if (valid.length === 0) return {};
  if (valid.length === 1) return valid[0];
  return { AND: valid };
};

module.exports = { buildOrderBy, buildSearchWhere, buildDateRangeWhere, mergeWhereConditions };
