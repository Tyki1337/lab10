import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo-pro-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState('all');
  const [inputValue, setInputValue] = useState('');
  // Состояние для даты и времени (по умолчанию - текущий момент)
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    localStorage.setItem('todo-pro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !deadline) {
      alert("Введите задачу и выберите время!");
      return;
    }
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      deadline: deadline // Сохраняем выбранную дату и время
    };
    
    setTasks([...tasks, newTask]);
    setInputValue('');
    setDeadline('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

// Логика фильтрации
const filteredTasks = tasks.filter(task => {
  if (filter === 'all') return true;

  // Получаем дату задачи (ГГГГ-ММ-ДД)
  const taskDateStr = task.deadline.split('T')[0];
  
  // Получаем текущую дату в формате ГГГГ-ММ-ДД (локальное время)
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA'); // Формат YYYY-MM-DD
  
  // Получаем завтрашнюю дату
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

  if (filter === 'today') return taskDateStr === todayStr;
  if (filter === 'tomorrow') return taskDateStr === tomorrowStr;
  
  return true;
});

  // Форматирование даты для списка
  const formatDateTime = (dateTimeStr) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeStr).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="todo-container">
      <h1>Todo Pro</h1>

      <div className="stats">
        <span>✅ {tasks.filter(t => t.completed).length}</span>
        <span>⏳ {tasks.length - tasks.filter(t => t.completed).length}</span>
      </div>

      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Все</button>
        <button onClick={() => setFilter('today')} className={filter === 'today' ? 'active' : ''}>Сегодня</button>
        <button onClick={() => setFilter('tomorrow')} className={filter === 'tomorrow' ? 'active' : ''}>Завтра</button>
      </div>

      <form onSubmit={addTask} className="todo-form">
        <input 
          type="text"
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Название задачи..."
        />
        <input 
          type="datetime-local" 
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="date-input"
        />
        <button type="submit">➕</button>
      </form>

      <ul className="task-list">
        {filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div className="task-info" onClick={() => toggleTask(task.id)}>
              <span className="task-text">{task.text}</span>
              <small className="task-date">{formatDateTime(task.deadline)}</small>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;