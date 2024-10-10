// user.js
const bcrypt = require('bcrypt-nodejs'); // Certifique-se de que essa linha está presente

module.exports = (app) => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10); // Aqui é onde o erro ocorreu
        return bcrypt.hashSync(password, salt);
    };

    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id
        console.log('Received user data:', user)

        try {
            existsOrError(user.name, 'Nome não informado');
            existsOrError(user.email, 'E-mail não informado');
            existsOrError(user.password, 'Senha não informada');
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida');
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem');

            // Acessa a tabela de usuários
            const [userFromDB] = await app.mysql.query('SELECT * FROM users WHERE email = ?', [user.email]);
            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado');
            }
        } catch (msg) {
            return res.status(403).send(msg);
        }

        user.password = encryptPassword(user.password);
        delete user.confirmPassword;

        if (user.id) {
            app.mysql.query('UPDATE users SET ? WHERE id = ?', [user, user.id])
                .then(() => {
                    console.log(`Usuário atualizado com sucesso! ID: ${user.id}`); // Log de sucesso na atualização
                    return res.status(204).send(); // Resposta de sucesso
                })
                .catch(err => res.status(500).send(err));
        } else {
            app.mysql.query('INSERT INTO users SET ?', user)
                .then(([result]) => {
                    const id = result.insertId; // Obtendo o ID do novo usuário
                    return res.status(201).json({ message: `Usuário cadastrado com sucesso! ID: ${id}` });
                })
                .catch(err => {
                    console.error('Error inserting user:', err);
                    return res.status(500).send(err);
                });
        }
    };

    const get = (req, res) => {
        app.mysql.query('SELECT id, name, email, admin FROM users')
            .then(([users]) => res.json(users))
            .catch(err => res.status(500).send(err));
    };




    
    const getById = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;
    
        // Verifica se o ID é fornecido e é um número
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'ID deve ser um número.' })
        }
    
        // Realiza a consulta SQL usando o ID
        app.mysql.query('SELECT id, name, email, admin FROM users WHERE id = ?', [id])
            .then(([user]) => {
                // Verifica se o usuário foi encontrado
                if (user.length === 0) {
                    return res.status(404).json({ error: 'Usuário não encontrado.' })
                }
                res.json(user[0]); // Retorna o usuário encontrado
            })
            .catch(err => res.status(500).send(err))
    }




    return { save, get, getById };
};

    