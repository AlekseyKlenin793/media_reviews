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
    0
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
        <div class="form-group">
            <label for="year">Год выпуска</label>
            <input type="number" id="year" placeholder="Введите год" min="1900" max="2100" required>
        </div>
        ${mediaType === 'series' ? `
            <div class="form-group">
                <label for="seasons">Количество сезонов</label>
                <input type="number" id="seasons" placeholder="Введите количество сезонов" min="1" required>
            </div>
        ` : ''}
        <div class="form-group">
            <label for="review">Рецензия</label>
            <textarea id="review" placeholder="Введите рецензию (по желанию)" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label for="status">Статус</label>
            <select id="status" required>
                <option value="plan">Планирую</option>
                <option value="in-progress">В процессе</option>
                <option value="finished">${mediaType === "music" ? "Прослушано" : "Просмотрено"}</option>
            </select>
        </div>
    `;

    mediaForm.innerHTML = formContent;
    mediaForm.style.display = 'flex';
    mediaForm.style.flexDirection = 'column';
    mediaForm.style.gap = '10px';
}

// Функция для добавления медиа в библиотеку
function addMedia() {
    if (!validateForm()) {
        showMessage('Пожалуйста, заполните все обязательные поля.');
        return;
    }

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

    library.push(newMedia);

    if (status === 'finished') {
        addToHistory(newMedia);
    }

    saveLibrary();

    displayHistory();
    displayLibrary();
    displayKanban();

    clearForm(mediaType);

    showMessage('Медиа успешно добавлено!', 'success');

    // Очищаем поля формы, сохраняем тип
    const mediaTypeElement = document.getElementById('media-type');
    const selectedType = mediaTypeElement.value;
    document.getElementById('media-form').innerHTML = '';
    mediaTypeElement.value = selectedType;
    showForm();
}


function clearForm(mediaType) {
    const mediaForm = document.getElementById('media-form');
    mediaForm.innerHTML = ''; // Очищаем текущую форму
    document.getElementById('media-type').value = mediaType; // Сохраняем выбранный тип медиа
    showForm(); // Перестраиваем форму для сохранённого типа
}


function addToHistory(media) {
    if (media.status === 'finished') {
        const historyContainer = document.getElementById('history');
        const historyCard = document.createElement('div');
        historyCard.classList.add('media-card');
        historyCard.innerHTML = `
            <h4>${media.title}</h4>
            <p>${media.type === 'movie' || media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}: ${media.director || media.artist}</p>
            ${media.year ? `<p>Год: ${media.year}</p>` : ''}
            ${media.seasons ? `<p>Количество сезонов: ${media.seasons}</p>` : ''}
            <p>Рецензия: ${media.review || 'Нет рецензии'}</p>
        `;

        historyContainer.appendChild(historyCard);
    }
}


function displayLibrary() {
    const libraryContainer = document.getElementById('library');
    libraryContainer.innerHTML = '';

    library.forEach((media, index) => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.innerHTML = `
            <h4>${media.title}</h4>
            <p>${media.type === 'movie' ? 'Режиссёр' : media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}: ${media.director || media.artist}</p>
            <span class="options-icon" onclick="toggleOptionsMenu(event, ${index})">⋮</span>
            <div class="options-menu" id="options-menu-${index}">
                <button onclick="editMedia(${index})">Редактировать</button>
                <button onclick="deleteMedia(${index}, event)">Удалить</button>
            </div>
        `;


        // Открытие модального окна при клике на карточку
        mediaCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('options-icon')) {
                viewMedia(index);
            }
        });

        libraryContainer.appendChild(mediaCard);
    });
}

function toggleOptionsMenu(event, index) {
    event.stopPropagation(); // Останавливаем всплытие, чтобы не срабатывал просмотр карточки
    const menu = document.getElementById(`options-menu-${index}`);
    const allMenus = document.querySelectorAll('.options-menu');

    // Скрываем все открытые меню
    allMenus.forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });

    // Переключаем текущее меню
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Закрытие меню при клике вне карточки
document.addEventListener('click', () => {
    document.querySelectorAll('.options-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});


function displayHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = ''; // Очищаем контейнер перед повторным заполнением

    library.forEach(media => {
        if (media.status === 'finished') { // Показываем только завершённые медиа
            const historyCard = document.createElement('div');
            historyCard.classList.add('media-card');
            historyCard.innerHTML = `
                <h4>${media.title}</h4>
                <p>${media.type === 'movie' || media.type === 'series' ? 'Режиссёр' : 'Исполнитель'}: ${media.director || media.artist}</p>
                ${media.year ? `<p>Год: ${media.year}</p>` : ''}
                ${media.seasons ? `<p>Количество сезонов: ${media.seasons}</p>` : ''}
                <p>Рецензия: ${media.review || 'Нет рецензии'}</p>
            `;

            historyContainer.appendChild(historyCard);
        }
    });
}


// Функция для удаления медиа из библиотеки
function deleteMedia(index, event) {
    event.stopPropagation(); // Остановить всплытие событий
    library.splice(index, 1);
    saveLibrary();
    displayLibrary();
    displayKanban();
    displayHistory();
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

function searchLibrary() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const libraryContainer = document.getElementById('library');
    const mediaCards = libraryContainer.getElementsByClassName('media-card');

    for (let card of mediaCards) {
        const title = card.querySelector('h4').innerText.toLowerCase();
        card.style.display = title.includes(query) ? '' : 'none';
    }
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


function validateForm() {
    const requiredFields = document.querySelectorAll('#media-form input[required], #media-form select[required], #media-form textarea[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            // Удаляем и снова добавляем класс для повторной анимации
            field.classList.remove('input-error');
            void field.offsetWidth; // Триггер перерисовки элемента
            field.classList.add('input-error');
            isValid = false;

            // Запоминаем первое незаполненное поле
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.classList.remove('input-error');
        }
    });

    if (!isValid) {
        showMessage('Заполните все обязательные поля!', 'error');

        // Скроллим к первому незаполненному полю
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus(); // Фокусируем поле для удобства ввода
        }
    }

    return isValid;
}


// Функция для показа всплывающего сообщения
function showMessage(message, type) {
    // Убираем предыдущее сообщение, если оно есть
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Создаём новое сообщение
    const messageBox = document.createElement('div');
    messageBox.className = `form-message ${type}`;
    messageBox.innerText = message;

    document.body.appendChild(messageBox);

    // Показываем сообщение
    setTimeout(() => messageBox.classList.add('show'), 50);

    // Убираем сообщение через 3 секунды
    setTimeout(() => {
        messageBox.classList.remove('show');
        setTimeout(() => messageBox.remove(), 500); // Удаляем из DOM
    }, 3000);
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

window.onload = loadLibrary;
