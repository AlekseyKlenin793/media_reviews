// Объект для хранения всех медиа
let library = [];

// Функция для отображения формы в зависимости от типа медиа
function showForm() {
    const mediaForm = document.getElementById('media-form');
    const mediaType = document.getElementById('media-type').value;

    if (!mediaType) {
        mediaForm.innerHTML = '';
        return;
    }

    const formContent = `
        <div class="form-group">
            <label for="title">Название</label>
            <input type="text" id="title" placeholder="Введите название" required>
        </div>
        <div class="form-group">
            ${mediaType === 'music' ? `
                <label for="artist">Исполнитель</label>
                <input type="text" id="artist" placeholder="Введите исполнителя" required>
            ` : `
                <label for="director">Режиссёр</label>
                <input type="text" id="director" placeholder="Введите режиссёра" required>
            `}
        </div>
        ${mediaType === 'series' ? `
            <div class="form-group">
                <label for="seasons">Количество сезонов</label>
                <input type="number" id="seasons" placeholder="Введите количество сезонов" min="1" required>
            </div>
        ` : ''}
        <div class="form-group">
            <label for="release_year">Год выпуска</label>
            <input type="number" id="release_year" placeholder="Введите год" min="0" required>
        </div>
        ${mediaType !== 'music' ? `
            <div class="form-group">
                <label for="country">Страна</label>
                <input type="text" id="country" placeholder="Введите страну" required>
            </div>
        ` : ''}
        <div class="form-group">
            <label for="genre">Жанр</label>
            <input type="text" id="genre" placeholder="Введите жанр" required>
        </div>
        <div class="form-group">
            <label for="rating">Рейтинг</label>
            <input type="number" id="rating" placeholder="Введите рейтинг (1-10) (опционально)" min="1" max="10">
        </div>
        <div class="form-group">
            <label for="review">Рецензия</label>
            <textarea id="review" placeholder="Введите рецензию (опционально)" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label for="status">Статус</label>
            <select id="status" required>
                <option value="plan">Планирую</option>
                <option value="in-progress">В процессе</option>
                <option value="finished">${mediaType === 'music' ? 'Прослушано' : 'Просмотрено'}</option>
            </select>
        </div>
    `;

    mediaForm.innerHTML = formContent;
    mediaForm.style.display = 'flex';
    mediaForm.style.flexDirection = 'column';
    mediaForm.style.gap = '10px';
}


async function addMedia() {
    if (!validateForm()) return;

    const mediaType = document.getElementById('media-type').value;
    const title = document.getElementById('title').value;
    const review = document.getElementById('review').value;
    const status = document.getElementById('status').value;
    const release_year = document.getElementById('release_year').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value || null;

    let newMedia = { type: mediaType, title, review, status };

    // Обработка фильмов
    if (mediaType === 'movie') {
        const director = document.getElementById('director').value;
        const country = document.getElementById('country').value;
        newMedia = { ...newMedia, director, release_year, country, genre, rating };
    }
    // Обработка сериалов
    else if (mediaType === 'series') {
        const director = document.getElementById('director').value;
        const seasons = document.getElementById('seasons').value;
        const country = document.getElementById('country').value;
        newMedia = { ...newMedia, director, release_year, seasons, country, genre, rating };
    }
    // Обработка музыки
    else if (mediaType === 'music') {
        const artist = document.getElementById('artist').value;
        newMedia = { ...newMedia, artist, release_year, genre, rating };
    }

    try {
        const response = await fetch('/api/media', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMedia),
        });

        if (response.ok) {
            console.log('Медиа добавлено успешно:', await response.json());
            await fetchLibrary(); // Обновляем данные после добавления
            clearForm(mediaType); // Очищаем форму
        } else {
            console.error('Ошибка при добавлении медиа:', await response.text());
            alert('Ошибка при добавлении медиа. Попробуйте снова.');
        }
    } catch (error) {
        console.error('Ошибка соединения с сервером:', error);
        alert('Не удалось соединиться с сервером.');
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}


function clearForm(mediaType) {
    const mediaForm = document.getElementById('media-form');
    mediaForm.innerHTML = '';
    document.getElementById('media-type').value = mediaType;
    showForm();
}

