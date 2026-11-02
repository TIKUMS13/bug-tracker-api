import { shareBug } from '../api';

function BugItem({ bug, user, onDelete, onToggleStatus }) {
  const priorityClass = `priority-${bug.priority.toLowerCase()}`;
  const statusClass = `status-${bug.status.toLowerCase().replace(' ', '-')}`;

  // Права на удаление: админ или автор
  const canEdit = user?.role === 'admin' || Number(bug.userId) === Number(user?.id);

  const handleShare = async () => {
    const email = prompt('Введите email пользователя, которому хотите дать доступ:');
    if (!email) return;

    try {
      await shareBug(bug.id, email);
      alert('Доступ успешно выдан!');
      // Принудительно перезагружаем страницу, чтобы обновить список (простой способ)
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка выдачи доступа');
    }
  };

  return (
    <li className="bug-item">
      <div className="bug-info">
        <strong>#{bug.id} — {bug.title}</strong>
        <div className="meta">
          Приоритет: <span className={priorityClass}>{bug.priority}</span> |
          Статус: <span className={statusClass}>{bug.status}</span> |
          Исполнитель: {bug.assignee}
          
          {/* Показываем список пользователей с доступом */}
          {bug.sharedWith && bug.sharedWith.length > 0 && (
             <div style={{fontSize: '12px', color: '#3498db', marginTop: '6px', fontWeight: 'bold'}}>
               👥 Доступ у: {bug.sharedWith.map(u => u.email).join(', ')}
             </div>
          )}
        </div>
      </div>
      <div className="actions">
        <button onClick={() => onToggleStatus(bug.id)} className="btn-toggle">
          {bug.status === 'Готов' ? '↩️ Вернуть' : '✅ Готово'}
        </button>
        
        {canEdit && (
          <>
            <button 
              onClick={handleShare} 
              style={{background: '#f39c12', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer'}}
            >
              🤝 Поделиться
            </button>
            <button onClick={() => onDelete(bug.id)} className="btn-delete">
              🗑️
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default BugItem;