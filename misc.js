async function hello() {
  return new Promise((resolve) => {
  modalInfo.textContent = ""
  const labelInfo = document.createElement("label")
  labelInfo.setAttribute("for", "userName");
  labelInfo.textContent = "Напишите ваше имя:";
  
  const nameField = document.createElement("input")
  nameField.type = "text";
  nameField.id = "userName";
  nameField.name = "userName";
  nameField.placeholder = "Имя";
  
  const nameSend = document.createElement("button")
  nameSend.id = "submitButton";
  nameSend.textContent = "Отправить";

  function submitName() {
    const userName = nameField.value.trim();
    const nameRegex = /^[a-zA-Zа-яА-Я]+$/;
    if (!userName || !nameRegex.test(userName)) {
      alert("Пожалуйста, введите корректное имя! Имя должно состоять только из букв и не содержать спецсимволов или цифр.");
      return;
    }
    
    closeModal();
    console.log("Имя пользователя:", userName);
    const stat = loadStat();
    stat.user = userName;
    gameHead.textContent = userName;
    localStorage.setItem("gameStats", JSON.stringify(stat));
    
    // Дополнительно: выполнить действия с именем
    gameHead.textContent = userName
    resolve(); // Разрешение промиса после ввода имени
  }
  
  nameSend.addEventListener("click", submitName)
  nameField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      submitName();
    }
  });

  modalHead.textContent = "Приветствую"
  
  modalInfo.appendChild(labelInfo)
  modalInfo.appendChild(nameField)
  modalInfo.appendChild(nameSend)
  modalWindow.style.display = "block"
});
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