function viewMedia(index) {
    const modal = document.getElementById('modal');
    const modalInfo = document.getElementById('modal-info');
    const media = library[index];

    modalInfo.innerHTML = `
        <h2>${media.title}</h2>
        <div class="info-item">
            <p class="info-label">Тип:</p>
            <p class="info-item-value">${media.type === 'movie' ? 'Фильм' : media.type === 'series' ? 'Сериал' : 'Музыка'}</p>
        </div>
        <div class="info-item">
            <p class="info-label">${media.type === 'music' ? 'Исполнитель' : 'Режиссёр'}:</p>
            <p class="info-item-value">${media.artist || media.director || 'Не указано'}</p>
        </div>
        ${media.seasons ? `
        <div class="info-item">
            <p class="info-label">Количество сезонов:</p>
            <p class="info-item-value">${media.seasons}</p>
        </div>
        ` : ''}
        ${media.release_year ? `
        <div class="info-item">
            <p class="info-label">Год выпуска:</p>
            <p class="info-item-value">${media.release_year}</p>
        </div>
        ` : ''}
        ${media.country ? `
        <div class="info-item">
            <p class="info-label">Страна:</p>
            <p class="info-item-value">${media.country}</p>
        </div>
        ` : ''}
        ${media.genre ? `
        <div class="info-item">
            <p class="info-label">Жанр:</p>
            <p class="info-item-value">${media.genre}</p>
        </div>
        ` : ''}
        ${media.rating !== undefined && media.rating !== null ? `
            <div class="info-item">
                <p class="info-label">Рейтинг:</p>
                <p class="info-item-value">${media.rating}/10</p>
            </div>
            ` : ''}
        <div class="info-item">
            <p class="info-label">Рецензия:</p>
            <p class="info-item-value">${media.review || 'Нет рецензии'}</p>
        </div>
        <div class="info-item status">
            <p class="info-label">Статус:</p>
            <p class="info-item-value">${media.status === 'plan' ? 'Планирую' : media.status === 'in-progress' ? 'В процессе' : media.type === 'music' ? 'Прослушано' : 'Просмотрено'}</p>
        </div>
    `;

    modal.style.display = 'flex';
}


// Функция для отображения Kanban-доски
function displayLibrary() {
    const libraryContainer = document.getElementById('library');
    libraryContainer.innerHTML = library.map((media, index) => renderMediaCard(media, index)).join('');
}


// Функция для отображения Истории
function displayHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';

    library.filter(media => media.status === 'finished').forEach(media => {
        const historyCard = document.createElement('div');
        historyCard.classList.add('history-card');
        historyCard.innerHTML = `
            <h4>${media.title}${media.release_year ? ` (${media.release_year})` : ''} - 
                ${media.type === 'movie' || media.type === 'series'
                ? media.director || 'Режиссёр не указан'
                : media.artist || 'Исполнитель не указан'}
            </h4>
        `;
        historyContainer.appendChild(historyCard);
    });
}

