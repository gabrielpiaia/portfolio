module.exports = (app) => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const category = { ...req.body };
        if (req.params.id) category.id = req.params.id;

        try {
            existsOrError(category.name, 'Nome não informado');
        } catch (msg) {
            return res.status(400).send(msg);
        }

        if (category.id) {
            // Atualiza a categoria existente
            app.mysql.query('UPDATE categories SET ? WHERE id = ?', [category, category.id])
                .then(() => {
                    console.log(`Categoria atualizada com sucesso! ID: ${category.id}`);
                    return res.status(204).send(); // Resposta de sucesso
                })
                .catch(err => {
                    console.error('Error updating category:', err);
                    return res.status(500).send(err);
                });
        } else {
            // Insere uma nova categoria
            app.mysql.query('INSERT INTO categories SET ?', category)
                .then(([result]) => {
                    const id = result.insertId; // Obtendo o ID da nova categoria
                    return res.status(201).json({ message: `Categoria cadastrada com sucesso! ID: ${id}` });
                })
                .catch(err => {
                    console.error('Error inserting category:', err);
                    return res.status(500).send(err);
                });
        }
    };

    const remove = async (req, res) => {
        try {
            const categoryId = req.params.id;
            existsOrError(categoryId, 'Código da categoria não informado.');
    
            // Verifica se a categoria existe
            const [category] = await app.mysql.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
            if (category.length === 0) {
                return res.status(404).send('Categoria não encontrada.');
            }
    
            // Verifica se a categoria possui subcategorias
            const [subcategory] = await app.mysql.query('SELECT * FROM categories WHERE parentId = ?', [categoryId]);
            if (subcategory.length > 0) {
                return res.status(400).send('A categoria possui subcategorias e não pode ser excluída.');
            }
    
            // Verifica se a categoria possui artigos vinculados
            const [articles] = await app.mysql.query('SELECT * FROM articles WHERE categoryId = ?', [categoryId]);
            if (articles.length > 0) {
                return res.status(400).send('A categoria possui artigos vinculados e não pode ser excluída.');
            }
    
            // Exclui a categoria
            const [result] = await app.mysql.query('DELETE FROM categories WHERE id = ?', [categoryId]);
            existsOrError(result.affectedRows, 'Erro ao excluir a categoria. Categoria não foi encontrada.');
    
            // Sucesso
            res.status(200).send('Categoria excluída com sucesso.');
        } catch (msg) {
            return res.status(400).send(msg);
        }
    };

    const withPath = (categories) => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(category => category.id === parentId);
            return parent.length ? parent[0] : null;
        };

        const categoriesWithPath = categories.map(category => {
            let path = category.name;
            let parent = getParent(categories, category.parentId);

            // Constrói o caminho completo da categoria com base em seus pais
            while (parent) {
                path = `${parent.name} > ${path}`;
                parent = getParent(categories, parent.parentId);
            }

            return { ...category, path }; // Adiciona o campo 'path' ao objeto de categoria
        });

        // Ordena as categorias pelo path
        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            return 0;
        });

        return categoriesWithPath;
    };

    // Função para obter todas as categorias e retornar com o campo 'path'
    const get = (req, res) => {
        app.mysql.query('SELECT * FROM categories')
            .then(([categories]) => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err));
    };

    // Função para obter uma categoria específica por ID
    const getById = (req, res) => {
        app.mysql.query('SELECT * FROM categories WHERE id = ?', [req.params.id])
            .then(([category]) => {
                if (category.length === 0) {
                    return res.status(404).json({ error: 'Categoria não encontrada.' });
                }
                res.json(category[0]); // Retorna a categoria encontrada
            })
            .catch(err => res.status(500).send(err));
    };

    return { save, remove, get, getById };
};
