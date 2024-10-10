const mysql = require('mysql2')

module.exports = mysql


const connection = mysql.createConnection({
    host: 'localhost',      // Endereço do banco
    user: 'gabriel',           // Usuário do banco de dados
    password: 'Gabriel#12345!',  // Senha do usuário
    database: 'weathermeter' // Nome do banco de dados
  });

  // Conectar ao MySQL
connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err.message);
      return;
    }
    console.log('Conectado ao MySQL com sucesso!');
  })

  // Conecta ao banco de dados
connection.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados MySQL!');
  });


  