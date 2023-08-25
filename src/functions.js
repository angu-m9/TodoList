let currentTaskId = null; // Global variable to track the current task being edited

function resetModalValues() {
    document.getElementById('modalTaskTitle').innerText = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('progressInput').value = '0';
    document.getElementById('dueDateInput').value = '';
    document.getElementById('priority').value = 'high';
    document.getElementById('category').value = 'trabajo';
}

async function showTaskModal(taskId, taskTitle) {
    console.log(`Función showTaskModal llamada con el ID: ${taskId} y título: ${taskTitle}`);

    // Llenar los campos con los datos actuales de la tarea
    const tasks = await getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('descriptionInput').value = task.description || '';
        document.getElementById('progressInput').value = task.progress || '0';
        document.getElementById('dueDateInput').value = task.dueDate || '';
        document.getElementById('priority').value = task.priority || 'high';
        document.getElementById('category').value = task.category || 'trabajo';
    }

    // Mostrar la ventana modal
    document.getElementById('taskModal').style.display = 'block';
    document.getElementById('modalTaskTitleInput').value = taskTitle;

    currentTaskId = taskId;
}

document.querySelector('.close-button').addEventListener('click', function () {
    document.getElementById('taskModal').style.display = 'none';
});

async function displayTasks() {
    console.log("Iniciando displayTasks...");

    const tasks = await getTasks();
    console.log("Tareas recibidas:", tasks);

    const taskList = document.getElementById('taskList');
    console.log("Elemento taskList:", taskList);

    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        console.log(`Procesando tarea ${index}:`, task);

        const li = document.createElement('li');
        console.log(`Elemento li creado:`, li);

        const container = document.createElement('div');
        container.classList.add('task-container');

        const completeBtn = document.createElement('span');
        completeBtn.innerHTML = '<i class="fa-regular fa-circle"></i>';
        // Nuevas líneas: Aquí verificamos si la tarea está completada
        if (task.completed) {
            completeBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            li.classList.add('completed');
        } else {
            completeBtn.innerHTML = '<i class="fa-regular fa-circle"></i>';
            li.classList.remove('completed');
        }
        completeBtn.classList.add('complete-btn');

        // Opción 1: Antes y después de agregar los eventos
        console.log("Agregando eventos a .edit-task y .delete-task...");


        completeBtn.addEventListener('click', async () => {
            console.log("Click en botón de tarea completada");
            let completed = false;
            if (li.classList.contains('completed')) {
                completeBtn.innerHTML = '<i class="fa-regular fa-circle"></i>';
                li.classList.remove('completed');
                completed = false;
            } else {
                completeBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                li.classList.add('completed');
                completed = true;
            }
            await toggleTaskCompletion(task.id, completed); // Esta línea es nueva
            await displayTasks();  // Actualiza la lista de tareas para reflejar el cambio
        });
        container.appendChild(completeBtn);

        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;

        taskTitle.addEventListener('click', () => {
            console.log(`Click en título de tarea: ${task.title}`);
            showTaskModal(task.id, task.title);
        });
        container.appendChild(taskTitle);

        const optionsBtn = document.createElement('span');
        const optionsMenu = document.createElement('div');
        const ellipsisIcon = document.createElement('i');

        optionsMenu.classList.add('options-menu');
        optionsMenu.style.display = 'none';

        optionsMenu.innerHTML = `<span class="edit-task"><i class="fa-solid fa-pen"></i>Editar</span> <span class="delete-task"><i class="fa-solid fa-trash"></i>Eliminar</span>`;

        ellipsisIcon.className = 'fa-solid fa-ellipsis-vertical';

        optionsBtn.appendChild(ellipsisIcon);
        optionsBtn.appendChild(optionsMenu);
        optionsBtn.classList.add('options-btn');

        optionsBtn.addEventListener('click', () => {
            console.log('Click en botón de opciones');
            optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
        });

        optionsMenu.querySelector('.edit-task').addEventListener('click', async () => {
            console.log("Evento click en .edit-task disparado.");
            await showTaskModal(task.id, task.title);
        });

        optionsMenu.querySelector('.delete-task').addEventListener('click', async () => {
            console.log("Evento click en .delete-task disparado.");
            await deleteTask(task.id);
            await displayTasks();
        });
        console.log("Eventos agregados a .edit-task y .delete-task.");
        container.appendChild(optionsBtn);
        li.appendChild(container);
        taskList.appendChild(li);
    });

    console.log("Finalizando displayTasks...");
    
}

window.onload = displayTasks;

async function updateModalTask() {
    const title = document.getElementById('modalTaskTitleInput').value;
    const description = document.getElementById('descriptionInput').value;
    const progress = document.getElementById('progressInput').value;
    const dueDate = document.getElementById('dueDateInput').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    const completed = document.getElementById('taskModal').classList.contains('completed');

    await updateTask(currentTaskId, title, description, progress, dueDate, priority, category, completed);

    document.getElementById('taskModal').style.display = 'none';
    await displayTasks();
}


let tasksGlobal = []; // Variable global para almacenar las tareas

async function getTasks() {
    let response = await fetch('http://localhost:3000/tasks');
    let data = await response.json();
    tasksGlobal = data; // Guardamos las tareas en la variable global
    return data;
}

async function sortNewestToOldest() {
    const tasks = await getTasks();
    const sortedTasks = tasks.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
    await displayTasks();
}

async function sortOldestToNewest() {
    const tasks = await getTasks();
    const sortedTasks = tasks.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
    await displayTasks();
}


