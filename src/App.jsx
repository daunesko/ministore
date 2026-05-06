import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';
import { AppCard } from './AppCard';

export default function App() {
  // Исходные данные
  const initialData = [
    { title: 'Атлас заметок', text: 'Приложение для заметок', date: '27.04', price: 0, image: null },
    { title: 'Jason', text: 'JSON редактор', date: '28.04', price: 199, image: null },
    { title: 'Линза', text: 'Просмотр изображений', date: '29.04', price: 0, image: null },
    { title: 'Переводчик', text: 'Переводит текст', date: '30.04', price: 99, image: null }
  ];

  const [data, setData] = useState(initialData);
  const [text, setText] = useState('');
  const [free, setFree] = useState(false);
  const [apps, setApps] = useState(initialData);

  // Состояние для модалки добавления картинки
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppIndex, setSelectedAppIndex] = useState(null);
  const fileInputRef = useRef(null);

  const inputHandler = (event) => {
    setText(event.currentTarget.value);
  };

  const checkHandler = (event) => {
    setFree(event.currentTarget.checked);
  };

  useEffect(() => {
    const filteredApps = data.filter((app) => {
      const matchesText = text === '' || app.title.toLowerCase().includes(text.toLowerCase());
      const matchesFree = !free || app.price === 0;
      return matchesText && matchesFree;
    });
    setApps(filteredApps);
  }, [text, free, data]);

  // Открыть модалку выбора картинки для конкретного приложения
  const openImageModal = (appIndex) => {
    setSelectedAppIndex(appIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppIndex(null);
  };

  // Обработка загрузки файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      // Обновляем data по title (ищем оригинальный индекс в data)
      const appTitle = apps[selectedAppIndex].title;
      setData(prev =>
        prev.map(app => app.title === appTitle ? { ...app, image: imageUrl } : app)
      );
      closeModal();
    };
    reader.readAsDataURL(file);
  };

  // Удалить картинку
  const removeImage = (appIndex) => {
    const appTitle = apps[appIndex].title;
    setData(prev =>
      prev.map(app => app.title === appTitle ? { ...app, image: null } : app)
    );
  };

  return (
    <>
      <h1 className={styles.header}>MiniStore</h1>

      <div className={styles.filter}>
        <input
          type="text"
          onInput={inputHandler}
          placeholder="Поиск приложений..."
        />
        <label>
          <input
            type="checkbox"
            onInput={checkHandler}
          />
          Только бесплатные
        </label>

        <div>Введенный текст: {text || '(пусто)'}</div>
        <div>Показывать бесплатные: {free ? 'Да' : 'Нет'}</div>
      </div>

      <main>
        {apps.map((app, index) => (
          <div key={index} className={styles.cardWrapper}>
            <AppCard
              title={app.title}
              text={app.text}
              date={app.date}
              price={app.price}
              image={app.image}
            />
            <div className={styles.imageControls}>
              <button
                className={styles.imageBtn}
                onClick={() => openImageModal(index)}
              >
                {app.image ? '🖼 Сменить картинку' : '🖼 Добавить картинку'}
              </button>
              {app.image && (
                <button
                  className={`${styles.imageBtn} ${styles.removeBtn}`}
                  onClick={() => removeImage(index)}
                >
                  ✕ Удалить
                </button>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Модалка выбора изображения */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Выбери картинку</h2>
            <p>Загрузи изображение для приложения <strong>{apps[selectedAppIndex]?.title}</strong></p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <button className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
              📁 Выбрать файл
            </button>
            <button className={styles.cancelBtn} onClick={closeModal}>Отмена</button>
          </div>
        </div>
      )}
    </>
  );
}
