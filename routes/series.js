// routes/series.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получение всех сериалов
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM series');
    res.json(result.rows);
});

// Добавление нового сериала
router.post('/', async (req, res) => {
    const { title, release_year, seasons, country, genre, director, status, review, rating } = req.body;

    // Проверка на дубликаты
    const existing = await pool.query('SELECT * FROM series WHERE title = $1 AND release_year = $2', [title, release_year]);
    if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Этот сериал уже существует' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO series (title, release_year, seasons, country, genre, director, status, review, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [title, release_year, seasons, country, genre, director, status, review, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding series:', error);
        res.status(500).json({ error: 'Ошибка при добавлении сериала' });
    }
});

// Удаление сериала
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM series WHERE id = $1', [id]);
    res.sendStatus(204);
});

// Обновление сериала
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, release_year, seasons, country, genre, director, status, review, rating } = req.body;
    const result = await pool.query(
        'UPDATE series SET title = $1, release_year = $2, seasons = $3, country = $4, genre = $5, director = $6, status = $7, review = $8, rating = $9 WHERE id = $10 RETURNING *',
        [title, release_year, seasons, country, genre, director, status, review, rating, id]
    );
    res.json(result.rows[0]);
});

module.exports = router;
