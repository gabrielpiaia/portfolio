const bodyParser = require('body-parser')
const cors = require('cors')

// consine exporta tudo no app (é a instancia do express)

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors)

}