
    // Function to fetch and display todos
    function getTodos() {
        fetch('/todos')
            .then(response => response.json())
            .then(data => {
                const todoList = document.getElementById('todoList');
                todoList.innerHTML = '';
                data.forEach(todo => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Task: ${todo.task}, Description: ${todo.description}, Status: ${todo.status}`;
                    todoList.appendChild(listItem);
                });
            });
    }

    // Function to add a new todo
    function addTodo() {
        const task = document.getElementById('task').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;

        fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, description, status })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            getTodos();
        });
    }



