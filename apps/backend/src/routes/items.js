const express = require("express");
const pool = require("../db/pool");
const { validateItemInput } = require("../middleware/validateInput");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 10,
        1
      ),
      100
    );

    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      "SELECT COUNT(*)::int AS total FROM items"
    );

    const itemsResult = await pool.query(
      `
      SELECT id, name, description, created_at
      FROM items
      ORDER BY id
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.status(200).json({
      data: itemsResult.rows,
      total: countResult.rows[0].total,
      page,
      limit
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateItemInput, async (req, res, next) => {
  try {
    const { name, description = null } = req.body;

    const result = await pool.query(
      `
      INSERT INTO items (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at
      `,
      [name.trim(), description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;