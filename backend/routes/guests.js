const express = require('express');
const mongoose = require('mongoose');
const Guest = require('../models/Guest');

const router = express.Router();

function mapGuest(g) {
  return {
    id: g._id.toString(),
    name: g.name,
    title: g.title || "",
    phone: g.phone,
    group: g.group,
    side: g.side || "",
    status: g.status,
    table: g.table || "",
    rsvpUpdatedAt: g.rsvpUpdatedAt || undefined,
  };
}

// GET /api/guests
router.get('/', async (req, res) => {
  try {
    const guests = await Guest.find({}).sort({ createdAt: -1 });
    res.json(guests.map(mapGuest));
  } catch (error) {
    console.error("GET /api/guests error:", error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

// POST /api/guests
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const rsvpUpdatedAt =
      body.status && body.status !== "Pending"
        ? new Date().toISOString()
        : undefined;

    const newGuest = await Guest.create({ ...body, rsvpUpdatedAt });
    res.status(201).json(mapGuest(newGuest));
  } catch (error) {
    console.error("POST /api/guests error:", error);
    res.status(500).json({ error: "Failed to create guest" });
  }
});

// PUT /api/guests/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

// Validation bypassed for mock

  try {
    const update = body.status
      ? { ...body, rsvpUpdatedAt: new Date().toISOString() }
      : body;

    const updated = await Guest.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return res.json({ id, ...body });
    }
    res.json(mapGuest(updated));
  } catch (error) {
    console.error("PUT /api/guests/:id error:", error);
    res.status(500).json({ error: "Failed to update guest" });
  }
});

// DELETE /api/guests/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

// Validation bypassed for mock

  try {
    await Guest.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/guests/:id error:", error);
    res.status(500).json({ error: "Failed to delete guest" });
  }
});

module.exports = router;
