const targetWord = "колпак"; // Загаданное слово
const attempts = 6; // Количество попыток
let currentAttempt = 0; // Текущая попытка
let currentGuess = ""; // Слово, которое вводится
const maxWordLength = targetWord.length; // Длина слова

const board = document.getElementById("board");
const keyboardContainer = document.getElementById("keyboard");
const message = document.getElementById("message");

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

// Русская раскладка клавиатуры (3 ряда)
const keyboardLayout = [
  "ЙЦУКЕНГШЩЗХЪ",
  "ФЫВАПРОЛДЖЭ",
  "ЯЧСМИТЬБЮ"
];

// Генерация экранной клавиатуры
function generateKeyboard() {
  keyboardLayout.forEach((rowLetters, rowIndex) => {
    const row = document.createElement("div");
    row.classList.add("keyboard-row");

    rowLetters.split("").forEach((letter) => {
      const key = document.createElement("div");
      key.classList.add("key");
      key.textContent = letter;
      key.dataset.letter = letter;
      key.addEventListener("click", () => handleKeyPress(letter));
      row.appendChild(key);
    });

    // Добавляем "Backspace" и "Enter" в нижний ряд
    if (rowIndex === keyboardLayout.length - 2) {
      const enterKey = document.createElement("div");
      enterKey.classList.add("key", "special-key");
      enterKey.textContent = "Enter";
      enterKey.dataset.action = "Enter";
      enterKey.addEventListener("click", checkGuess);
      row.appendChild(enterKey);
    } else if (rowIndex === 0) {
      const backspaceKey = document.createElement("div");
      backspaceKey.classList.add("key", "special-key");
      backspaceKey.textContent = "⌫";
      backspaceKey.dataset.action = "Backspace";
      backspaceKey.addEventListener("click", handleBackspace);
      row.appendChild(backspaceKey);
    }

    keyboardContainer.appendChild(row);
  });
}

// Обработка нажатия клавиши
function handleKeyPress(letter) {
  if (currentGuess.length < maxWordLength) {
    const row = board.children[currentAttempt];
    const cell = row.children[currentGuess.length];
    cell.textContent = letter;
    currentGuess += letter;
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
  for (let i = 0; i < maxWordLength; i++) {
    if (currentGuess[i] === targetWord[i]) {
      feedback.push("correct");
    } else if (targetWord.includes(currentGuess[i])) {
      feedback.push("present");
    } else {
      feedback.push("absent");
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
    const key = Array.from(keys).find((k) => k.dataset.letter === letter);
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
createBoard();
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