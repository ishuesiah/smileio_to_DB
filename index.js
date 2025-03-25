const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.post('/add-customer', async (req, res) => {
  const { email, name, points_balance, referral_code } = req.body;

  if (!email || !name || !referral_code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.query(
      'INSERT INTO referrals (email, name, points_balance, referral_code, created_at) VALUES (?, ?, ?, ?, NOW())',
      [email, name, points_balance || 0, referral_code]
    );
    res.status(201).json({ message: 'Customer added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
