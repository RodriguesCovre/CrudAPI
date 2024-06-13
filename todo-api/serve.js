const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const db = new sqlite3.Database('./db/database.db');

app.use(bodyParser.json());
app.use(cors());

// Inicializa o banco de dados
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        concluida INTEGER NOT NULL DEFAULT 0
    )`);
});

// Endpoint para listar todas as tarefas
app.get('/tarefas', (req, res) => {
    db.all('SELECT * FROM tarefas', [], (err, rows) => {
        if (err) {
            // Em caso de erro no banco de dados, retorna status 404
            res.status(404).json({ error: 'Erro ao buscar tarefas' });
            return;
        }
        res.json({ data: rows });
    });
});

// Endpoint para criar uma nova tarefa
app.post('/tarefas', (req, res) => {
    const { descricao } = req.body;
    if (!descricao) {
        // Se não houver descrição fornecida, retorna status 400
        res.status(400).json({ error: 'Descrição é obrigatória' });
        return;
    }

    const query = `INSERT INTO tarefas (descricao) VALUES (?)`;
    db.run(query, [descricao], function(err) {
        if (err) {
            // Em caso de erro ao inserir no banco de dados, retorna status 404
            res.status(404).json({ error: 'Erro ao criar tarefa' });
            return;
        }
        // Retorna o ID da tarefa criada com status 201
        res.status(201).json({ id: this.lastID });
    });
});

// Endpoint para obter detalhes de uma tarefa específica
app.get('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM tarefas WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            // Em caso de erro ao buscar no banco de dados, retorna status 404
            res.status(404).json({ error: 'Erro ao buscar tarefa' });
            return;
        }
        if (!row) {
            // Se não encontrar a tarefa com o ID fornecido, retorna status 404
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
        }
        res.json({ data: row });
    });
});

// Endpoint para atualizar os detalhes de uma tarefa
app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { descricao, concluida } = req.body;

    if (descricao === undefined && concluida === undefined) {
        // Se não houver descrição nem status de conclusão, retorna status 400
        res.status(400).json({ error: 'Descrição ou status de conclusão são obrigatórios' });
        return;
    }

    const query = `UPDATE tarefas SET descricao = COALESCE(?, descricao), concluida = COALESCE(?, concluida) WHERE id = ?`;
    db.run(query, [descricao, concluida, id], function(err) {
        if (err) {
            // Em caso de erro ao atualizar no banco de dados, retorna status 404
            res.status(404).json({ error: 'Erro ao atualizar tarefa' });
            return;
        }
        if (this.changes === 0) {
            // Se não atualizar nenhuma linha (tarefa não encontrada), retorna status 404
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
        }
        // Retorna mensagem de sucesso com status 200
        res.json({ message: 'Tarefa atualizada com sucesso' });
    });
});

// Endpoint para excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tarefas WHERE id = ?`;
    db.run(query, [id], function(err) {
        if (err) {
            // Em caso de erro ao excluir do banco de dados, retorna status 404
            res.status(404).json({ error: 'Erro ao excluir tarefa' });
            return;
        }
        if (this.changes === 0) {
            // Se não excluir nenhuma linha (tarefa não encontrada), retorna status 404
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
        }
        // Retorna mensagem de sucesso com status 200
        res.json({ message: 'Tarefa excluída com sucesso' });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
