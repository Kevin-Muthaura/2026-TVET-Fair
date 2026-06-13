import { starsArray } from '../lib/utils';

export default function StarRating({ rating, small = false }) {
  const stars = starsArray(rating);
  return (
    <div className={small ? 'review-stars-small' : 'review-stars-display'}>
      {stars.map((type, i) => (
        <span key={i} className={`star ${type}`}>{type === 'empty' ? '☆' : '★'}</span>
      ))}
    </div>
  );
}
