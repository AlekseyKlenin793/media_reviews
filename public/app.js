// Объект для хранения всех медиа
let library = [];

// Функция для отображения формы в зависимости от типа медиа
function showForm() {
    const mediaForm = document.getElementById('media-form');
    const mediaType = document.getElementById('media-type').value;

    let formContent = '';

    if (mediaType === 'movie') {
        formContent = `
            <div class="form-group">
                <label for="title">Название</label>
                <input type="text" id="title" required>
            </div>
            <div class="form-group">
                <label for="director">Режиссёр</label>
                <input type="text" id="director" required>
            </div>
            <div class="form-group">
                <label for="year">Год выпуска</label>
                <input type="number" id="year" min="0" required>
            </div>
            <div class="form-group">
                <label for="review">Рецензия</label>
                <textarea id="review"></textarea>
            </div>
            <div class="form-group">
                <label for="status">Статус</label>
                <select id="status">
                    <option value="plan">Планирую</option>
                    <option value="in-progress">В процессе</option>
                </select>
            </div>
        `;
    } else if (mediaType === 'series') {
        formContent = `
            <div class="form-group">
                <label for="title">Название</label>
                <input type="text" id="title" required>
            </div>
            <div class="form-group">
                <label for="director">Режиссёр</label>
                <input type="text" id="director" required>
            </div>
            <div class="form-group">
                <label for="seasons">Количество сезонов</label>
                <input type="number" id="seasons" min="1" required>
            </div>
            <div class="form-group">
                <label for="review">Рецензия</label>
                <textarea id="review"></textarea>
            </div>
            <div class="form-group">
                <label for="status">Статус</label>
                <select id="status">
                    <option value="plan">Планирую</option>
                    <option value="in-progress">В процессе</option>
                </select>
            </div>
        `;
    } else if (mediaType === 'music') {
        formContent = `
            <div class="form-group">
                <label for="title">Название</label>
                <input type="text" id="title" required>
            </div>
            <div class="form-group">
                <label for="artist">Исполнитель</label>
                <input type="text" id="artist" required>
            </div>
            <div class="form-group">
                <label for="year">Год выпуска</label>
                <input type="number" id="year" min="0" required>
            </div>
            <div class="form-group">
                <label for="review">Рецензия</label>
                <textarea id="review"></textarea>
            </div>
            <div class="form-group">
                <label for="status">Статус</label>
                <select id="status">
                    <option value="plan">Планирую</option>
                    <option value="in-progress">В процессе</option>
                </select>
            </div>
        `;
    }

    mediaForm.innerHTML = formContent;
}

// Функция для добавления медиа в библиотеку
function addMedia() {
    const mediaType = document.getElementById('media-type').value;
    const title = document.getElementById('title').value;
    const review = document.getElementById('review').value;
    const status = document.getElementById('status').value;

    let newMedia = { type: mediaType, title, review, status };

    if (mediaType === 'movie') {
        const director = document.getElementById('director').value;
        const year = document.getElementById('year').value;
        newMedia = { ...newMedia, director, year };
    } else if (mediaType === 'series') {
        const director = document.getElementById('director').value;
        const seasons = document.getElementById('seasons').value;
        newMedia = { ...newMedia, director, seasons };
    } else if (mediaType === 'music') {
        const artist = document.getElementById('artist').value;
        const year = document.getElementById('year').value;
        newMedia = { ...newMedia, artist, year };
    }

    // Добавляем медиа в библиотеку
    library.push(newMedia);

    // Сохраняем библиотеку в localStorage
    saveLibrary();

    // Обновляем отображение библиотеки и Kanban
    displayLibrary();
    displayKanban();
}

// Функция для отображения содержимого библиотеки
function displayLibrary() {
    const libraryContainer = document.getElementById('library');
    libraryContainer.innerHTML = '';

    library.forEach((media, index) => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.innerHTML = `
            <h4>${media.title}</h4>
            <p>${media.type === 'movie' ? 'Режиссёр' : media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}: ${media.director || media.artist}</p>
            <button onclick="viewMedia(${index})">Просмотреть</button>
            <button onclick="deleteMedia(${index})">Удалить</button>
        `;
        libraryContainer.appendChild(mediaCard);
    });
}

// Функция для удаления медиа из библиотеки
function deleteMedia(index) {
    library.splice(index, 1);
    saveLibrary();
    displayLibrary();
    displayKanban();
}

// Функция для просмотра медиа
function viewMedia(index) {
    const modal = document.getElementById('modal');
    const modalInfo = document.getElementById('modal-info');
    const media = library[index];

    modalInfo.innerHTML = `
        <h2>${media.title}</h2>
        <p>Тип: ${media.type === 'movie' ? 'Фильм' : media.type === 'series' ? 'Сериал' : 'Музыка'}</p>
        <p>${media.type === 'movie' ? 'Режиссёр' : media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}: ${media.director || media.artist}</p>
        ${media.year ? `<p>Год: ${media.year}</p>` : ''}
        ${media.seasons ? `<p>Количество сезонов: ${media.seasons}</p>` : ''}
        <p>Рецензия: ${media.review || 'Нет рецензии'}</p>
    `;

    modal.style.display = 'flex';
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Функция для отображения Kanban-доски
function displayKanban() {
    const kanbanPlans = document.getElementById('kanban-plans').querySelector('.kanban-items');
    const kanbanInProgress = document.getElementById('kanban-in-progress').querySelector('.kanban-items');

    kanbanPlans.innerHTML = '';
    kanbanInProgress.innerHTML = '';

    library.forEach(media => {
        const kanbanCard = document.createElement('div');
        kanbanCard.classList.add('kanban-card');
        kanbanCard.innerText = media.title;

        if (media.status === 'plan') {
            kanbanPlans.appendChild(kanbanCard);
        } else if (media.status === 'in-progress') {
            kanbanInProgress.appendChild(kanbanCard);
        }
    });
}

// Функция для сохранения данных в localStorage
function saveLibrary() {
    localStorage.setItem('library', JSON.stringify(library));
}

// Функция для загрузки данных из localStorage
function loadLibrary() {
    const savedLibrary = localStorage.getItem('library');
    if (savedLibrary) {
        library = JSON.parse(savedLibrary);
    }

    displayLibrary();
    displayKanban();
}

// Загрузка данных при загрузке страницы
window.onload = loadLibrary;
