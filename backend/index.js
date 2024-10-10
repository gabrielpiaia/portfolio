const app = require('express')()
const consign = require('consign')
const mysql = require('./config/db')

app.mysql = mysql

consign()
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api') // Carregue users.js antes das rotas
    .then('./config/routes.js') // Depois de carregar users.js
    .into(app);


app.listen(3001, () => {
    console.log('Backend executando com sucesso!')
})