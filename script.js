const gasURL = "https://script.google.com/macros/s/AKfycbyxhETGvMWEiFfHP6FRzxxtwtwHUTNqwBLOEv47aObKVYNXsYTuD5WLUvj-D1Il4uhv/exec"

const board = document.getElementById("board")
const keyboardContainer = document.getElementById("keyboard")
const message = document.getElementById("message")

const modalWindow = document.getElementById("myModal")
const modalContent = document.getElementsByClassName('modal-content')
const modalHead = document.getElementById("modal-head")
const modalInfo = document.getElementById("modal-info")
const closeBtn = document.querySelector(".close")

const statBtn = document.querySelector('[aria-label="stat"]')
statBtn.addEventListener("click", showStat)

// Русская раскладка клавиатуры (3 ряда)
const keyboardLayout = [
  "ЙЦУКЕНГШЩЗХЪ".split(""), // Верхний ряд
  "ФЫВАПРОЛДЖЭ".split(""),  // Средний ряд
  ["⌫", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Enter"], // Нижний ряд
]

let listWord

//Переменные для игрового поля
let currentAttempt = 0; // Текущая попытка
let currentGuess = ""; // Слово, которое вводится
let targetWord = ""; // Загаданное 
let maxWordLength;
const attempts = 6; // Количество попыток

// Создание клетки с анимацией переворота
function createCell() {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  // Контейнер для передней и задней стороны
  const inner = document.createElement("div");
  inner.classList.add("cell-inner");

  // Передняя сторона карточки
  const front = document.createElement("div");
  front.classList.add("cell-front");
  inner.appendChild(front);

  // Задняя сторона карточки
  const back = document.createElement("div");
  back.classList.add("cell-back");
  inner.appendChild(back);

  // Вставляем контейнер внутрь карточки
  cell.appendChild(inner);

  return cell;
}

//-----------------------------------------------------------------------------------------------------------------
// Загружаем слово из словаря

document.addEventListener('DOMContentLoaded', async () => {

  // Показать сообщение о загрузке
  modalHead.textContent = 'Загрузка...'
  modalInfo.textContent = 'Получаем информацию'
  modalWindow.style.display = 'block';

  try {
      // Отправка GET-запроса и ожидание ответа
      const response = await fetch(gasURL);
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      
      const data = await response.json();

      // Получение ответа от сервера
      modalWindow.style.display = 'none';

      // Присвоение содержимого переменной target
      targetWord = data.word.toLowerCase();
      listWord = data.allWords;
      maxWordLength = targetWord.length; // Длина слова
      console.log('Target:', targetWord);
    
      createBoard();
      loadGame();
      generateKeyboard();

  } catch (error) {
    // Скрыть сообщение о загрузке и показать сообщение об ошибке
    console.error('Ошибка:', error);
    modalHead.textContent = 'Ошибка'
    modalInfo.textContent = 'Произошла ошибка при загрузке данных.';
  }
});

//-----------------------------------------------------------------------------------------------------------------
// Создаем игровое поле

function createBoard() {
  for (let i = 0; i < attempts; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < maxWordLength; j++) {
      const cell = createCell();
      row.appendChild(cell);
    }

    board.appendChild(row);
  }
}

//-----------------------------------------------------------------------------------------------------------------
// Загружаем статистику игрока

async function loadGame() {
  console.log("Загрузка статистики...");
  const stats = JSON.parse(localStorage.getItem("gameStats")) || {
    wins: 0,
    losses: 0,
    todayWord: "",
    attempts: [],
  };

  console.log(stats);

  // Проверяем, совпадает ли targetWord с сохранённым todayWord
  if (
    stats.todayWord.toUpperCase() === targetWord.toUpperCase() &&
    stats.attempts &&
    stats.attempts.length > 0
  ) {
    console.log("Игра уже началась. Загружаем состояние...");
    
    board.classList.add("disabled"); // Блокируем игровое 
    keyboardContainer.classList.add("disabled")
    modalHead.textContent = "Игра завершена.";
    modalInfo.innerHTML = "На сегодня все<br>Приходите завтра";
    modalWindow.style.display = "block";
    
    // Восстанавливаем попытки по порядку
    for (let attemptIndex = 0; attemptIndex < stats.attempts.length; attemptIndex++) {
      const attempt = stats.attempts[attemptIndex];
      const row = board.children[attemptIndex];

      for (let letterIndex = 0; letterIndex < attempt.guess.length; letterIndex++) {
        const letter = attempt.guess[letterIndex];
        const cell = row.children[letterIndex];
        const inner = cell.querySelector(".cell-inner");
        const back = cell.querySelector(".cell-back");

        back.textContent = letter.toUpperCase();

        // Добавляем класс с анимацией переворота
        await new Promise((resolve) => {
          setTimeout(() => {
            back.classList.add(attempt.feedback[letterIndex]);
            inner.classList.add("flip");
            resolve();
          }, 200); // Задержка для анимации
        });
      }

      // Обновляем клавиатуру после обработки ряда
      attempt.guess.split("").forEach((letter, letterIndex) => {
        const keys = document.querySelectorAll(".key");
        const key = Array.from(keys).find(
          (k) => k.dataset.letter === letter.toUpperCase()
        );

        if (key) {
          // Обновляем цвет кнопки в зависимости от 
          key.classList.remove("absent", "present")
          key.classList.add("used")
          key.classList.add(attempt.feedback[letterIndex]);
        }
      });

      // Задержка между рядами
      await new Promise((resolve) => setTimeout(resolve, 200)); // Задержка перед следующим рядом
    }

  } else {
    console.log(`Старт игры ${new Date(Date.now())}`);
  }
}

