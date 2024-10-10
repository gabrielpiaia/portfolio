module.exports = app => {
    
    app.route('/users')
        // Usando Consign para injeção de dependências
        .post(app.api.user.save)
        .get(app.api.user.get);

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save)

        app.route('/categories/:id')
        .get(app.api.category.getById) // Usa a função getById para buscar uma categoria pelo ID
        .put(app.api.category.save)
        .delete(app.api.category.remove);
}