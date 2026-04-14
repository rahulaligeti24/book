export const formatGenres = (genres = []) => genres.join(' • ');

export const truncateText = (text = '', length = 120) =>
  text.length > length ? `${text.slice(0, length)}...` : text;
