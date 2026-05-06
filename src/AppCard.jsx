import styles from './AppCard.module.css';

export function AppCard({ title, text, date, price, image }) {
  return (
    <section className={styles.card}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={title} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>📦</span>
          </div>
        )}
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className={styles.footer}>
        <span className={styles.date}>{date}</span>
        <span className={styles.price}>{price === 0 ? 'Бесплатно' : `${price} ₽`}</span>
      </div>
    </section>
  );
}
