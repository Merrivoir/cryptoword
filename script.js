const gasURL = "https://script.google.com/macros/s/AKfycbyxhETGvMWEiFfHP6FRzxxtwtwHUTNqwBLOEv47aObKVYNXsYTuD5WLUvj-D1Il4uhv/exec"

const board = document.getElementById("board");
const keyboardContainer = document.getElementById("keyboard");
const message = document.getElementById("message");

//Переменные для игрового поля
let currentAttempt = 0; // Текущая попытка
let currentGuess = ""; // Слово, которое вводится
let targetWord = ""; // Загаданное 
let maxWordLength;
const attempts = 6; // Количество попыток

// Создаем игровое поле
function createBoard() {
  for (let i = 0; i < attempts; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < maxWordLength; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
    }

    board.appendChild(row);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    const serverResponse = document.getElementById('server-response');

    // Показать сообщение о загрузке
    loading.style.display = 'block';

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
        loading.style.display = 'none';

        // Присвоение содержимого переменной target
        targetWord = data.randomValue.toLowerCase();
        maxWordLength = targetWord.length; // Длина слова
        console.log('Target:', targetWord);

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
    cell.textContent = letter;
    currentGuess += letter.toLowerCase();
  }
}

// Обработка удаления буквы
function handleBackspace() {
  if (currentGuess.length > 0) {
    const row = board.children[currentAttempt];
    const cell = row.children[currentGuess.length - 1];
    cell.textContent = "";
    currentGuess = currentGuess.slice(0, -1);
  }
}

// Проверка текущей попытки
function checkGuess() {
  if (currentGuess.length !== maxWordLength) {
    message.textContent = "Введите полное слово!";
    return;
  }

  const feedback = [];
  const targetWordArray = targetWord.split(""); // Массив из символов targetWord
  const guessedLettersUsed = Array(maxWordLength).fill(false); // Флаги использования букв
  
  // Первая проверка: буквы на правильных местах
  for (let i = 0; i < maxWordLength; i++) {
    if (currentGuess[i] === targetWord[i]) {
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

  updateRow(feedback);
  updateKeyboard(feedback);

  if (currentGuess === targetWord) {
    message.textContent = "Поздравляем! Вы угадали слово!";
    return;
  }

  if (currentAttempt === attempts - 1) {
    message.textContent = `Вы проиграли! Слово было: ${targetWord}`;
    return;
  }

  currentAttempt++;
  currentGuess = "";
}

function updateRow(feedback) {
  const row = board.children[currentAttempt];
  feedback.forEach((status, i) => {
    const cell = row.children[i];
    cell.classList.add(status);
  });
}

// Обновление клавиатуры с подсветкой
function updateKeyboard(feedback) {
  const keys = document.querySelectorAll(".key");
  currentGuess.split("").forEach((letter, index) => {
    const key = Array.from(keys).find((k) => k.dataset.letter === letter.toUpperCase());
    if (feedback[index] === "correct") {
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