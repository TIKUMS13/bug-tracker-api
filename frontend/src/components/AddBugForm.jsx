import { useState } from 'react';

function AddBugForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Средний');
  const [assignee, setAssignee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      priority,
      status: 'Новый',
      assignee: assignee.trim() || 'Не назначен',
    });

    setTitle('');
    setPriority('Средний');
    setAssignee('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        placeholder="Название бага"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Низкий">Низкий</option>
        <option value="Средний">Средний</option>
        <option value="Высокий">Высокий</option>
      </select>
      <input
        type="text"
        placeholder="Исполнитель"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
      />
      <button type="submit">➕ Добавить</button>
    </form>
  );
}

export default AddBugForm;