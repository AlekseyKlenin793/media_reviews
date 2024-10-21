// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'media_reviews',
    password: '804793', // ваш пароль
    port: 5432,
});

module.exports = pool;
