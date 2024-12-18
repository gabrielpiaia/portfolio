const mysql = require('mysql2');

// Criação do pool de conexões
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'gabriel',
    password: 'gabriel123!@#',
    database: 'mydatabaseTESTE',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar o pool
module.exports = pool.promise(); // Usando o método promise para facilitar o uso de async/await