// Функция для добавления в Историю
function addToHistory(media) {
    if (media.status === 'finished') {
        const existingMedia = library.find(item => item.id === media.id);
        if (existingMedia) {
            existingMedia.status = 'finished';
            saveLibrary();
            displayHistory();
        }
    }
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


function getRatingClass(rating) {
    if (rating >= 1 && rating < 4) return 'rating-red';
    if (rating >= 4 && rating < 7) return 'rating-gray';
    if (rating >= 7 && rating <= 10) return 'rating-green';
    return 'rating-default';
}


function renderMediaCard(media, index) {
    const directorOrArtist = media.type === 'movie' || media.type === 'series' ? media.director : media.artist;

    return `
        <div class="media-card" data-type="${media.type}" data-index="${index}" onclick="viewMedia(${index})">
            <h4>${media.title}${media.release_year ? ` (${media.release_year})` : ''}</h4>
            <p class="director-or-artist">${media.type === 'movie' || media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}: ${directorOrArtist || 'Не указано'}</p>
            ${media.seasons ? `<p>Количество сезонов: ${media.seasons}</p>` : ''}
            ${media.rating ? `<div class="rating-box ${getRatingClass(media.rating)}">${media.rating}/10</div>` : ''}
            <div class="options-btn" onclick="toggleOptionsMenu(event, ${index})">
                <span class="dots">...</span>
            </div>
            <div id="options-menu-${index}" class="options-menu">
                <button onclick="openEditModal(${index})">Редактировать</button>
                <button onclick="deleteMedia(${media.id}, event)">Удалить</button>
            </div>
        </div>
    `;
}


function openEditModal(index) {
    const modal = document.getElementById('edit-modal');
    const modalInfo = document.getElementById('edit-modal-info');
    const media = library[index];

    // Определяем текстовые статусы для select
    const statusOptions = media.type === 'music'
        ? `<option value="finished" ${media.status === 'finished' ? 'selected' : ''}>Прослушано</option>
           <option value="in-progress" ${media.status === 'in-progress' ? 'selected' : ''}>В процессе</option>
           <option value="plan" ${media.status === 'plan' ? 'selected' : ''}>Планирую</option>`
        : `<option value="finished" ${media.status === 'finished' ? 'selected' : ''}>Просмотрено</option>
           <option value="in-progress" ${media.status === 'in-progress' ? 'selected' : ''}>В процессе</option>
           <option value="plan" ${media.status === 'plan' ? 'selected' : ''}>Планирую</option>`;

    // Генерируем HTML для редактирования медиа
    modalInfo.innerHTML = `
        <h2>Редактировать: ${media.title}</h2>
        <div class="form-group">
            <label for="edit-title">Название</label>
            <input type="text" id="edit-title" value="${media.title}" required>
        </div>
        <div class="form-group">
            <label for="edit-director-artist">${media.type === 'movie' || media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}</label>
            <input type="text" id="edit-director-artist" value="${media.type === 'music' ? media.artist : media.director || ''}" required>
        </div>
        <div class="form-group">
            <label for="edit-year">Год</label>
            <input type="number" id="edit-year" value="${media.release_year || ''}" required>
        </div>
        ${media.type === 'series' || media.type === 'movie' ? `
            <div class="form-group">
                <label for="edit-country">Страна</label>
                <input type="text" id="edit-country" value="${media.country || ''}">
            </div>` : ''}
        ${media.type === 'series' ? `
            <div class="form-group">
                <label for="edit-seasons">Количество сезонов</label>
                <input type="number" id="edit-seasons" value="${media.seasons || ''}">
            </div>` : ''}
        <div class="form-group">
            <label for="edit-genre">Жанр</label>
            <input type="text" id="edit-genre" value="${media.genre || ''}" required>
        </div>
        <div class="form-group">
            <label for="edit-rating">Рейтинг</label>
            <input type="number" id="edit-rating" step="1" min="1" max="10" value="${media.rating || ''}">
        </div>
        <div class="form-group">
            <label for="edit-review">Рецензия</label>
            <textarea id="edit-review">${media.review || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="edit-status">Статус</label>
            <select id="edit-status" required>
                ${statusOptions}
            </select>
        </div>
    `;

    // Показать модальное окно
    modal.style.display = 'flex';

    document.getElementById('save-btn').onclick = () => {
        if (validateEditForm()) {
            saveMediaChanges(index);
        }
    };
}


function saveMediaChanges(index) {
    const media = library[index];

    const updatedMedia = {
        ...media,
        title: document.getElementById('edit-title').value.trim(),
        review: document.getElementById('edit-review').value.trim() || null,
        director: media.type === 'music' ? null : document.getElementById('edit-director-artist').value.trim() || null,
        artist: media.type === 'music' ? document.getElementById('edit-director-artist').value.trim() || null : null,
        release_year: parseInt(document.getElementById('edit-year').value) || null,
        country: media.type === 'music' ? null : (document.getElementById('edit-country').value.trim() || null),
        genre: document.getElementById('edit-genre').value.trim() || null,
        rating: parseFloat(document.getElementById('edit-rating').value) || null,
        seasons: parseInt(document.getElementById('edit-seasons')?.value) || null,
        status: document.getElementById('edit-status').value,
    };

    fetch(`/api/media/${media.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMedia),
    })
        .then(async (response) => {
            if (response.ok) {
                // Обновляем локальную библиотеку
                library[index] = updatedMedia;

                // Закрываем модальное окно
                closeEditModal();
                closeModal();

                // Проверяем, нужно ли обновить Историю
                if (updatedMedia.status === 'finished') {
                    const isAlreadyInHistory = document.querySelector(`[data-id="${media.id}"]`);
                    if (!isAlreadyInHistory) {
                        addToHistory(updatedMedia);
                    }
                }

                displayKanban();
                displayLibrary();
                displayHistory();
                saveLibrary();

                // Находим карточку по index в DOM и обновляем её
                const mediaCardElement = document.querySelector(`[data-index="${index}"]`);
                if (mediaCardElement) {
                    // Обновляем заголовок
                    const titleElement = mediaCardElement.querySelector('h4');
                    titleElement.textContent = `${updatedMedia.title}${updatedMedia.release_year ? ` (${updatedMedia.release_year})` : ''}`;

                    // Обновляем режиссера/исполнителя
                    const directorOrArtistElement = mediaCardElement.querySelector('.director-or-artist');
                    directorOrArtistElement.textContent =
                        updatedMedia.type === 'movie' || updatedMedia.type === 'series'
                            ? `Режиссёр: ${updatedMedia.director || 'Не указано'}`
                            : `Исполнитель: ${updatedMedia.artist || 'Не указано'}`;

                    // Обновляем рейтинг
                    const ratingBox = mediaCardElement.querySelector('.rating-box');
                    if (ratingBox) {
                        const ratingClass = getRatingClass(updatedMedia.rating);
                        ratingBox.textContent = `${updatedMedia.rating}/10`;
                        ratingBox.className = `rating-box ${ratingClass}`;
                    }

                    // Обновляем страну и жанр
                    const countryElement = mediaCardElement.querySelector('.country');
                    if (countryElement) {
                        countryElement.textContent = updatedMedia.country ? `Страна: ${updatedMedia.country}` : '';
                    }

                    const genreElement = mediaCardElement.querySelector('.genre');
                    if (genreElement) {
                        genreElement.textContent = updatedMedia.genre ? `Жанр: ${updatedMedia.genre}` : '';
                    }

                    // Обновляем количество сезонов (если есть)
                    const seasonsElement = mediaCardElement.querySelector('.seasons');
                    if (seasonsElement) {
                        seasonsElement.textContent = updatedMedia.seasons
                            ? `Количество сезонов: ${updatedMedia.seasons}`
                            : '';
                    }
                } else {
                    console.warn(`Media card not found for index: ${index}`);
                }
            }
            else {
                console.error('Ошибка при сохранении данных:', await response.text());
            }
        })
        .catch((error) => {
            console.error('Ошибка при сохранении данных:', error);
        });
}


function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    displayHistory();
    modal.style.display = 'none';
}


function renderLibrary() {
    const libraryContainer = document.getElementById('library');
    libraryContainer.innerHTML = '';

    library.forEach((media, index) => {
        libraryContainer.innerHTML += renderMediaCard(media, index);
    });
}

async function fetchLibrary() {
    try {
        const response = await fetch('/api/media/all');
        if (response.ok) {
            const { movies, series, music } = await response.json();
            library = [
                ...movies.map(movie => ({ ...movie, type: 'movie' })),
                ...series.map(series => ({ ...series, type: 'series' })),
                ...music.map(music => ({ ...music, type: 'music' }))
            ];
            displayLibrary();
            displayHistory();
            displayKanban();
        } else {
            console.error('Ошибка при обновлении библиотеки:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при обновлении библиотеки:', error);
    }
}


function toggleOptionsMenu(event, index) {
    event.stopPropagation(); // Останавливаем всплытие события
    const menu = document.getElementById(`options-menu-${index}`);
    const allMenus = document.querySelectorAll('.options-menu');

    // Закрываем все открытые меню
    allMenus.forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });

    // Переключаем текущее меню
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}


// Закрытие меню при клике вне карточки
document.addEventListener('click', () => {
    document.querySelectorAll('.options-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});


async function deleteMedia(id, event) {
    event.stopPropagation(); // Остановить всплытие событий
    try {
        const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
        if (response.ok) {
            library = library.filter(media => media.id !== id);
            displayLibrary();
            displayKanban();
            displayHistory();
        } else {
            console.error('Ошибка при удалении медиа:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при удалении медиа:', error);
    }
}


function searchLibrary() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value; // Считываем выбранный способ сортировки
    const libraryContainer = document.getElementById('library');
    const mediaCards = Array.from(libraryContainer.getElementsByClassName('media-card'));

    // Фильтруем карточки по поисковому запросу (по названию, режиссеру или исполнителю)
    let filteredMedia = mediaCards;

    if (query) {
        filteredMedia = mediaCards.filter(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            const directorOrArtist = card.querySelector('.director-or-artist').innerText.toLowerCase();
            return title.includes(query) || directorOrArtist.includes(query);
        });
    }

    // Функция сортировки по алфавиту
    function sortByAlphabet(mediaArray) {
        return mediaArray.sort((a, b) => {
            const titleA = a.querySelector('h4').innerText.toLowerCase();
            const titleB = b.querySelector('h4').innerText.toLowerCase();
            return titleA.localeCompare(titleB); // Сортировка по алфавиту
        });
    }

    // Функция сортировки по рейтингу
    function sortByRating(mediaArray) {
        return mediaArray.sort((a, b) => {
            const ratingA = parseFloat(a.querySelector('.rating-box')?.innerText.split('/')[0] || 0);
            const ratingB = parseFloat(b.querySelector('.rating-box')?.innerText.split('/')[0] || 0);
            return ratingA - ratingB; // Сортировка по рейтингу (по возрастанию)
        });
    }

    // Применяем сортировку в зависимости от выбранного параметра
    let sortedMedia = filteredMedia;
    if (sortBy === 'alphabet-asc') {
        sortedMedia = sortByAlphabet(filteredMedia);
    } else if (sortBy === 'alphabet-desc') {
        sortedMedia = sortByAlphabet(filteredMedia).reverse();
    } else if (sortBy === 'rating-asc') {
        sortedMedia = sortByRating(filteredMedia);
    } else if (sortBy === 'rating-desc') {
        sortedMedia = sortByRating(filteredMedia).reverse();
    }

    // Обновляем карточки в контейнере
    mediaCards.forEach(card => {
        card.style.display = 'none';
    });

    sortedMedia.forEach(card => {
        card.style.display = '';
        libraryContainer.appendChild(card);
    });
}


function validateForm() {
    const requiredFields = document.querySelectorAll('#media-form input[required], #media-form select[required], #media-form textarea[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.remove('input-error');
            void field.offsetWidth;  // Это вызывает перерисовку для анимации тряски
            field.classList.add('input-error');
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.classList.remove('input-error');
        }
    });

    // Проверка рейтинга
    const ratingField = document.getElementById('rating');
    const ratingValue = parseFloat(ratingField.value);
    if (ratingField.value.trim() && (ratingValue < 1 || ratingValue > 10 || isNaN(ratingValue))) {
        ratingField.classList.remove('input-error');
        void ratingField.offsetWidth;  // Тряска поля
        ratingField.classList.add('input-error');
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = ratingField;
        }
    } else {
        ratingField.classList.remove('input-error');
    }

    // Если есть ошибка, скроллим до первого некорректного поля
    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
    }

    return isValid;
}


function validateEditForm() {
    const requiredFields = document.querySelectorAll('#edit-modal input[required], #edit-modal select[required], #edit-modal textarea[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.remove('input-error');
            void field.offsetWidth; // Для анимации тряски
            field.classList.add('input-error');
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.classList.remove('input-error');
        }
    });

    // Проверка рейтинга
    const ratingField = document.getElementById('edit-rating');
    const ratingValue = parseFloat(ratingField.value);
    if (ratingField.value.trim() && (ratingValue < 1 || ratingValue > 10 || isNaN(ratingValue))) {
        ratingField.classList.remove('input-error');
        void ratingField.offsetWidth; // Для тряски поля
        ratingField.classList.add('input-error');
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = ratingField;
        }
    } else {
        ratingField.classList.remove('input-error');
    }

    // Если есть ошибки, скроллим до первого неверного поля
    if (!isValid && firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.focus();
    }

    return isValid;
}


// Функция для сохранения данных в localStorage
function saveLibrary() {
    localStorage.setItem('library', JSON.stringify(library));
    localStorage.setItem('history', document.getElementById('history').innerHTML);
}

// Функция для загрузки данных из localStorage
function loadLibrary() {
    const savedLibrary = localStorage.getItem('library');
    if (savedLibrary) {
        library = JSON.parse(savedLibrary);
    }

    const savedHistory = localStorage.getItem('history');
    if (savedHistory) {
        document.getElementById('history').innerHTML = savedHistory;
    }

    displayLibrary();
    displayKanban();
    displayHistory();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLibrary();
});

window.onload = loadLibrary;

document.getElementById('get-server-info').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/server-info');
        if (!response.ok) throw new Error('Ошибка при получении данных');
        const serverInfo = await response.json();

        const infoDiv = document.getElementById('server-info');
        infoDiv.innerHTML = `
            <h4>Информация о сервере:</h4>
            <p>Платформа: ${serverInfo.platform}</p>
            <p>Архитектура: ${serverInfo.arch}</p>
            <p>Время работы: ${Math.floor(serverInfo.uptime / 60)} минут</p>
            <p>Общая память: ${(serverInfo.totalMemory / (1024 ** 3)).toFixed(2)} ГБ</p>
            <p>Свободная память: ${(serverInfo.freeMemory / (1024 ** 3)).toFixed(2)} ГБ</p>
            <p>Процессоры: ${serverInfo.cpus.join(', ')}</p>
        `;
    } catch (error) {
        console.error(error);
        alert('Не удалось получить информацию о сервере');
    }
});
