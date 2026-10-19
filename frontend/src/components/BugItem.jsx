function BugItem({ bug, onDelete, onToggleStatus }) {
  const priorityClass = `priority-${bug.priority.toLowerCase()}`;
  const statusClass = `status-${bug.status.toLowerCase().replace(' ', '-')}`;

  return (
    <li className="bug-item">
      <div className="bug-info">
        <strong>#{bug.id} — {bug.title}</strong>
        <div className="meta">
          Приоритет: <span className={priorityClass}>{bug.priority}</span> |
          Статус: <span className={statusClass}>{bug.status}</span> |
          Исполнитель: {bug.assignee}
        </div>
      </div>
      <div className="actions">
        <button onClick={() => onToggleStatus(bug.id)} className="btn-toggle">
          {bug.status === 'Готов' ? '↩️ Вернуть' : '✅ Готово'}
        </button>
        <button onClick={() => onDelete(bug.id)} className="btn-delete">
          🗑️
        </button>
      </div>
    </li>
  );
}

export default BugItem;