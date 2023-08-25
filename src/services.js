// Función para obtener todas las tareas
async function getTasks() {
    let response = await fetch('http://localhost:3000/tasks');
    let data = await response.json();
    return data;
}

async function createTask(title, description = [],progress = 0, dueDate = "",  priority = "", category = "",completed = false) {
    let currentDate = new Date().toISOString().split('T')[0];
    let response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description,
            creationDate: currentDate,
            progress,
            dueDate,
            completed: false,
            priority,
            category,
            completed
        })
    });
    return await response.json();
}


async function addTask() {
    const title = document.getElementById('taskInput').value.trim();

    if (title) {
        // El segundo argumento es un array vacío para la descripción, y el comment como tercer argumento.
        await createTask(title, description = [], comment = "", dueDate = "", progress = 0, priority = "", category = "",completed = false); 
        
        // Limpia el input después de añadir la tarea
        document.getElementById('taskInput').value = '';

        await displayTasks();
    }
}



// Función para manejar el evento de tecla pulsada en el input
function handleInputKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

document.getElementById('taskInput').addEventListener('keyup', handleInputKeyPress);

async function toggleTaskCompletion(id, completed) {
    let response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed
        })
    });
    return await response.json();
}


async function updateTask(id, title, description, progress,dueDate, priority, category, completed) {
    let response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description,
            progress,
            dueDate,
            priority,
            category,
            completed
        })
    });
    return await response.json();
}

async function deleteTask(id) {
    let response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    });
    return "Task deleted";
}

async function deleteAllTasks() {
    const tasks = await getTasks();
    const promises = tasks.map(task => deleteTask(task.id));
    await Promise.all(promises);
    await displayTasks();
}




