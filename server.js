const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Подключение к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'media_reviews',
    password: '804793',
    port: 5432
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Получение всех медиа
app.get('/api/media/all', async (req, res) => {
    const movies = await pool.query('SELECT * FROM movies');
    const series = await pool.query('SELECT * FROM series');
    const music = await pool.query('SELECT * FROM music');
    res.json({ movies: movies.rows, series: series.rows, music: music.rows });
});

// Проверка существования медиа
app.get('/api/media', async (req, res) => {
    const { title, year } = req.query;
    const movies = await pool.query('SELECT * FROM movies WHERE title = $1 AND release_year = $2', [title, year]);
    const series = await pool.query('SELECT * FROM series WHERE title = $1 AND release_year = $2', [title, year]);
    const music = await pool.query('SELECT * FROM music WHERE title = $1 AND release_year = $2', [title, year]);
    res.json([...movies.rows, ...series.rows, ...music.rows]);
});

// Добавление медиа
app.post('/api/movies', async (req, res) => {
    const { title, release_year, country, genre, status, review, rating } = req.body;
    const result = await pool.query('INSERT INTO movies (title, release_year, country, genre, status, review, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [title, release_year, country, genre, status, review, rating]);
    res.json(result.rows[0]);
});

app.post('/api/series', async (req, res) => {
    const { title, release_year, seasons, country, genre, status, review, rating } = req.body;
    const result = await pool.query('INSERT INTO series (title, release_year, seasons, country, genre, status, review, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [title, release_year, seasons, country, genre, status, review, rating]);
    res.json(result.rows[0]);
});

app.post('/api/music', async (req, res) => {
    const { title, artist, release_year, genre, status, review, rating } = req.body;
    const result = await pool.query('INSERT INTO music (title, artist, release_year, genre, status, review, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [title, artist, release_year, genre, status, review, rating]);
    res.json(result.rows[0]);
});

// Получение конкретного медиа
app.get('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    const movie = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    const series = await pool.query('SELECT * FROM series WHERE id = $1', [id]);
    const music = await pool.query('SELECT * FROM music WHERE id = $1', [id]);

    if (movie.rows.length) {
        res.json(movie.rows[0]);
    } else if (series.rows.length) {
        res.json(series.rows[0]);
    } else if (music.rows.length) {
        res.json(music.rows[0]);
    } else {
        res.status(404).json({ message: 'Media not found' });
    }
});

// Удаление медиа
app.delete('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM movies WHERE id = $1', [id]);
    res.status(204).send();
});

// Обновление медиа (изменение)
app.put('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    const { title, release_year, country, genre, status, review, rating } = req.body;
    await pool.query('UPDATE movies SET title = $1, release_year = $2, country = $3, genre = $4, status = $5, review = $6, rating = $7 WHERE id = $8', [title, release_year, country, genre, status, review, rating, id]);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
