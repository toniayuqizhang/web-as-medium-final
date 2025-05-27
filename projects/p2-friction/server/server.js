// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getDatabase } = require('./firebase-config');
const { ref, get, push } = require('firebase/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = getDatabase();

app.get('/rocks', async (req, res) => {
  try {
    const snapshot = await get(ref(db, 'rocks'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const result = Object.values(data);
      res.json(result);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/rocks', async (req, res) => {
  const { shape, thought, timestamp } = req.body;
  if (!shape || !thought || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const rockData = { shape, thought, timestamp };
    await push(ref(db, 'rocks'), rockData);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
