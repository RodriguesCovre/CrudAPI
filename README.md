### Documentação Básica da API

Esta é uma documentação básica para a API construída com Node.js, Express.js, SQLite e utilizando os módulos `body-parser` e `cors`.

#### Descrição da API

A API gerencia tarefas em um banco de dados SQLite, permitindo a criação, listagem, atualização e exclusão de tarefas.

#### Configuração do Ambiente

Certifique-se de ter o Node.js e o SQLite instalados localmente para executar a API.

1. **Instalação de Dependências**

   Execute o comando abaixo para instalar as dependências necessárias:
   \`\`\`bash
   npm install express sqlite3 body-parser cors
   \`\`\`

2. **Inicialização do Banco de Dados**

   A aplicação cria automaticamente o banco de dados e a tabela `tarefas` se ainda não existirem.

#### Endpoints Disponíveis

##### Listar todas as tarefas

- **Endpoint:** `GET /tarefas`
- **Descrição:** Retorna todas as tarefas cadastradas.
- **Resposta de Sucesso (200):** Retorna um objeto com a propriedade `data` contendo um array de objetos representando as tarefas.

... (continue formatando os demais endpoints e seções)

#### Exemplo de Uso

**Listagem de Tarefas:**

\`\`\`bash
GET http://localhost:3000/tarefas
\`\`\`

**Criação de Nova Tarefa:**

\`\`\`bash
POST http://localhost:3000/tarefas
Content-Type: application/json

{
  "descricao": "Fazer compras de supermercado"
}
\`\`\`

... (continue com os exemplos de uso)

### Execução da API

Para iniciar o servidor, execute o seguinte comando:

\`\`\`bash
node nome-do-arquivo.js
\`\`\`

Substitua `nome-do-arquivo.js` pelo nome do arquivo onde o código da API está implementado.

A API estará disponível em `http://localhost:3000`, mas voce não vai conseguir acessar porque é localmente.
