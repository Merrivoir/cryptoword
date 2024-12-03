function getCurrentFormattedDate() {
    const now = new Date();
  
    // Получаем компоненты даты и времени
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = now.getFullYear();
  
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
  
    // Формируем строку в нужном формате
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

//-----------------------------------------------------------------------------------------------------------------
// Отключение клавиатуры
function disableKeyboardEvents() {
    document.addEventListener('keydown', function(event) {
      event.preventDefault(); // Предотвращает стандартное поведение
      event.stopImmediatePropagation(); // Предотвращает дальнейшее распространение события
    }, true); // Параметр true указывает на фазу захвата
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа статистики
function showStat() {
    const stats = loadStat()
    const count = document.createElement('span');
    count.classList.add("wal");
    count.textContent = `Ваш результат: (в разработке) побед`; // Добавляем текст

    modalHead.textContent = 'Ваша статистика';

    modalInfo.innerHTML = ''; // Очистка старого содержимого, если необходимо
    modalInfo.appendChild(count);

    modalWindow.style.display = 'block';
  }

//-----------------------------------------------------------------------------------------------------------------
// Функция для анализа статистики
function dataAnalysis() {
  return loadStat()
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа заглушки
function showBlank() {
  modalHead.textContent = 'Упс...';
  modalInfo.textContent = 'Это еще разрабатывается'; // Очистка старого содержимого, если необходимо;
  modalWindow.style.display = 'block';
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для закрытия модального окна
function closeModal() {
    modalWindow.style.display = "none";
}

// Кнопки в разработке
rulesBtn.addEventListener("click", showBlank)
settingsBtn.addEventListener("click", showBlank)
newBtn.addEventListener("click", showBlank)


// Показать статистику
statBtn.addEventListener("click", showStat)
  
// Закрытие по клику на крестик
closeBtn.addEventListener("click", closeModal);
  
// Закрытие по клику на свободное пространство
window.addEventListener("click", (event) => {
    if (event.target === modalWindow) {
        closeModal();
    }
});
  
// Закрытие по нажатию клавиши Escape
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Esc") { // Проверка на клавишу Escape
        closeModal();
    }
});
  
//-----------------------------------------------------------------------------------------------------------------
//праздничный фейерверк
  
function createFirework(x, y) {
    const fireworkContainer = document.getElementById("fireworks-container");
  
    for (let i = 0; i < 20; i++) { // 20 частиц в одном фейерверке
        const firework = document.createElement("div");
        firework.classList.add("firework");
  
        // Случайные направления для частиц
        const dx = Math.random() * 2 - 1; // От -1 до 1
        const dy = Math.random() * 2 - 1; // От -1 до 1
  
        // Установка позиций и направления частиц
        firework.style.setProperty("--dx", dx);
        firework.style.setProperty("--dy", dy);
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
  
        fireworkContainer.appendChild(firework);
  
        // Удаление частицы после завершения анимации
        firework.addEventListener("animationend", () => {
            firework.remove();
        });
    }
}
  
  function launchFireworks() {
    // Генерация фейерверков в случайных местах
    for (let i = 0; i < attempts - currentAttempt; i++) { // Количество фейерверков
      setTimeout(() => {
        const x = Math.random() * window.innerWidth; // Случайная позиция X
        const y = Math.random() * window.innerHeight / 2; // Случайная позиция Y (верхняя половина экрана)
        createFirework(x, y);
      }, i * 500); // Задержка между фейерверками
    }
  }