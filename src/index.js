const Task = require('./tasks.js');
// import './style.css';
const {
  renderTasks, addButton, addInput, clearAllButton,
} = require('./modules/todo.js');

renderTasks(Task);

function handleAddButtonClick(Task, renderTasks) {
  if (addButton) {
    addButton.addEventListener('click', () => {
      const description = addInput.value;
      if (description) {
        Task.addTask(description);
        addInput.value = '';
        renderTasks(Task);
      }
    });
  }
}

module.exports = handleAddButtonClick;

if (clearAllButton) {
  clearAllButton.addEventListener('click', () => {
    const tasks = Task.getTasks();
    const newTasks = tasks.filter((task) => !task.completed);
    newTasks.forEach((task, index) => {
      task.id = index + 1;
    });

    Task.setTasks(newTasks);
    renderTasks(Task);
  });
}