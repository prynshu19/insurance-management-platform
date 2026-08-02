const { ZodError } = require("zod");

// Validates req[source] against a Zod schema; passes ZodError to the global error handler on failure
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;
