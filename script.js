const gasURL = "https://script.google.com/macros/s/AKfycbyxhETGvMWEiFfHP6FRzxxtwtwHUTNqwBLOEv47aObKVYNXsYTuD5WLUvj-D1Il4uhv/exec"

const board = document.getElementById("board");
const keyboardContainer = document.getElementById("keyboard");
const message = document.getElementById("message");
const modalWindow = document.getElementById("myModal");
const modalHead = document.getElementById("modal-head");
const modalInfo = document.getElementById("modal-info");
const closeBtn = document.querySelector(".close");
let listWord;
let isWordPresent;
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
// праздничный фейерверк
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

// ожидание загрузки слова из словаря
document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    const serverResponse = document.getElementById('server-response');

    // Показать сообщение о загрузке
    modalHead.textContent = 'Загрузка...'
    modalWindow.style.display = 'block';

    // URL вашего веб-приложения Google Apps Script
    const url = gasURL;

    try {
        // Отправка GET-запроса и ожидание ответа
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        const data = await response.json();

        // Получение ответа от сервера
        modalWindow.style.display = 'none';

        // Присвоение содержимого переменной target
        targetWord = data.randomValue.toLowerCase();
        listWord = data.list;
        isWordPresent = listWord.some(subArray => subArray.includes(targetWord.toUpperCase()));
        maxWordLength = targetWord.length; // Длина слова
        console.log('Target:', targetWord);
        console.log('JOK:', isWordPresent);
      
        createBoard();

    } catch (error) {
        console.error('Ошибка:', error);
        serverResponse.textContent = 'Произошла ошибка при загрузке данных.';

        // Скрыть сообщение о загрузке и показать сообщение об ошибке
        loading.style.display = 'none';
        content.style.display = 'block';
    }
});

// Русская раскладка клавиатуры (3 ряда)
const keyboardLayout = [
  "ЙЦУКЕНГШЩЗХЪ".split(""), // Верхний ряд
  "ФЫВАПРОЛДЖЭ".split(""),  // Средний ряд
  ["⌫", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Enter"], // Нижний ряд
];

// Генерация экранной клавиатуры
function generateKeyboard() {
  keyboardLayout.forEach((rowLetters, rowIndex) => {
    const row = document.createElement("div");
    row.classList.add("keyboard-row");

    rowLetters.forEach((letter) => {
      if(letter === "⌫") {
        const backspaceKey = document.createElement("div");
        backspaceKey.classList.add("key", "special-key");
        backspaceKey.textContent = "⌫";
        backspaceKey.dataset.action = "Backspace";
        backspaceKey.addEventListener("click", handleBackspace);
        row.appendChild(backspaceKey);
      } else if(letter === "Enter") {
        const enterKey = document.createElement("div");
        enterKey.classList.add("key", "special-key");
        enterKey.textContent = "Enter";
        enterKey.dataset.action = "Enter";
        enterKey.addEventListener("click", checkGuess);
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
    console.log(currentGuess)
  }
}

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

// Проверка текущей попытки
function checkGuess() {
  if (currentGuess.length !== maxWordLength) {
    modalHead.textContent = 'Не хватает букв'
    modalInfo.textContent = "Введите полное слово!";
    modalWindow.style.display = 'block';
    return;
  }

  if (!listWord.some(subArray => subArray.includes(currentGuess.toUpperCase()))) {
    modalHead.textContent = 'Нет такого слова'
    modalInfo.textContent = "В нашем словаре";
    modalWindow.style.display = 'block';
    return
    
  } else {

    const feedback = [];
    const targetWordArray = targetWord.split(""); // Массив из символов targetWord
    const guessedLettersUsed = Array(maxWordLength).fill(false); // Флаги использования букв
    
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
              modalHead.textContent = "Поздравляем!";
              modalInfo.textContent = "Вы угадали слово";
              modalWindow.style.display = "block";
              launchFireworks();
              return;
            }

            if (currentAttempt === attempts - 1) {
              modalHead.textContent = "Вы проиграли!";
              modalInfo.textContent = `Слово было: ${targetWord}`;
              modalWindow.style.display = "block";
              return;
            }

            // Переход к следующей попытке
            currentAttempt++;
            currentGuess = "";
          }
        },
        { once: true } // Срабатывает только один раз для каждой ячейки
      );
    });
  }
}


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

// Обновление клавиатуры с подсветкой
function updateKeyboard(feedback) {
  const keys = document.querySelectorAll(".key");
  currentGuess.split("").forEach((letter, index) => {
    const key = Array.from(keys).find((k) => k.dataset.letter === letter.toUpperCase());
    if (feedback[index] === "correct") {
      key.className = 'key'
      key.classList.add("correct");
    } else if (feedback[index] === "present") {
      key.classList.add("present");
    } else {
      key.classList.add("used");
    }
  });
}

// Инициализация игры
generateKeyboard();

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