//-----------------------------------------------------------------------------------------------------------------
// Генерация экранной клавиатуры

function generateKeyboard() {
  keyboardLayout.forEach((rowLetters, rowIndex) => {
    const row = document.createElement("div");
    row.classList.add("keyboard-row");

    rowLetters.forEach((letter) => {
      if(letter === "⌫") {
        const backspaceKey = document.createElement("div");
        backspaceKey.classList.add("key", "special-key");
        backspaceKey.dataset.action = "Backspace";
        backspaceKey.addEventListener("click", handleBackspace);
        const backImg = document.createElement("img")
        backImg.setAttribute("src", "icon/backspace.svg")
        backspaceKey.appendChild(backImg)
        row.appendChild(backspaceKey);
      } else if(letter === "Enter") {
        const enterKey = document.createElement("div");
        enterKey.classList.add("key", "special-key");
        enterKey.dataset.action = "Enter";
        enterKey.addEventListener("click", checkGuess);
        const enterImg = document.createElement("img")
        enterImg.setAttribute("src", "icon/enter.svg")
        enterKey.appendChild(enterImg)
        row.appendChild(enterKey);
      } else {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = letter;
        key.dataset.letter = letter;
        key.addEventListener("click", () => handleKeyPress(letter));
        row.appendChild(key);
      }
    });
    keyboardContainer.appendChild(row);
  });
}

//-----------------------------------------------------------------------------------------------------------------
// Обработка нажатия клавиши

function handleKeyPress(letter) {
  if (currentGuess.length < maxWordLength) {
    const row = board.children[currentAttempt];
    const cell = row.children[currentGuess.length];

    const front = cell.querySelector(".cell-front");
    const back = cell.querySelector(".cell-back");

    // Добавляем букву на переднюю сторону (для визуального эффекта до переворота)
    front.textContent = letter.toUpperCase();

    // Добавляем букву в заднюю сторону (для отображения после переворота)
    //back.textContent = letter.toUpperCase();

    // Обновляем текущую попытку
    currentGuess += letter.toLowerCase();
    //console.log(currentGuess)
  }
}

//-----------------------------------------------------------------------------------------------------------------
// Обработка удаления буквы

function handleBackspace() {
  if (currentGuess.length > 0) {
    const row = board.children[currentAttempt];
    const cell = row.children[currentGuess.length - 1];

    // Сбрасываем содержимое передней и задней сторон
    const front = cell.querySelector(".cell-front");
    const back = cell.querySelector(".cell-back");

    if (front && back) {
      front.textContent = ""; // Очищаем текст на передней стороне
      back.textContent = ""; // Очищаем текст на задней стороне
    }
    
    // Убираем последнюю букву из текущей догадки
    currentGuess = currentGuess.slice(0, -1);
  }
}

//-----------------------------------------------------------------------------------------------------------------
// Проверка текущей попытки

