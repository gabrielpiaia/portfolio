const mysql = require('mysql2');

// Criação do pool de conexões
const pool = mysql.createPool({
    host: 'localhost',
    user: 'gabriel',
    password: 'Gabriel#12345!',
    database: 'portfolio',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar o pool
module.exports = pool.promise(); // Usando o método promise para facilitar o uso de async/await