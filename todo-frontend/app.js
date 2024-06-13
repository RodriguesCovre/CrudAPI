document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const taskForm = document.getElementById('task-form'); // Formulário de adicionar tarefa
    const taskInput = document.getElementById('task-input'); // Campo de entrada de texto da tarefa
    const taskList = document.getElementById('task-list'); // Lista de tarefas
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal')); // Modal de detalhes da tarefa
    const searchTaskButton = document.getElementById('search-task-button'); // Botão de busca por ID

    const API_URL = 'http://localhost:3000/tarefas'; // URL da API de tarefas

    // Função para buscar e exibir tarefas da API
    function fetchTasks() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = ''; // Limpa a lista de tarefas antes de recriá-la
                data.data.forEach(task => {
                    const taskItem = createTaskItem(task); // Cria um item de tarefa
                    taskList.appendChild(taskItem); // Adiciona o item à lista
                });
            });
    }

    // Cria um elemento de item de tarefa na lista
    function createTaskItem(task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        taskItem.dataset.id = task.id;

        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.descricao;
        if (task.concluida) {
            taskTitle.classList.add('text-decoration-line-through'); // Adiciona linha cortada se a tarefa estiver concluída
        }
        taskItem.appendChild(taskTitle);

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Detalhes';
        detailsButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-2');
        detailsButton.addEventListener('click', () => {
            showTaskDetails(task); // Mostra os detalhes da tarefa ao clicar no botão
        });
        taskItem.appendChild(detailsButton);

        return taskItem;
    }

    // Mostra os detalhes da tarefa no modal
    function showTaskDetails(task) {
        const modalTitle = document.getElementById('taskModalLabel');
        const taskIdInput = document.getElementById('task-id');
        const taskTitle = document.getElementById('task-title');
        const taskDescription = document.getElementById('task-description');
        const taskStatus = document.getElementById('task-status');
        const deleteButton = document.getElementById('delete-task');
        const editButton = document.getElementById('edit-task');
        const toggleStatusButton = document.getElementById('toggle-status');

        modalTitle.textContent = `Detalhes da Tarefa ${task.id}`;
        taskIdInput.value = task.id;
        taskTitle.textContent = task.descricao;
        taskDescription.textContent = `ID: ${task.id}`;
        taskStatus.textContent = task.concluida ? 'Status: Concluída' : 'Status: Pendente';

        deleteButton.addEventListener('click', () => {
            deleteTask(task.id); // Deleta a tarefa ao clicar no botão de deletar
            taskModal.hide(); // Esconde o modal após deletar
        });

        editButton.addEventListener('click', () => {
            const newDescription = prompt('Digite a nova descrição da tarefa:', task.descricao);
            if (newDescription !== null) {
                updateTask(task.id, newDescription); // Atualiza a descrição da tarefa
                taskModal.hide(); // Esconde o modal após editar
            }
        });

        toggleStatusButton.addEventListener('click', () => {
            const newStatus = task.concluida ? 0 : 1;
            updateTaskStatus(task.id, newStatus); // Altera o status da tarefa (concluída ou pendente)
            taskModal.hide(); // Esconde o modal após alterar o status
        });

        taskModal.show(); // Mostra o modal de detalhes da tarefa
    }

    // Atualiza a descrição da tarefa
    function updateTask(id, newDescription) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descricao: newDescription })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar a tarefa');
            }
            return response.json();
        })
        .then(() => {
            fetchTasks(); // Recarrega a lista de tarefas após a atualização
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

    // Atualiza o status da tarefa
    function updateTaskStatus(id, concluida) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ concluida: parseInt(concluida, 10) })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar o status da tarefa');
            }
            return response.json();
        })
        .then(() => {
            fetchTasks(); // Recarrega a lista de tarefas após a atualização
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

    // Deleta uma tarefa
    function deleteTask(id) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchTasks(); // Recarrega a lista de tarefas após deletar
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

    // Adiciona uma nova tarefa
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const descricao = taskInput.value;
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descricao })
        })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks(); // Recarrega a lista de tarefas após adicionar uma nova
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });

    // Busca uma tarefa por ID
    searchTaskButton.addEventListener('click', () => {
        buscarTarefa();
    });

    function buscarTarefa() {
        const taskId = document.getElementById('search-task-id').value;
        fetch(`${API_URL}/${taskId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tarefa não encontrada');
                }
                return response.json();
            })
            .then(data => {
                showTaskDetails(data.data); // Mostra os detalhes da tarefa encontrada
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Tarefa não encontrada. Verifique o ID informado.');
            });
    }

    // Carrega as tarefas iniciais ao carregar a página
    fetchTasks();
});
