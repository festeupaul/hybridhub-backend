require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Salut din HybridHub API!',
      database_time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la conectarea cu baza de date' });
  }
});

app.get('/api/desks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM desks WHERE is_active = true ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare la preluarea birourilor:', err);
    res.status(500).json({ error: 'Eroare internă a serverului' });
  }
});

app.get('/api/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name, email, role FROM users');
      res.json(result.rows);
    } catch (err) {
      console.error('Eroare la preluarea userilor:', err);
      res.status(500).json({ error: 'Eroare internă a serverului' });
    }
  });

app.get('/api/reservations', async (req, res) => {
  const { date } = req.query; 

  try {
    let queryText = `
      SELECT 
        r.id AS reservation_id, 
        r.reservation_date, 
        u.name AS employee_name, 
        d.label AS desk_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN desks d ON r.desk_id = d.id
    `;
    let values = [];

    if (date) {
      queryText += ` WHERE r.reservation_date = $1`;
      values.push(date);
    }
    
    queryText += ` ORDER BY r.reservation_date ASC`;

    const result = await pool.query(queryText, values);
    res.json(result.rows);

  } catch (err) {
    console.error('Eroare la preluarea rezervărilor:', err);
    res.status(500).json({ error: 'Eroare internă a serverului' });
  }
});

app.post('/api/reservations', async (req, res) => {
  const { user_id, desk_id, reservation_date } = req.body;

  if (!user_id || !desk_id || !reservation_date) {
    return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii!' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reservations (user_id, desk_id, reservation_date) VALUES ($1, $2, $3) RETURNING *',
      [user_id, desk_id, reservation_date]
    );
    
    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Acest birou este deja rezervat pentru data selectată.' });
    }
    
    console.error('Eroare la rezervare:', err);
    res.status(500).json({ error: 'Eroare internă a serverului' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});