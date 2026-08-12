function validateItemInput(req, res, next) {
  const { name, description } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: {
        message: "name is required and must be a string"
      }
    });
  }

  if (name.trim().length === 0) {
    return res.status(400).json({
      error: {
        message: "name cannot be empty"
      }
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      error: {
        message: "name must not exceed 100 characters"
      }
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      error: {
        message: "description must be a string"
      }
    });
  }

  next();
}

module.exports = {
  validateItemInput
};