import { useState, useEffect } from 'react';
import BugItem from './BugItem';
import AddBugForm from './AddBugForm';
import { fetchBugs, addBug, updateBug, deleteBug } from '../api';

function BugList({ user }) {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadBugs = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBugs(signal);
      setBugs(response.data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError('Не удалось загрузить список багов. Проверьте, запущен ли сервер.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadBugs(controller.signal);
    return () => controller.abort(); 
  }, []);

  const handleRetry = () => loadBugs();

  const handleAdd = async (newBug) => {
    const tempId = Date.now();
    const optimisticBug = { ...newBug, id: tempId, status: 'Новый' };
    setBugs(prev => [...prev, optimisticBug]);

    try {
      const response = await addBug(newBug);
      setBugs(prev => prev.map(b => b.id === tempId ? response.data : b));
    } catch (err) {
      setBugs(prev => prev.filter(b => b.id !== tempId));
      alert('Ошибка при добавлении бага на сервер');
    }
  };

  const handleDelete = async (id) => {
    const deletedBug = bugs.find(b => b.id === id);
    setBugs(prev => prev.filter(b => b.id !== id));
    try {
      await deleteBug(id);
    } catch (err) {
      setBugs(prev => [...prev, deletedBug].sort((a, b) => a.id - b.id));
      alert('Ошибка при удалении бага');
    }
  };

  const handleToggleStatus = async (id) => {
    const bug = bugs.find(b => b.id === id);
    if (!bug) return;
    const newStatus = bug.status === 'Готов' ? 'Новый' : 'Готов';
    setBugs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    try {
      await updateBug(id, { ...bug, status: newStatus });
    } catch (err) {
      setBugs(prev => prev.map(b => b.id === id ? bug : b));
      alert('Ошибка при обновлении статуса');
    }
  };

  const filteredBugs = filter === 'all' ? bugs : bugs.filter(b => b.status === filter);
  
  const stats = {
    total: bugs.length,
    new: bugs.filter(b => b.status === 'Новый').length,
    inWork: bugs.filter(b => b.status === 'В работе').length,
    done: bugs.filter(b => b.status === 'Готов').length,
  };

  if (loading) return <div className="loading">⏳ Загрузка данных с сервера...</div>;
  if (error) return (
    <div className="error-box">
      <p>❌ {error}</p>
      <button onClick={handleRetry} className="btn-retry">🔄 Повторить</button>
    </div>
  );

  return (
    <div className="bug-list">
      <h1>🐛 Bug Tracker</h1>

      <div className="stats">
        <span>Всего: <strong>{stats.total}</strong></span>
        <span>Новых: <strong>{stats.new}</strong></span>
        <span>В работе: <strong>{stats.inWork}</strong></span>
        <span>Готово: <strong>{stats.done}</strong></span>
      </div>

      <div className="filter">
        <label>Фильтр по статусу: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="Новый">Новый</option>
          <option value="В работе">В работе</option>
          <option value="Готов">Готов</option>
        </select>
      </div>

      <AddBugForm onAdd={handleAdd} />

      {filteredBugs.length === 0 ? (
        <p className="empty">Нет багов по выбранному фильтру.</p>
      ) : (
        <ul className="bugs">
          {filteredBugs.map(bug => (
            <BugItem
              key={bug.id}
              bug={bug}
              user={user}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default BugList;