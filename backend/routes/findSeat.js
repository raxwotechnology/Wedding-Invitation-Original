const express = require('express');
const Guest = require('../models/Guest');

const router = express.Router();

// GET /api/find-seat?name=<query>
router.get('/', async (req, res) => {
  const query = (req.query.name || "").trim();

  if (!query || query.length < 2) {
    return res.status(400).json({ error: "Please enter at least 2 characters." });
  }

  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const rawGuests = await Guest.find(
      { name: regex },
      "name title group table status"
    ).limit(20).lean();

    const results = rawGuests.map((g) => {
      const title = String(g.title || "").trim();
      const name = String(g.name || "").trim();
      return {
        id: g._id.toString(),
        displayName: title ? `${title} ${name}` : name,
        group: String(g.group || ""),
        tableId: String(g.table || ""),
        rsvpStatus: String(g.status || "Pending"),
      };
    });

    res.set('Cache-Control', 'no-store');
    res.json({ results });
  } catch (error) {
    console.error("[find-seat] Error:", error.message || error);
    res.status(500).json({ error: "Search unavailable. Please try again." });
  }
});

module.exports = router;
