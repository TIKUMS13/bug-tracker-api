import { useState, useEffect } from 'react';
import BugItem from './BugItem';
import AddBugForm from './AddBugForm';

// Функция для начальных (моковых) данных
const getDefaultBugs = () => [
  { id: 1, title: 'Ошибка входа', priority: 'Высокий', status: 'Новый', assignee: 'Иван' },
  { id: 2, title: 'Не работает кнопка', priority: 'Средний', status: 'В работе', assignee: 'Петр' },
  { id: 3, title: 'Слетает верстка', priority: 'Высокий', status: 'Готов', assignee: 'Мария' },
];

function BugList() {
  // 1. Массив багов (изначально пустой)
  const [bugs, setBugs] = useState([]);

  // 2. Флаг, что данные загружены (чтобы не сохранять пустой массив при первом рендере)
  const [loaded, setLoaded] = useState(false);

  // 3. Состояние фильтра
  const [filter, setFilter] = useState('all');

  // 4. useEffect с ПУСТЫМ массивом — загрузка при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('bugs');
    
    if (saved) {
      try {
        setBugs(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка парсинга localStorage:', e);
        setBugs(getDefaultBugs());
      }
    } else {
      setBugs(getDefaultBugs());
    }
    
    setLoaded(true);
  }, []); // ← Пустой массив = только при монтировании

  // 5. useEffect с зависимостью [bugs] — сохранение в localStorage
  useEffect(() => {
    // Сохраняем только после загрузки (чтобы не перезаписать пустым массивом)
    if (loaded) {
      localStorage.setItem('bugs', JSON.stringify(bugs));
    }
  }, [bugs, loaded]); // ← Зависимости: bugs и loaded

  // 6. useEffect — изменение заголовка страницы
  useEffect(() => {
    document.title = `Bug Tracker (${bugs.length} багов)`;
  }, [bugs.length]); // ← Зависимость: длина массива

  // 7. Добавление бага
  const addBug = (newBug) => {
    const id = bugs.length > 0 ? Math.max(...bugs.map(b => b.id)) + 1 : 1;
    setBugs([...bugs, { ...newBug, id }]);
  };

  // 8. Удаление бага
  const deleteBug = (id) => {
    setBugs(bugs.filter(b => b.id !== id));
  };

  // 9. Изменение статуса (редактирование)
  const toggleStatus = (id) => {
    setBugs(bugs.map(b =>
      b.id === id
        ? { ...b, status: b.status === 'Готов' ? 'Новый' : 'Готов' }
        : b
    ));
  };

  // 10. Фильтрация
  const filteredBugs = filter === 'all'
    ? bugs
    : bugs.filter(b => b.status === filter);

  // Статистика
  const stats = {
    total: bugs.length,
    new: bugs.filter(b => b.status === 'Новый').length,
    inWork: bugs.filter(b => b.status === 'В работе').length,
    done: bugs.filter(b => b.status === 'Готов').length,
  };

  // Пока данные не загружены — показываем заглушку
  if (!loaded) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="bug-list">
      <h1>🐛 Bug Tracker</h1>

      {/* Статистика */}
      <div className="stats">
        <span>Всего: <strong>{stats.total}</strong></span>
        <span>Новых: <strong>{stats.new}</strong></span>
        <span>В работе: <strong>{stats.inWork}</strong></span>
        <span>Готово: <strong>{stats.done}</strong></span>
      </div>

      {/* Фильтр */}
      <div className="filter">
        <label>Фильтр по статусу: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="Новый">Новый</option>
          <option value="В работе">В работе</option>
          <option value="Готов">Готов</option>
        </select>
      </div>

      {/* Форма добавления */}
      <AddBugForm onAdd={addBug} />

      {/* Список */}
      {filteredBugs.length === 0 ? (
        <p className="empty">Нет багов по выбранному фильтру.</p>
      ) : (
        <ul className="bugs">
          {filteredBugs.map(bug => (
            <BugItem
              key={bug.id}
              bug={bug}
              onDelete={deleteBug}
              onToggleStatus={toggleStatus}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default BugList;