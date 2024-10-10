# portfolio
Repositório para minha página de projetos

RODAR EM MODO DESENVOLVIMENTO:
npm start



const mysql = require('mysql2');

// Configurar a conexão com o MySQL
const connection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase
});

// Conectar ao MySQL
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

app.use(express.json());
// Credenciais do banco de dados
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;
const acessPort = process.env.ACESS_PORT;