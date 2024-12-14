const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moviesRouter = require('./routes/movies');
const seriesRouter = require('./routes/series');
const musicRouter = require('./routes/music');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api/movies', moviesRouter);
app.use('/api/series', seriesRouter);
app.use('/api/music', musicRouter);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
