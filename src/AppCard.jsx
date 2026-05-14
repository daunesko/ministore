import styles from './AppCard.module.css';

export function AppCard({ title, authors = [], year, editions, coverId, languages = [] }) {
  const authorList = Array.isArray(authors) ? authors : [authors];
  const languageList = Array.isArray(languages) ? languages : [languages];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;
  const languageText = languageList.length > 0 ? languageList.slice(0, 3).join(', ') : 'нет данных';

  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        {coverUrl ? (
          <img src={coverUrl} alt={title} />
        ) : (
          <span>Book</span>
        )}
      </div>

      <div className={styles.content}>
        <h2>{title}</h2>
        <p className={styles.author}>{authorList.length > 0 ? authorList.join(', ') : 'Автор не указан'}</p>
      </div>

      <dl className={styles.info}>
        <div>
          <dt>Год</dt>
          <dd>{year || 'неизвестно'}</dd>
        </div>
        <div>
          <dt>Изданий</dt>
          <dd>{editions || 1}</dd>
        </div>
        <div>
          <dt>Языки</dt>
          <dd>{languageText}</dd>
        </div>
      </dl>
    </article>
  );
}
