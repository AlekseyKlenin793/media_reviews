// routes/music.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Получение всех альбомов
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM music');
    res.json(result.rows);
});

// Добавление нового альбома
router.post('/', async (req, res) => {
    const { album_title, artist, release_year, genre, status, review, rating } = req.body;

    // Проверка на дубликаты
    const existing = await pool.query('SELECT * FROM music WHERE album_title = $1 AND release_year = $2', [album_title, release_year]);
    if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Этот альбом уже существует' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO music (album_title, artist, release_year, genre, status, review, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [album_title, artist, release_year, genre, status, review, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding music:', error);
        res.status(500).json({ error: 'Ошибка при добавлении альбома' });
    }
});

// Удаление альбома
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM music WHERE id = $1', [id]);
    res.sendStatus(204);
});

// Обновление альбома
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { album_title, artist, release_year, genre, status, review, rating } = req.body;
    const result = await pool.query(
        'UPDATE music SET album_title = $1, artist = $2, release_year = $3, genre = $4, status = $5, review = $6, rating = $7 WHERE id = $8 RETURNING *',
        [album_title, artist, release_year, genre, status, review, rating, id]
    );
    res.json(result.rows[0]);
});

module.exports = router;
