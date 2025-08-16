export function getStatusLabel(status) {
  switch(status) {
    case 'planned': return 'Запланировано';
    case 'reading': return 'Читаю';
    case 'finished': return 'Прочитано';
    case 'favourites': return 'Избранное';
    default: return status;
  }
}