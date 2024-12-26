async function hello() {
  return new Promise((resolve) => {
  modalInfo.textContent = ""
  const labelInfo = document.createElement("label")
  labelInfo.setAttribute("for", "userName");
  labelInfo.textContent = "Напишите ваш ник в Telegram:";
  
  const nameField = document.createElement("input")
  nameField.type = "text";
  nameField.id = "userName";
  nameField.name = "userName";
  nameField.placeholder = "Имя пользователя";
  
  const nameSend = document.createElement("button")
  nameSend.id = "submitButton";
  nameSend.textContent = "Отправить";

  function submitName() {
    const userName = nameField.value.trim();
    const nameRegex = /^[0-9a-zA-Zа-яА-Я_]{3,}$/;

    if (!userName || !nameRegex.test(userName)) {
      alert("Одно слово и оно должно состоять только из букв или цифр и не содержать спецсимволов");
    } else {
    
    closeModal();
    console.log("Имя пользователя:", userName);
    gameHead.textContent = userName;

    const stats = loadStat();
    console.log("Загрузка из локального хранилища")
    console.log(stats.user)

    stats.user = userName;

    localStorage.setItem("gameStats", JSON.stringify(stats));
    
    // Дополнительно: выполнить действия с именем
    gameHead.textContent = userName
    resolve(); // Разрешение промиса после ввода имени
    }
  }
  
  nameSend.addEventListener("click", submitName)
  nameField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      submitName();
    }
  });

  modalHead.innerHTML = "Добро пожаловать<br>в игру<br>CryptoWord"
  
  modalInfo.appendChild(labelInfo)
  modalInfo.appendChild(nameField)
  modalInfo.appendChild(nameSend)
  modalWindow.style.display = "block"
});
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа статистики
function showStat() {
    const stats = calculateStats(loadStat())
    const count = document.createElement('span');
    count.classList.add("wal");
    count.innerHTML = `<span class="wstat">Побед: ${stats.wins}</span><span class="lstat">Поражений: ${stats.losses}</span><span class="attstat">Среднее количество попыток: ${stats.averageAttemptsForWins}</span><span class="atimestat">Средняя длительность попытки: ${stats.averageAttemptTime} сек</span>`; // Добавляем текст

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
// Функция для показа подсказки

function showHint() {

  const hintsShown = JSON.parse(localStorage.getItem("hintsShown")) || {};
  const stat = loadStat()
  
  // Проверяем, была ли подсказка уже показана для текущего слова
  if (hintsShown[targetWord]) {
    modalHead.textContent = 'Подсказка'
    modalInfo.innerHTML = `Вы уже использовали подсказку для этого слова`;
    modalWindow.style.display = 'block';
    return;
  }

  if (stat.hintcount < 1) {
    modalHead.textContent = 'Подсказка'
    modalInfo.innerHTML = `Вы уже использовали все подсказки`;
    modalWindow.style.display = 'block';
    return;    
  }
  
  // Если подсказка ещё не показывалась, показываем её
  stat.hintcount--
  modalHead.textContent = 'Подсказка'
  modalInfo.innerHTML = `${hint.toUpperCase()}<br>Оставшихся подсказок: ${stat.hintcount}`;
  modalWindow.style.display = 'block';
  
  // Сохраняем информацию о том, что подсказка показана
  hintsShown[targetWord] = true;

  localStorage.setItem("hintsShown", JSON.stringify(hintsShown))
  localStorage.setItem("gameStats", JSON.stringify(stat))
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для закрытия модального окна
function closeModal() {
    modalWindow.style.display = "none";
    enableKeyboardEvents()
}
  
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
// Кнопки в разработке
rulesBtn.addEventListener("click", showHint)
settingsBtn.addEventListener("click", showBlank)
newBtn.addEventListener("click", showAddWord)

// Показать статистику
statBtn.addEventListener("click", showStat)
  
//-----------------------------------------------------------------------------------------------------------------
//праздничный фейерверк
  
function createFirework(x, y) {
    const fireworkContainer = document.getElementById("fireworks-container");
  
    for (let i = 0; i < 40; i++) { // 20 частиц в одном фейерверке
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

//-----------------------------------------------------------------------------------------------------------------
//Таймер до следующего слова 

function updateCountdown() {
  const now = new Date(); // Текущее локальное время
  const nextUpdate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), -5, 13, 0, 0)); // Устанавливаем 01:00 UTC

  if (now > nextUpdate) {
    // Если текущее время уже прошло -5: +13 UTC, устанавливаем следующий день
    nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1);
  }

  const diffMilliseconds = nextUpdate - now; // Разница в миллисекундах

  const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);

  // Форматируем часы, минуты и секунды с ведущими нулями
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if(document.getElementById('timer')) { // Обновляем содержимое элемента с ID countdown
    document.getElementById('endgame').textContent = "Следующее слово через:"
    document.getElementById('timer').textContent = formattedTime
    //console.log(formattedTime)
  }
}

