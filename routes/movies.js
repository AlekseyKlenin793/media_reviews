// routes/movies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получение всех фильмов
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM movies');
    res.json(result.rows);
});

// Добавление нового фильма
router.post('/', async (req, res) => {
    const { title, release_year, country, genre, director, status, review, rating } = req.body;

    // Проверка на дубликаты
    const existing = await pool.query('SELECT * FROM movies WHERE title = $1 AND release_year = $2', [title, release_year]);
    if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Этот фильм уже существует' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO movies (title, release_year, country, genre, director, status, review, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, release_year, country, genre, director, status, review, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Ошибка при добавлении фильма' });
    }
});

// Удаление фильма
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM movies WHERE id = $1', [id]);
    res.sendStatus(204);
});

// Обновление фильма
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, release_year, country, genre, director, status, review, rating } = req.body;
    const result = await pool.query(
        'UPDATE movies SET title = $1, release_year = $2, country = $3, genre = $4, director = $5, status = $6, review = $7, rating = $8 WHERE id = $9 RETURNING *',
        [title, release_year, country, genre, director, status, review, rating, id]
    );
    res.json(result.rows[0]);
});

module.exports = router;
