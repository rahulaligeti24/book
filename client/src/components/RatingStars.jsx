const RatingStars = ({ value = 0, interactive = false, onRate }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => interactive && onRate?.(star)}
        className={`text-lg transition ${star <= Math.round(value) ? 'text-gold' : 'text-slate-300'} ${
          interactive ? 'hover:scale-110' : 'cursor-default'
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

export default RatingStars;

