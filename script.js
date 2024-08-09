document.addEventListener('DOMContentLoaded', function() {
    const photoElement = document.getElementById('photo');
    const photographerElement = document.getElementById('photographer');
    const likeButton = document.getElementById('like-button');
    const likeCounterElement = document.getElementById('like-counter');
    const historyContainer = document.getElementById('history-container');

    const UNSPLASH_ACCESS_KEY = "SsouAe4cCfdNK8UKFQz4a_n-VSxFOfioTQ0zHLlwryA";
    const unsplashApiUrl = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`;

    let likeCount = 0;

    // Получение случайного изображения с Unsplash
    async function fetchRandomPhoto() {
        try {
            const response = await fetch(unsplashApiUrl);
            const data = await response.json();
            const photoUrl = data.urls.regular;
            const photographerName = data.user.name;
            const photoLink = data.links.html;

            // Отображение изображения и информации о фотографе
            photoElement.src = photoUrl;
            photographerElement.innerHTML = `Фото от <a href="${photoLink}" target="_blank">${photographerName}</a>`;
            
            // Сохранение изображения в историю просмотров
            saveToHistory(photoUrl, photographerName, photoLink);
            displayHistory();
        } catch (error) {
            console.error('Ошибка получения изображения:', error);
        }
    }

    // Сохранение количества лайков в локальное хранилище
    function updateLikeCounter() {
        likeCounterElement.textContent = `Лайков: ${likeCount}`;
        localStorage.setItem('likeCount', likeCount);
    }

    // Загрузка количества лайков из локального хранилища
    function loadLikeCounter() {
        const savedLikeCount = localStorage.getItem('likeCount');
        if (savedLikeCount) {
            likeCount = parseInt(savedLikeCount);
            updateLikeCounter();
        }
    }

    // Обработка клика по кнопке "лайк"
    likeButton.addEventListener('click', function() {
        likeCount++;
        updateLikeCounter();
    });

    // Сохранение истории просмотров
    function saveToHistory(photoUrl, photographerName, photoLink) {
        const history = JSON.parse(localStorage.getItem('photoHistory')) || [];
        history.push({ photoUrl, photographerName, photoLink });
        localStorage.setItem('photoHistory', JSON.stringify(history));
    }

    // Отображение истории просмотров
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('photoHistory')) || [];
        historyContainer.innerHTML = '';
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.photoUrl}" alt="Previous photo" style="max-width: 100%;">
                <p>Фото от <a href="${item.photoLink}" target="_blank">${item.photographerName}</a></p>
            `;
            historyContainer.appendChild(historyItem);
        });
    }

    // Загрузка страницы
    loadLikeCounter();
    fetchRandomPhoto();
    displayHistory();
});
