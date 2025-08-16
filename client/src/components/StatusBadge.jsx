function StatusBadge({ status }) {
  const statusLabels = {
    'planned': 'Запланировано',
    'reading': 'Читаю',
    'finished': 'Прочитано',
    'favourites': 'Избранное'
  };
  
  return (
    <div className="book-status">
      <span className={`status-badge ${status}`}>
        {statusLabels[status] || status}
      </span>
    </div>
  );
}

export default StatusBadge