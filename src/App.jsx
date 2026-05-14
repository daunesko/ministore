import { useEffect, useState } from 'react';
import styles from './App.module.css';
import { AppCard } from './AppCard';

const API_URL = 'https://openlibrary.org/search.json';

const initialFilters = {
  search: 'javascript',
  subject: '',
  language: '',
  onlyCovers: true,
};

function buildSearchUrl(filters) {
  const params = new URLSearchParams({
    q: filters.search.trim() || 'books',
    fields: 'key,title,author_name,first_publish_year,cover_i,edition_count,language',
    limit: '12',
  });

  if (filters.subject) {
    params.set('subject', filters.subject);
  }

  if (filters.language) {
    params.set('language', filters.language);
  }

  return `${API_URL}?${params.toString()}`;
}

export default function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [requestFilters, setRequestFilters] = useState(initialFilters);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const changeFilter = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setRequestFilters(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setRequestFilters(initialFilters);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function getBooks() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(buildSearchUrl(requestFilters), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Не получилось получить книги');
        }

        const data = await response.json();
        const docs = Array.isArray(data.docs) ? data.docs : [];
        const preparedBooks = requestFilters.onlyCovers
          ? docs.filter((book) => book.cover_i)
          : docs;

        setBooks(preparedBooks);
        setTotal(data.numFound || 0);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('API не ответил. Попробуйте изменить запрос или обновить страницу.');
          setBooks([]);
          setTotal(0);
        }
      } finally {
        setIsLoading(false);
      }
    }

    getBooks();

    return () => {
      controller.abort();
    };
  }, [requestFilters]);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Open Library API</p>
          <h1>Книжная полка</h1>
          <p className={styles.subtitle}>
            Небольшой React-проект: данные приходят с сервера, а фильтры собирают новый запрос.
          </p>
        </div>
      </header>

      <form className={styles.filters} onSubmit={submitHandler}>
        <label className={styles.field}>
          <span>Что ищем</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => changeFilter('search', event.currentTarget.value)}
            placeholder="Например: history, design, python"
          />
        </label>

        <label className={styles.field}>
          <span>Тема</span>
          <select
            value={filters.subject}
            onChange={(event) => changeFilter('subject', event.currentTarget.value)}
          >
            <option value="">Любая</option>
            <option value="science">Наука</option>
            <option value="art">Искусство</option>
            <option value="history">История</option>
            <option value="programming">Программирование</option>
            <option value="music">Музыка</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Язык</span>
          <select
            value={filters.language}
            onChange={(event) => changeFilter('language', event.currentTarget.value)}
          >
            <option value="">Любой</option>
            <option value="eng">English</option>
            <option value="rus">Русский</option>
            <option value="fre">Français</option>
            <option value="ger">Deutsch</option>
            <option value="spa">Español</option>
          </select>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={filters.onlyCovers}
            onChange={(event) => changeFilter('onlyCovers', event.currentTarget.checked)}
          />
          <span>Только с обложками</span>
        </label>

        <div className={styles.actions}>
          <button type="submit">Поиск</button>
          <button type="button" className={styles.secondaryButton} onClick={resetFilters}>
            Сбросить
          </button>
        </div>
      </form>

      <section className={styles.statusLine}>
        {isLoading && <span>Загрузка книг...</span>}
        {!isLoading && !error && <span>Найдено в API: {total.toLocaleString('ru-RU')}</span>}
        {error && <span className={styles.error}>{error}</span>}
      </section>

      <main className={styles.grid}>
        {!isLoading && books.length === 0 && !error && (
          <p className={styles.empty}>По этому запросу ничего не нашлось.</p>
        )}

        {books.map((book) => (
          <AppCard
            key={book.key}
            title={book.title}
            authors={book.author_name}
            year={book.first_publish_year}
            editions={book.edition_count}
            coverId={book.cover_i}
            languages={book.language}
          />
        ))}
      </main>
    </div>
  );
}
