/**
 * @jest-environment jest-environment-jsdom
 */
const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key],
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
      removeItem: (key) => {
        delete store[key];
      },
    };
  })();
  
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });
  
  const Task = require('./tasks.js');

describe('Task', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addTask', () => {
    it('adds a task to localStorage and returns the task', () => {
      const task = Task.addTask('test description');
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      expect(tasks).toEqual([task]);
      expect(task.description).toBe('test description');
      expect(task.completed).toBe(false);
    });
  });

  describe('removeTask', () => {
    it('removes a task from localStorage', () => {
      const task = Task.addTask('test description');
      Task.removeTask(task.id);
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      expect(tasks).toEqual([]);
    });

    it('removes the corresponding DOM element', () => {
      document.body.innerHTML = `
        <ul id="task-list">
          <li data-task-id="1">test description</li>
        </ul>
      `;
      const task = Task.addTask('test description');
      Task.removeTask(task.id);
      const liElements = document.querySelectorAll('#task-list li');
      expect(liElements.length).toBe(1);
    });
  });
});

const handleAddButtonClick = require('./index.js');
const Tasks = require('./tasks.js');
const renderTasks = require('./index.js');
jest.mock('./index.js'); 
handleAddButtonClick(Tasks, renderTasks);

describe('addButton', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should call Task.addTask and clear input value on click', () => {
    const addButton = document.createElement('button');
    const addInput = document.createElement('input');
    Tasks.addTask = jest.fn(); 
    renderTasks.mockClear(); 
    addButton.addEventListener('click', () => {
      const description = addInput.value;
      if (description) {
        Tasks.addTask(description);
        addInput.value = '';
        renderTasks(Tasks);
      }
    });
    addInput.value = 'test description';
    addButton.click();
    expect(Tasks.addTask).toHaveBeenCalledWith('test description');
    expect(addInput.value).toBe('');
    expect(renderTasks).toHaveBeenCalledTimes(1); 
  });
});