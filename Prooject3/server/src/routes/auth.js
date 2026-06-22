const express = require('express');
const pool = require('../db');

const router = express.Router();

// POST /api/users/sync - Sync Firebase user to PostgreSQL
router.post('/sync', async (req, res) => {
  try {
    const { firebase_uid, name, email, role, provider, photo_url } = req.body;

    if (!firebase_uid || !email) {
      return res.status(400).json({ error: 'firebase_uid and email are required' });
    }

    const result = await pool.query(
      `INSERT INTO users (firebase_uid, name, email, role, provider, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (firebase_uid) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         role = EXCLUDED.role,
         provider = EXCLUDED.provider,
         photo_url = EXCLUDED.photo_url,
         updated_at = NOW()
       RETURNING *`,
      [firebase_uid, name || 'User', email, role || 'STUDENT', provider || 'email', photo_url || null]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error syncing user:', err.message);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// GET /api/users/:firebase_uid - Get user by Firebase UID
router.get('/:firebase_uid', async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [firebase_uid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