function checkGuess() {
  if (currentGuess.length !== maxWordLength) {
    modalHead.textContent = 'Не хватает букв'
    modalInfo.textContent = "Введите полное слово!";
    modalWindow.style.display = 'block';
    return;
  }

  if (!listWord.includes(currentGuess.toUpperCase())) {
    modalHead.textContent = 'Нет такого слова'
    modalInfo.textContent = "В нашем словаре";
    modalWindow.style.display = 'block';
    return
    
  } else {

    const feedback = [];
    const targetWordArray = targetWord.split(""); // Массив из символов 
    const guessedLettersUsed = Array(maxWordLength).fill(false); // Флаги использованных букв
    
    // Первая проверка: буквы на правильных местах
    for (let i = 0; i < maxWordLength; i++) {
      if (currentGuess[i].toLowerCase() === targetWord[i]) {
        feedback[i] = "correct";
        guessedLettersUsed[i] = true; // Помечаем букву как использованную
      }
    }

    // Вторая проверка: буквы, присутствующие в слове, но не на своем месте
    for (let i = 0; i < maxWordLength; i++) {
      if (!feedback[i]) { // Если не "correct"
        const charIndex = targetWordArray.findIndex(
          (char, index) => char === currentGuess[i] && !guessedLettersUsed[index]
        );
        if (charIndex !== -1) {
          feedback[i] = "present";
          guessedLettersUsed[charIndex] = true; // Помечаем эту букву как использованную
        } else {
          feedback[i] = "absent";
        }
      }
    }

    // Обновление строки и клавиатуры
    updateRow(feedback);
    updateKeyboard(feedback);

    // После завершения анимации
    const row = board.children[currentAttempt];
    const cells = row.querySelectorAll(".cell");

    let finishedAnimations = 0;
    cells.forEach((cell, i) => {
      const inner = cell.querySelector(".cell-inner");
      inner.addEventListener(
        "transitionend",
        () => {
          finishedAnimations++;
          if (finishedAnimations === maxWordLength) {
            if (currentGuess === targetWord) {
              // Показ модального окна после анимации
              console.log(`Конец игры ${new Date(Date.now())}`)
              saveAttempt(currentGuess, feedback);
              modalHead.textContent = "Поздравляем!";
              modalInfo.textContent = "Вы угадали слово";
              modalWindow.style.display = "block";
              launchFireworks();
              updateGameStats(true, targetWord);
              return;
            }

            if (currentAttempt === attempts - 1) {
              console.log(`Конец игры ${new Date(Date.now())}`)
              saveAttempt(currentGuess, feedback);
              modalHead.textContent = "Вы проиграли!";
              modalInfo.textContent = `Слово было: ${targetWord}`;
              modalWindow.style.display = "block";
              updateGameStats(false, targetWord);
              return;
            }

            // Переход к следующей попытке
            saveAttempt(currentGuess, feedback)
            currentAttempt++
            currentGuess = ""
          }
        },
        { once: true } // Срабатывает только один раз для каждой ячейки
      );
    });
  }
}

//-----------------------------------------------------------------------------------------------------------------
// Обновление игрового поля

function updateRow(feedback) {
  const row = board.children[currentAttempt];
  
  feedback.forEach((status, i) => {
    const cell = row.children[i];
    const inner = cell.querySelector(".cell-inner");
    const back = cell.querySelector(".cell-back");
    const front = cell.querySelector(".cell-front")

    // Устанавливаем текст на задней стороне карточки
    back.textContent = currentGuess[i].toUpperCase();

    // Добавляем класс анимации
    setTimeout(() => {
      inner.classList.add("flip");
      back.classList.add(status);
      

      // После завершения анимации переворота, добавляем статус
      inner.addEventListener("transitionend", () => {
        front.style.display = 'none';
      }, { once: true });
    }, i * 300); // Добавляем задержку для последовательного переворота
  });
}

//-----------------------------------------------------------------------------------------------------------------
// Обновление клавиатуры с подсветкой

function updateKeyboard(feedback) {
  const keys = document.querySelectorAll(".key");

  currentGuess.split("").forEach((letter, index) => {
    setTimeout(() => {
      const key = Array.from(keys).find((k) => k.dataset.letter === letter.toUpperCase());
      if (key) {
        if (feedback[index] === "correct") {
          key.className = "key"; // Убираем предыдущие классы
          key.classList.add("correct");
        } else if (feedback[index] === "present") {
          key.classList.add("present");
        } else {
          key.classList.add("used");
        }
      }
    }, index * 300); // Задержка в 300 мс для синхронизации с updateRow
  });
}


//-----------------------------------------------------------------------------------------------------------------
// Обработка ввода с клавиатуры

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkGuess();
  } else if (e.key === "Backspace") {
    handleBackspace();
  } else if (/^[а-яёА-ЯЁ]$/.test(e.key)) {
    handleKeyPress(e.key.toUpperCase());
  }
});

//-----------------------------------------------------------------------------------------------------------------
// Функция для закрытия модального окна
function closeModal() {
  modalWindow.style.display = "none";
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