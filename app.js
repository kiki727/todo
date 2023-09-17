const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve static files iz 'public' directory
app.use(express.static('public'));

let todos = [];

// Read todos from file on startup
fs.readFile('todos.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    try {
      todos = JSON.parse(data);
    } catch (error) {
      todos = [];
    }
  }
});


//Function to save todos to file
function saveTodosToFile() {
  fs.writeFile('todos.json', JSON.stringify(todos), 'utf8', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Todos saved to file');
    }
  });
}

// Set up routes
app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { task, description, status } = req.body;
  console.log(task, description, status)
  if (status !== 'todo' && status !== 'inprogress' && status !== 'done') {
    return res.status(400).send('Invalid status');
  }
  const newTodo = { id: todos.length + 1, task, description, status };
  todos.push(newTodo);
  saveTodosToFile();
  res.send('Task added successfully');
});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { task, description, status } = req.body;
  if (status !== 'todo' && status !== 'inprogress' && status !== 'done') {
    return res.status(400).send('Invalid status');
  }
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos[index].task = task;
    todos[index].description = description;
    todos[index].status = status;
    saveTodosToFile();
    res.send('Task updated successfully');
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  saveTodosToFile();
  res.send('Task deleted successfully');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