//-----------------------------------------------------------------------------------------------------------------
// Анимация загрузки

function showLoad() {
  modalHead.textContent = 'Загрузка'
  modalInfo.innerHTML = '<div class="ld loader"><div class="ld bar1"></div><div class="ld bar2"></div><div class="ld bar3"></div><div class="ld bar4"></div><div class="ld bar5"></div><div class="ld bar6"></div><div class="ld bar7"></div>'
  modalWindow.style.display = 'block';
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа таймера

function showTimer() {
  modalHead.textContent = "Игра завершена";
  modalInfo.innerHTML = `<span id = "endgame"></span><span id = "timer"></span>`
  setInterval(updateCountdown, 1000);
  modalWindow.style.display = "block";
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа добавления слова

async function showAddWord() {
  disableKeyboardEvents()
  return new Promise((resolve) => {
    modalInfo.textContent = ""
    const labelInfo = document.createElement("label")
    labelInfo.setAttribute("for", "userName");
    labelInfo.textContent = "Загадайте слово для друга";
    
    const wordField = document.createElement("input")
    wordField.type = "text";
    wordField.id = "word";
    wordField.name = "word";
    wordField.placeholder = "Напишите слово";
    
    const wordSend = document.createElement("button")
    wordSend.id = "submitButton";
    wordSend.textContent = "Загадать";

    async function submitWord() {
      const word = wordField.value.trim();
      const wordRegex = /^[а-яА-Я]{4,8}$/;
      if (!word || !wordRegex.test(word)) {
        alert("Словод должно быть на русском языке, от 4 до 8 букв");
        return;
      }
      showLoad()
      try {
        // Отправка GET-запроса
        const response = await fetch(`${gasURL}?word=${encodeURIComponent(word)}`);
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.statusText}`);
        }

        const result = await response.json(); // Ожидание ответа сервера
        console.log("Ответ сервера:", result.idWord);

        closeModal();
        showFriend(word, result.idWord);
        resolve(); // Разрешение промиса после получения ответа

      } catch (error) {
        showAlert("Произошла ошибка или такого слова нет в словаре. Проверьте и попробуйте еще раз.");
        console.error("Ошибка:", error);
      }
    }

    wordSend.addEventListener("click", submitWord)
    wordField.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        submitWord();
      }
    });

    modalHead.innerHTML = "CryptoWord"
    
    modalInfo.appendChild(labelInfo)
    modalInfo.appendChild(wordField)
    modalInfo.appendChild(wordSend)
    modalWindow.style.display = "block"
    wordField.focus()
  })
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа ссылки

function showFriend(word, id) {
  modalHead.textContent = "Поделитесь ссылкой";
  modalInfo.innerHTML = `<span class = "friend">Вы загадали слово: ${word.toUpperCase()}</span><span class = "link"><a href="https://merrivoir.github.io/cryptoword?ls=${id}">merrivoir.github.io/cryptoword?ls=${id}</a></span>`
  modalWindow.style.display = "block";
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа ссылки

function showAlert(text) {
  modalHead.textContent = "Ошибка";
  modalInfo.innerHTML = `<span class = "alert">${text}</span>`
  modalWindow.style.display = "block";
}

//-----------------------------------------------------------------------------------------------------------------
// Функция для показа ссылки

function gamePause(off = true) {
  if(off) {
    board.classList.add("disabled"); 
    keyboardContainer.classList.add("disabled");
  } else {
    board.classList.remove("disabled"); 
    keyboardContainer.classList.remove("disabled");  
  }
}
