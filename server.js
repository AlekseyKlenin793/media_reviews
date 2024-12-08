const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const { Movie, Series, Music } = require('./models');

const app = express();
const PORT = 3000;

// Настройка базы данных с Sequelize
const sequelize = new Sequelize('media_reviews', 'postgres', '804793', {
    host: 'localhost',
    dialect: 'postgres',
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Проверка соединения с базой данных
sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Маршруты

// Получение всех медиа
app.get('/api/media/all', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        const series = await Series.findAll();
        const music = await Music.findAll();
        res.json({ movies, series, music });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching media' });
    }
});

// Проверка существования медиа
app.get('/api/media', async (req, res) => {
    const { title, year } = req.query;
    try {
        const movies = await Movie.findAll({ where: { title, year } });
        const series = await Series.findAll({ where: { title, year } });
        const music = await Music.findAll({ where: { title, year } });
        res.json([...movies, ...series, ...music]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking media' });
    }
});

// Добавление медиа
app.post('/api/media', async (req, res) => {
    const { type, ...data } = req.body;
    try {
        let newMedia;
        if (type === 'movie') {
            newMedia = await Movie.create(data);
        } else if (type === 'series') {
            newMedia = await Series.create(data);
        } else if (type === 'music') {
            newMedia = await Music.create(data);
        }
        res.status(201).json({ message: 'Media added successfully', data: newMedia });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding media' });
    }
});

// Получение конкретного медиа
app.get('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findByPk(id);
        const series = await Series.findByPk(id);
        const music = await Music.findByPk(id);

        if (movie) {
            res.json(movie);
        } else if (series) {
            res.json(series);
        } else if (music) {
            res.json(music);
        } else {
            res.status(404).json({ message: 'Media not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching media by ID' });
    }
});

// Удаление медиа
app.delete('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMovie = await Movie.destroy({ where: { id } });
        const deletedSeries = await Series.destroy({ where: { id } });
        const deletedMusic = await Music.destroy({ where: { id } });

        if (deletedMovie || deletedSeries || deletedMusic) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Media not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting media' });
    }
});

// Обновление медиа
app.put('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    const { type, ...data } = req.body;
    try {
        let updatedMedia;
        if (type === 'movie') {
            updatedMedia = await Movie.update(data, { where: { id } });
        } else if (type === 'series') {
            updatedMedia = await Series.update(data, { where: { id } });
        } else if (type === 'music') {
            updatedMedia = await Music.update(data, { where: { id } });
        }
        if (updatedMedia[0] > 0) {
            res.status(200).json({ message: 'Media updated successfully' });
        } else {
            res.status(404).json({ message: 'Media not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating media' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});